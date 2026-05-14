import { getCollectionData, getSubcollectionData, createDocument, createSubdocument } from '../../src/services/dbService.js';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

jest.mock('../../src/services/firebase.js', () => ({ db: {} }));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

describe('dbService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getCollectionData', () => {
    it('returns mapped documents from a Firestore collection', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ name: 'Rex' }) },
        { id: '2', data: () => ({ name: 'Max' }) },
      ];
      collection.mockReturnValue('colRef');
      getDocs.mockResolvedValue({ docs: mockDocs });

      const result = await getCollectionData('dogs');

      expect(collection).toHaveBeenCalledWith({}, 'dogs');
      expect(getDocs).toHaveBeenCalledWith('colRef');
      expect(result).toEqual([
        { id: '1', name: 'Rex' },
        { id: '2', name: 'Max' },
      ]);
    });

    it('returns empty array when collection has no documents', async () => {
      collection.mockReturnValue('colRef');
      getDocs.mockResolvedValue({ docs: [] });

      const result = await getCollectionData('breeds');

      expect(result).toEqual([]);
    });

    it('propagates Firestore errors', async () => {
      collection.mockReturnValue('colRef');
      getDocs.mockRejectedValue(new Error('Firestore unavailable'));

      await expect(getCollectionData('dogs')).rejects.toThrow('Firestore unavailable');
    });
  });

  describe('getSubcollectionData', () => {
    it('returns mapped documents for a given subcollection path', async () => {
      const mockDocs = [{ id: 'h1', data: () => ({ value: 12.5, label: 'Month 1' }) }];
      collection.mockReturnValue('subRef');
      getDocs.mockResolvedValue({ docs: mockDocs });

      const result = await getSubcollectionData('dogs/dog1/health_logs');

      expect(collection).toHaveBeenCalledWith({}, 'dogs/dog1/health_logs');
      expect(result).toEqual([{ id: 'h1', value: 12.5, label: 'Month 1' }]);
    });

    it('returns empty array for empty subcollection', async () => {
      collection.mockReturnValue('subRef');
      getDocs.mockResolvedValue({ docs: [] });

      const result = await getSubcollectionData('dogs/dog1/journal');

      expect(result).toEqual([]);
    });

    it('propagates Firestore errors', async () => {
      collection.mockReturnValue('subRef');
      getDocs.mockRejectedValue(new Error('Permission denied'));

      await expect(getSubcollectionData('dogs/dog1/health_logs')).rejects.toThrow('Permission denied');
    });
  });

  describe('createDocument', () => {
    it('adds a document with createdAt and returns the new document ID', async () => {
      collection.mockReturnValue('colRef');
      addDoc.mockResolvedValue({ id: 'new-id' });

      const result = await createDocument('dogs', { name: 'Buddy', breed: 'Husky' });

      expect(addDoc).toHaveBeenCalledWith('colRef', {
        name: 'Buddy',
        breed: 'Husky',
        createdAt: 'mock-timestamp',
      });
      expect(result).toBe('new-id');
    });

    it('calls serverTimestamp to set createdAt', async () => {
      collection.mockReturnValue('colRef');
      addDoc.mockResolvedValue({ id: 'x' });

      await createDocument('dogs', { name: 'Test' });

      expect(serverTimestamp).toHaveBeenCalled();
    });

    it('does not mutate the original data object', async () => {
      collection.mockReturnValue('colRef');
      addDoc.mockResolvedValue({ id: 'y' });
      const originalData = { name: 'Luna' };

      await createDocument('dogs', originalData);

      expect(originalData).toEqual({ name: 'Luna' });
    });
  });

  describe('createSubdocument', () => {
    it('adds a subdocument with createdAt and returns the new document ID', async () => {
      collection.mockReturnValue('subColRef');
      addDoc.mockResolvedValue({ id: 'sub-id' });

      const result = await createSubdocument('dogs/dog1/health_logs', { value: 14.2, label: 'Week 2' });

      expect(collection).toHaveBeenCalledWith({}, 'dogs/dog1/health_logs');
      expect(addDoc).toHaveBeenCalledWith('subColRef', {
        value: 14.2,
        label: 'Week 2',
        createdAt: 'mock-timestamp',
      });
      expect(result).toBe('sub-id');
    });

    it('calls serverTimestamp to set createdAt', async () => {
      collection.mockReturnValue('subColRef');
      addDoc.mockResolvedValue({ id: 'z' });

      await createSubdocument('dogs/dog1/journal', { description: 'A walk' });

      expect(serverTimestamp).toHaveBeenCalled();
    });
  });
});
