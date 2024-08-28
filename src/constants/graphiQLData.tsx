export const graphBaseURL = 'https://rickandmortyapi.com/graphql';

export const graphBaseQuery = `query ($filter: FilterCharacter) {
  characters(filter: $filter) {
    results {
      name
    }
  }
}
`;
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
