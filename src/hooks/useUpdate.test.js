// src/hooks/useUpdate.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import useUpdate from './useUpdate';

const mock = new MockAdapter(axios);

const wrapper = ({ children }) => <Router>{children}</Router>;

describe('useUpdate', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should update data successfully', async () => {
    const mockData = { id: 1, name: 'Updated Citation' };
    mock.onPut('https://apps.laoagcity.gov.ph:3002/dpscitations/1').reply(200, mockData);

    const { result } = renderHook(() => useUpdate('https://apps.laoagcity.gov.ph:3002/dpscitations/1', 'test-token'), { wrapper });

    await act(async () => {
      const data = await result.current.updateData(mockData);
      expect(data).toEqual(mockData);
    });

    expect(result.current.error).toBe('');
  });

  it('should handle unauthorized error', async () => {
    mock.onPut('https://apps.laoagcity.gov.ph:3002/dpscitations/1').reply(401);

    const { result } = renderHook(() => useUpdate('https://apps.laoagcity.gov.ph:3002/dpscitations/1', 'test-token'), { wrapper });

    await act(async () => {
      try {
        await result.current.updateData({ name: 'Updated Citation' });
      } catch (error) {
        expect(result.current.error).toBe('Unauthorized access. Please login again.');
      }
    });
  });

  it('should handle other errors', async () => {
    mock.onPut('https://apps.laoagcity.gov.ph:3002/dpscitations/1').reply(500);

    const { result } = renderHook(() => useUpdate('https://apps.laoagcity.gov.ph:3002/dpscitations/1', 'test-token'), { wrapper });

    await act(async () => {
      try {
        await result.current.updateData({ name: 'Updated Citation' });
      } catch (error) {
        expect(result.current.error).toBe('Failed to update data. Please try again later.');
      }
    });
  });
});
