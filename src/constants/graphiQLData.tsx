export const graphBaseURL = 'https://rickandmortyapi.com/graphql';

export const graphBaseQuery = `query ($filter: FilterCharacter) {
  characters(filter: $filter) {
    results {
      name
    }
  }
}
`;
export const graphBase = {
  query: `query ($filter: FilterCharacter) {
    characters(filter: $filter) {
      results {
        name
      }
    }
  }
  `,
  url: 'https://rickandmortyapi.com/graphql',
  headers: [{ key: '', value: '' }],
  variables: `{
    "filter": {
      "name": "Jerry"
    }
  }`,
};
export const shemaQuery = `
{
  __schema {
    types {
      name
      kind
      fields {
        name
        type {
          name
          kind
        }
      }
    }
  }
}
`;

export const decodeEndpoint =
  'GRAPHQL/aHR0cHM6Ly9yaWNrYW5kbW9ydHlhcGkuY29tL2dyYXBocWw=/JTdCJTIycXVlcnklMjIlM0ElMjJxdWVyeSUyMCglMjRmaWx0ZXIlM0ElMjBGaWx0ZXJDaGFyYWN0ZXIpJTIwJTdCJTVDbiUyMCUyMCUyMCUyMGNoYXJhY3RlcnMoZmlsdGVyJTNBJTIwJTI0ZmlsdGVyKSUyMCU3QiU1Q24lMjAlMjAlMjAlMjAlMjAlMjByZXN1bHRzJTIwJTdCJTVDbiUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMG5hbWUlNUNuJTIwJTIwJTIwJTIwJTIwJTIwJTdEJTVDbiUyMCUyMCUyMCUyMCU3RCU1Q24lMjAlMjAlN0QlNUNuJTIwJTIwJTIyJTJDJTIydmFyaWFibGVzJTIyJTNBJTIyJTdCJTVDbiUyMCUyMCUyMCUyMCU1QyUyMmZpbHRlciU1QyUyMiUzQSUyMCU3QiU1Q24lMjAlMjAlMjAlMjAlMjAlMjAlNUMlMjJuYW1lJTVDJTIyJTNBJTIwJTVDJTIySmVycnklNUMlMjIlNUNuJTIwJTIwJTIwJTIwJTdEJTVDbiUyMCUyMCU3RCUyMiU3RA==';
