import { fetchGraphQLSchema } from '@/utils/fetchGraphQLSchema';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('fetchGraphQLSchema', () => {
  const mockApiUrl = 'http://example.com/graphql';

  beforeEach(() => {
    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: async () => ({
        data: {
          __schema: {
            types: [
              {
                name: 'Query',
                kind: 'OBJECT',
                fields: [
                  {
                    name: 'hello',
                    type: {
                      name: 'String',
                      kind: 'SCALAR',
                    },
                  },
                ],
              },
            ],
          },
        },
      }),
    } as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch GraphQL schema and return types', async () => {
    const result = await fetchGraphQLSchema(mockApiUrl);

    expect(fetch).toHaveBeenCalledWith(mockApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.any(String),
    });

    expect(result).toEqual([
      {
        name: 'Query',
        kind: 'OBJECT',
        fields: [
          {
            name: 'hello',
            type: {
              name: 'String',
              kind: 'SCALAR',
            },
          },
        ],
      },
    ]);
  });

  it('should throw an error if the response is not ok', async () => {
    const mockResponse = {
      ok: false,
      statusText: 'Not Found',
      json: async () => ({}),
    } as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(fetchGraphQLSchema(mockApiUrl)).rejects.toThrow(
      'Network response was not ok: Not Found'
    );
  });

  it('should throw an error if the schema response is invalid', async () => {
    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: async () => ({}),
    } as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(fetchGraphQLSchema(mockApiUrl)).rejects.toThrow(
      'Invalid schema response'
    );
  });
});
