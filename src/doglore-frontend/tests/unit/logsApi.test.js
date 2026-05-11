import { fetchDogHealthLogs, fetchDogTrainingLogs } from '../../src/services/api/logsApi.js';
import { getSubcollectionData } from '../../src/services/dbService.js';

jest.mock('../../src/services/dbService.js', () => ({
  getSubcollectionData: jest.fn(),
}));

describe('logsApi', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('fetchDogHealthLogs', () => {
    it('calls getSubcollectionData with health_logs path', () => {
      fetchDogHealthLogs('dog42');

      expect(getSubcollectionData).toHaveBeenCalledWith('dogs/dog42/health_logs');
    });

    it('returns the result from getSubcollectionData', async () => {
      const logs = [{ id: 'log1', weight: 12.5 }];
      getSubcollectionData.mockResolvedValue(logs);

      const result = await fetchDogHealthLogs('dog42');

      expect(result).toEqual(logs);
    });
  });

  describe('fetchDogTrainingLogs', () => {
    it('calls getSubcollectionData with training_logs path', () => {
      fetchDogTrainingLogs('dog42');

      expect(getSubcollectionData).toHaveBeenCalledWith('dogs/dog42/training_logs');
    });

    it('returns the result from getSubcollectionData', async () => {
      const logs = [{ id: 'log1', command: 'sit', success: true }];
      getSubcollectionData.mockResolvedValue(logs);

      const result = await fetchDogTrainingLogs('dog42');

      expect(result).toEqual(logs);
    });
  });
});
