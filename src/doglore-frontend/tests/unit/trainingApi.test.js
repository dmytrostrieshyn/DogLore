import { fetchTrainingLogs, updateTrainingNotes } from '../../src/services/api/trainingApi.js';
import { getSubcollectionData } from '../../src/services/dbService.js';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

jest.mock('../../src/services/firebase.js', () => ({ db: {} }));

jest.mock('../../src/services/dbService.js', () => ({
  getSubcollectionData: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
}));

describe('trainingApi', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('fetchTrainingLogs', () => {
    it('calls getSubcollectionData with training_logs path', () => {
      fetchTrainingLogs('dog1');

      expect(getSubcollectionData).toHaveBeenCalledWith('dogs/dog1/training_logs');
    });

    it('returns logs from getSubcollectionData', async () => {
      const logs = [{ id: 'l1', command: 'shake' }];
      getSubcollectionData.mockResolvedValue(logs);

      const result = await fetchTrainingLogs('dog1');

      expect(result).toEqual(logs);
    });
  });

  describe('updateTrainingNotes', () => {
    it('calls updateDoc with correct fields and returns true on success', async () => {
      doc.mockReturnValue('dogRef');
      updateDoc.mockResolvedValue(undefined);

      const result = await updateTrainingNotes('dog1', 'Good boy today');

      expect(doc).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalledWith('dogRef', {
        trainingNotes: 'Good boy today',
        notesUpdatedAt: 'mock-timestamp',
      });
      expect(result).toBe(true);
    });

    it('returns false when updateDoc throws', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      doc.mockReturnValue('dogRef');
      updateDoc.mockRejectedValue(new Error('Firestore error'));

      const result = await updateTrainingNotes('dog1', 'note');

      expect(result).toBe(false);
      jest.restoreAllMocks();
    });

    it('uses serverTimestamp for notesUpdatedAt field', async () => {
      doc.mockReturnValue('dogRef');
      updateDoc.mockResolvedValue(undefined);

      await updateTrainingNotes('dog1', 'test');

      expect(serverTimestamp).toHaveBeenCalled();
    });
  });
});
