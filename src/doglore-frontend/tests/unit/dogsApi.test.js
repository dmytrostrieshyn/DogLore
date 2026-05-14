import {
  fetchDogFullProfile,
  fetchDogWeightHistory,
  registerDog,
  updateDogProfile,
  addWeightEntry,
  addGalleryPhoto,
  updateCommandProgress,
  fetchJournalEntries,
  addJournalEntry,
  addNewCommand,
  fetchDogGallery,
  updateTrainingNotes,
  fetchTrainingLogs,
} from '../../src/services/api/dogsApi.js';
import { getSubcollectionData, createDocument, createSubdocument } from '../../src/services/dbService.js';
import { doc, getDoc, updateDoc, arrayUnion, collection } from 'firebase/firestore';

jest.mock('../../src/services/firebase.js', () => ({ db: {} }));

jest.mock('../../src/services/dbService.js', () => ({
  getSubcollectionData: jest.fn(),
  createDocument: jest.fn(),
  createSubdocument: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn(),
  collection: jest.fn(),
}));

describe('dogsApi', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('fetchDogFullProfile', () => {
    it('returns dog data with breedInfo when both dog and breed exist', async () => {
      const dogData = { name: 'Rex', breed_id: 'b1' };
      const breedData = { name: 'Labrador', size: 'large' };

      doc.mockReturnValueOnce('dogRef').mockReturnValueOnce('breedRef');
      getDoc
        .mockResolvedValueOnce({ exists: () => true, id: 'd1', data: () => dogData })
        .mockResolvedValueOnce({ exists: () => true, data: () => breedData });

      const result = await fetchDogFullProfile('d1');

      expect(doc).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ id: 'd1', ...dogData, breedInfo: breedData });
    });

    it('returns dog data with null breedInfo when breed does not exist', async () => {
      const dogData = { name: 'Rex', breed_id: 'b99' };

      doc.mockReturnValueOnce('dogRef').mockReturnValueOnce('breedRef');
      getDoc
        .mockResolvedValueOnce({ exists: () => true, id: 'd1', data: () => dogData })
        .mockResolvedValueOnce({ exists: () => false });

      const result = await fetchDogFullProfile('d1');

      expect(result).toEqual({ id: 'd1', ...dogData, breedInfo: null });
    });

    it('returns null when dog does not exist', async () => {
      doc.mockReturnValue('dogRef');
      getDoc.mockResolvedValue({ exists: () => false });

      const result = await fetchDogFullProfile('unknown');

      expect(result).toBeNull();
    });

    it('returns dog data without fetching breed when breed_id is absent', async () => {
      const dogData = { name: 'Rex' };

      doc.mockReturnValueOnce('dogRef');
      getDoc.mockResolvedValueOnce({ exists: () => true, id: 'd1', data: () => dogData });

      const result = await fetchDogFullProfile('d1');

      expect(doc).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 'd1', ...dogData, breedInfo: null });
    });
  });

  describe('fetchDogWeightHistory', () => {
    it('calls getSubcollectionData with correct health_logs path', () => {
      fetchDogWeightHistory('dog42');

      expect(getSubcollectionData).toHaveBeenCalledWith('dogs/dog42/health_logs');
    });
  });

  describe('registerDog', () => {
    it('calls createDocument with dogs collection and returns the new dog ID', async () => {
      createDocument.mockResolvedValue('new-dog-id');

      const result = await registerDog({ name: 'Max', breed_id: 'b1' });

      expect(createDocument).toHaveBeenCalledWith('dogs', { name: 'Max', breed_id: 'b1' });
      expect(result).toBe('new-dog-id');
    });
  });

  describe('fetchTrainingLogs', () => {
    it('calls getSubcollectionData with training_logs path', () => {
      fetchTrainingLogs('dog1');

      expect(getSubcollectionData).toHaveBeenCalledWith('dogs/dog1/training_logs');
    });

    it('returns logs from getSubcollectionData', async () => {
      const logs = [{ id: 'l1', name: 'Sit', progress: 40 }];
      getSubcollectionData.mockResolvedValue(logs);

      const result = await fetchTrainingLogs('dog1');

      expect(result).toEqual(logs);
    });
  });

  describe('addNewCommand', () => {
    it('creates a training log entry with name and initial progress of 0', async () => {
      createSubdocument.mockResolvedValue('cmd-id');

      const result = await addNewCommand('dog1', 'Sit');

      expect(createSubdocument).toHaveBeenCalledWith('dogs/dog1/training_logs', {
        name: 'Sit',
        progress: 0,
      });
      expect(result).toBe('cmd-id');
    });
  });

  describe('fetchDogGallery', () => {
    it('calls getSubcollectionData with chronology path', () => {
      fetchDogGallery('dog1');

      expect(getSubcollectionData).toHaveBeenCalledWith('dogs/dog1/chronology');
    });

    it('returns photos from getSubcollectionData', async () => {
      const photos = [{ id: 'p1', imageURL: 'https://example.com/img.jpg', ageLabel: '2 months' }];
      getSubcollectionData.mockResolvedValue(photos);

      const result = await fetchDogGallery('dog1');

      expect(result).toEqual(photos);
    });
  });

  describe('updateDogProfile', () => {
    it('calls updateDoc on the correct dog document with given fields', async () => {
      doc.mockReturnValue('dogRef');
      updateDoc.mockResolvedValue(undefined);

      await updateDogProfile('dog1', { name: 'Rex', color: 'brown' });

      expect(doc).toHaveBeenCalledWith({}, 'dogs', 'dog1');
      expect(updateDoc).toHaveBeenCalledWith('dogRef', { name: 'Rex', color: 'brown' });
    });
  });

  describe('addWeightEntry', () => {
    it('creates a health_logs entry with numeric value and label', async () => {
      createSubdocument.mockResolvedValue('entry-id');

      const result = await addWeightEntry('dog1', '12.5', 'Week 1');

      expect(createSubdocument).toHaveBeenCalledWith('dogs/dog1/health_logs', {
        value: 12.5,
        label: 'Week 1',
      });
      expect(result).toBe('entry-id');
    });

    it('converts string value to number', async () => {
      createSubdocument.mockResolvedValue('entry-id');

      await addWeightEntry('dog1', '8', 'Day 1');

      expect(createSubdocument).toHaveBeenCalledWith('dogs/dog1/health_logs', {
        value: 8,
        label: 'Day 1',
      });
    });
  });

  describe('addGalleryPhoto', () => {
    it('creates a chronology entry with imageURL and ageLabel', async () => {
      createSubdocument.mockResolvedValue('photo-id');

      const result = await addGalleryPhoto('dog1', 'https://example.com/photo.jpg', '3 months');

      expect(createSubdocument).toHaveBeenCalledWith('dogs/dog1/chronology', {
        imageURL: 'https://example.com/photo.jpg',
        ageLabel: '3 months',
      });
      expect(result).toBe('photo-id');
    });

    it('defaults ageLabel to empty string when not provided', async () => {
      createSubdocument.mockResolvedValue('photo-id');

      await addGalleryPhoto('dog1', 'https://example.com/photo.jpg');

      expect(createSubdocument).toHaveBeenCalledWith('dogs/dog1/chronology', {
        imageURL: 'https://example.com/photo.jpg',
        ageLabel: '',
      });
    });
  });

  describe('updateCommandProgress', () => {
    it('updates training log with the given progress value', async () => {
      doc.mockReturnValue('cmdRef');
      updateDoc.mockResolvedValue(undefined);

      await updateCommandProgress('dog1', 'cmd1', 50);

      expect(updateDoc).toHaveBeenCalledWith('cmdRef', { progress: 50 });
    });

    it('clamps progress to maximum of 100', async () => {
      doc.mockReturnValue('cmdRef');
      updateDoc.mockResolvedValue(undefined);

      await updateCommandProgress('dog1', 'cmd1', 150);

      expect(updateDoc).toHaveBeenCalledWith('cmdRef', { progress: 100 });
    });

    it('clamps progress to minimum of 0', async () => {
      doc.mockReturnValue('cmdRef');
      updateDoc.mockResolvedValue(undefined);

      await updateCommandProgress('dog1', 'cmd1', -10);

      expect(updateDoc).toHaveBeenCalledWith('cmdRef', { progress: 0 });
    });

    it('passes the correct nested document reference', async () => {
      doc.mockReturnValue('cmdRef');
      updateDoc.mockResolvedValue(undefined);

      await updateCommandProgress('dog5', 'cmd9', 70);

      expect(doc).toHaveBeenCalledWith({}, 'dogs', 'dog5', 'training_logs', 'cmd9');
    });
  });

  describe('fetchJournalEntries', () => {
    it('calls getSubcollectionData with journal path', () => {
      fetchJournalEntries('dog1');

      expect(getSubcollectionData).toHaveBeenCalledWith('dogs/dog1/journal');
    });

    it('returns journal entries from getSubcollectionData', async () => {
      const entries = [{ id: 'e1', description: 'Good day', imageURL: '' }];
      getSubcollectionData.mockResolvedValue(entries);

      const result = await fetchJournalEntries('dog1');

      expect(result).toEqual(entries);
    });
  });

  describe('addJournalEntry', () => {
    it('creates a journal entry with imageURL and description', async () => {
      createSubdocument.mockResolvedValue('entry-id');

      const result = await addJournalEntry('dog1', 'https://example.com/img.jpg', 'A great day at the park');

      expect(createSubdocument).toHaveBeenCalledWith('dogs/dog1/journal', {
        imageURL: 'https://example.com/img.jpg',
        description: 'A great day at the park',
      });
      expect(result).toBe('entry-id');
    });
  });

  describe('updateTrainingNotes', () => {
    it('calls updateDoc with trainingNotes and completedTrainingDates', async () => {
      doc.mockReturnValue('dogRef');
      arrayUnion.mockReturnValue('arrayUnionResult');
      updateDoc.mockResolvedValue(undefined);

      await updateTrainingNotes('dog1', 'Good training session');

      expect(updateDoc).toHaveBeenCalledWith('dogRef', {
        trainingNotes: 'Good training session',
        completedTrainingDates: 'arrayUnionResult',
      });
    });

    it('uses arrayUnion to add today\'s date in YYYY-MM-DD format', async () => {
      doc.mockReturnValue('dogRef');
      updateDoc.mockResolvedValue(undefined);
      arrayUnion.mockReturnValue('arrayUnionResult');

      await updateTrainingNotes('dog1', 'note');

      const calledWith = arrayUnion.mock.calls[0][0];
      expect(calledWith).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
