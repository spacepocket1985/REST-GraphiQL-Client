import { add2LocalStorage } from '@/utils/add2LocalStorage';
import { describe, it, expect, beforeEach } from 'vitest';

describe('add2LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add a line to localStorage', () => {
    const searchParam = 'http://example.com/api/endpoint';

    add2LocalStorage(searchParam);

    const result = localStorage.getItem('RestGraphqlHistoryLogs');
    expect(result).toBe(JSON.stringify([searchParam]));
  });

  it('should add some lines to localStorage', () => {
    const searchParam1 = 'http://example.com/api/endpoint1';
    const searchParam2 = 'http://example.com/api/endpoint2';

    add2LocalStorage(searchParam1);
    add2LocalStorage(searchParam2);

    const result = localStorage.getItem('RestGraphqlHistoryLogs');
    expect(result).toBe(JSON.stringify([searchParam1, searchParam2]));
  });

  it('should handle empty value correctly', () => {
    const searchParam = '';

    add2LocalStorage(searchParam);

    const result = localStorage.getItem('RestGraphqlHistoryLogs');
    expect(result).toBe(JSON.stringify(['']));
  });

  it('should handle initial value correctly in localStorage', () => {
    const initialParams = ['http://example.com/api/initial'];
    localStorage.setItem(
      'RestGraphqlHistoryLogs',
      JSON.stringify(initialParams)
    );

    const searchParam = 'http://example.com/api/new';
    add2LocalStorage(searchParam);

    const result = localStorage.getItem('RestGraphqlHistoryLogs');
    expect(result).toBe(JSON.stringify([...initialParams, searchParam]));
  });
});
