export interface GraphQLField {
  name: string;
  type: {
    name?: string;
    kind: string;
  };
}

export interface GraphQLType {
  name: string;
  kind: string;
  fields?: GraphQLField[];
}

export interface GraphQLSchemaResponse {
  data: {
    __schema: {
      types: GraphQLType[];
    };
  };
}

export interface GraphQLSchema {
  types: GraphQLType[];
}

export const fetchGraphQLSchema = async (
  apiUrl: string
): Promise<GraphQLType[]> => {
  const query = `
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

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok: ' + response.statusText);
  }

  const schemaData = await response.json();

  if (!schemaData || !schemaData.data || !schemaData.data.__schema) {
    throw new Error('Invalid schema response');
  }

  return schemaData.data.__schema.types;
};
