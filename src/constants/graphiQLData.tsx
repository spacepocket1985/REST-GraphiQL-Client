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
