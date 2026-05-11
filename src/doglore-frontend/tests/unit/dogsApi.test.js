import { fetchDogFullProfile, fetchDogWeightHistory } from '../../src/services/api/dogsApi.js';
import { getSubcollectionData } from '../../src/services/dbService.js';
import { doc, getDoc } from 'firebase/firestore';

jest.mock('../../src/services/firebase.js', () => ({ db: {} }));

jest.mock('../../src/services/dbService.js', () => ({
  getSubcollectionData: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
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

    it('returns undefined on Firestore error', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      doc.mockReturnValue('dogRef');
      getDoc.mockRejectedValue(new Error('Firestore unavailable'));

      const result = await fetchDogFullProfile('d1');

      expect(result).toBeUndefined();
      jest.restoreAllMocks();
    });
  });

  describe('fetchDogWeightHistory', () => {
    it('calls getSubcollectionData with correct health_logs path', () => {
      fetchDogWeightHistory('dog42');

      expect(getSubcollectionData).toHaveBeenCalledWith('dogs/dog42/health_logs');
    });
  });
});
