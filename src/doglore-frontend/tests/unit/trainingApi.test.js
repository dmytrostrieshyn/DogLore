import { fetchTrainingLogs, updateTrainingNotes, toggleTrainingDate } from '../../src/services/api/trainingApi.js';
import { getSubcollectionData } from '../../src/services/dbService.js';
import { doc, updateDoc, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';

jest.mock('../../src/services/firebase.js', () => ({ db: {} }));

jest.mock('../../src/services/dbService.js', () => ({
  getSubcollectionData: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => 'mock-timestamp'),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
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

  describe('toggleTrainingDate', () => {
    it('calls updateDoc with arrayRemove when the date was already completed', async () => {
      doc.mockReturnValue('dogRef');
      updateDoc.mockResolvedValue(undefined);
      arrayRemove.mockReturnValue('arrayRemoveResult');

      await toggleTrainingDate('dog1', '2024-01-15', true);

      expect(arrayRemove).toHaveBeenCalledWith('2024-01-15');
      expect(updateDoc).toHaveBeenCalledWith('dogRef', {
        completedTrainingDates: 'arrayRemoveResult',
      });
    });

    it('calls updateDoc with arrayUnion when the date was not yet completed', async () => {
      doc.mockReturnValue('dogRef');
      updateDoc.mockResolvedValue(undefined);
      arrayUnion.mockReturnValue('arrayUnionResult');

      await toggleTrainingDate('dog1', '2024-01-15', false);

      expect(arrayUnion).toHaveBeenCalledWith('2024-01-15');
      expect(updateDoc).toHaveBeenCalledWith('dogRef', {
        completedTrainingDates: 'arrayUnionResult',
      });
    });

    it('does not call arrayUnion when removing a date', async () => {
      doc.mockReturnValue('dogRef');
      updateDoc.mockResolvedValue(undefined);
      arrayRemove.mockReturnValue('arrayRemoveResult');

      await toggleTrainingDate('dog1', '2024-01-15', true);

      expect(arrayUnion).not.toHaveBeenCalled();
    });

    it('does not call arrayRemove when adding a date', async () => {
      doc.mockReturnValue('dogRef');
      updateDoc.mockResolvedValue(undefined);
      arrayUnion.mockReturnValue('arrayUnionResult');

      await toggleTrainingDate('dog1', '2024-01-15', false);

      expect(arrayRemove).not.toHaveBeenCalled();
    });

    it('targets the correct dog document', async () => {
      doc.mockReturnValue('dogRef');
      updateDoc.mockResolvedValue(undefined);
      arrayUnion.mockReturnValue('arrayUnionResult');

      await toggleTrainingDate('dog99', '2024-06-01', false);

      expect(doc).toHaveBeenCalledWith({}, 'dogs', 'dog99');
    });
  });
});
