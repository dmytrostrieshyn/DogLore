import { fetchAllBreeds, searchBreeds, fetchBreedById } from '../../src/services/api/breedsApi.js';
import { getCollectionData } from '../../src/services/dbService.js';
import { getDocs, collection, query, where, doc, getDoc } from 'firebase/firestore';

jest.mock('../../src/services/dbService.js', () => ({
  getCollectionData: jest.fn(),
}));

jest.mock('../../src/services/firebase.js', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe('breedsApi', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('fetchAllBreeds', () => {
    it('calls getCollectionData with "breeds" and returns result', async () => {
      const breeds = [{ id: '1', name: 'Labrador' }];
      getCollectionData.mockResolvedValue(breeds);

      const result = await fetchAllBreeds();

      expect(getCollectionData).toHaveBeenCalledWith('breeds');
      expect(result).toEqual(breeds);
    });

    it('returns empty array when collection is empty', async () => {
      getCollectionData.mockResolvedValue([]);

      const result = await fetchAllBreeds();

      expect(result).toEqual([]);
    });
  });

  describe('searchBreeds', () => {
    it('returns mapped documents for given search term', async () => {
      const mockDocs = [{ id: 'b1', data: () => ({ name: 'Beagle', origin: 'UK' }) }];
      collection.mockReturnValue('breedsRef');
      query.mockReturnValue('q');
      where.mockReturnValue('w');
      getDocs.mockResolvedValue({ docs: mockDocs });

      const result = await searchBreeds('Bea');

      expect(getDocs).toHaveBeenCalled();
      expect(result).toEqual([{ id: 'b1', name: 'Beagle', origin: 'UK' }]);
    });

    it('returns empty array when no breeds match', async () => {
      collection.mockReturnValue('breedsRef');
      query.mockReturnValue('q');
      where.mockReturnValue('w');
      getDocs.mockResolvedValue({ docs: [] });

      const result = await searchBreeds('xyz');

      expect(result).toEqual([]);
    });

    it('passes correct range query arguments for prefix search', async () => {
      collection.mockReturnValue('breedsRef');
      query.mockReturnValue('q');
      where.mockReturnValue('w');
      getDocs.mockResolvedValue({ docs: [] });

      await searchBreeds('Lab');

      expect(where).toHaveBeenCalledWith('name', '>=', 'Lab');
      expect(where).toHaveBeenCalledWith('name', '<=', 'Lab');
    });
  });

  describe('fetchBreedById', () => {
    it('returns breed data with id when breed exists', async () => {
      const breedData = { name: 'Poodle', size: 'medium', origin: 'France' };
      doc.mockReturnValue('breedRef');
      getDoc.mockResolvedValue({ exists: () => true, id: 'b1', data: () => breedData });

      const result = await fetchBreedById('b1');

      expect(doc).toHaveBeenCalled();
      expect(result).toEqual({ id: 'b1', name: 'Poodle', size: 'medium', origin: 'France' });
    });

    it('returns null when breed does not exist', async () => {
      doc.mockReturnValue('breedRef');
      getDoc.mockResolvedValue({ exists: () => false });

      const result = await fetchBreedById('nonexistent');

      expect(result).toBeNull();
    });

    it('passes the correct collection and ID to doc', async () => {
      doc.mockReturnValue('breedRef');
      getDoc.mockResolvedValue({ exists: () => false });

      await fetchBreedById('abc123');

      expect(doc).toHaveBeenCalledWith({}, 'breeds', 'abc123');
    });
  });
});
