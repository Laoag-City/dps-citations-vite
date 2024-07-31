// src/hooks/useFetch.test.js
import { renderHook } from '@testing-library/react-hooks';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import useFetch from './useFetch';

const mock = new MockAdapter(axios);

const wrapper = ({ children }) => <Router>{children}</Router>;

describe('useFetch', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test Citation' };
    mock.onGet('https://apps.laoagcity.gov.ph:3002/dpscitations/1').reply(200, mockData);

    const { result, waitForNextUpdate } = renderHook(() => useFetch('https://apps.laoagcity.gov.ph:3002/dpscitations/1', 'test-token'), { wrapper });

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should handle unauthorized error', async () => {
    mock.onGet('https://apps.laoagcity.gov.ph:3002/dpscitations/1').reply(401);

    const { result, waitForNextUpdate } = renderHook(() => useFetch('https://apps.laoagcity.gov.ph:3002/dpscitations/1', 'test-token'), { wrapper });

    await waitForNextUpdate();

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Unauthorized access. Please login again.');
  });

  it('should handle other errors', async () => {
    mock.onGet('https://apps.laoagcity.gov.ph:3002/dpscitations/1').reply(500);

    const { result, waitForNextUpdate } = renderHook(() => useFetch('https://apps.laoagcity.gov.ph:3002/dpscitations/1', 'test-token'), { wrapper });

    await waitForNextUpdate();

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to fetch data. Please try again later.');
  });
});
