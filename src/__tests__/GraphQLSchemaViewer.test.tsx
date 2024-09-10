import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GraphQLSchemaViewer } from '@/components/graphiQLEditor/GraphQLSchemaViewer';

export const mockData = {
  types: [
    {
      name: 'User',
      kind: 'OBJECT',
      fields: [
        {
          name: 'id',
          type: {
            name: 'ID',
            kind: 'SCALAR',
          },
        },
        {
          name: 'name',
          type: {
            name: 'String',
            kind: 'SCALAR',
          },
        },
        {
          name: 'email',
          type: {
            name: 'String',
            kind: 'SCALAR',
          },
        },
        {
          name: 'friends',
          type: {
            name: 'User',
            kind: 'LIST',
          },
        },
      ],
    },
    {
      name: 'Post',
      kind: 'OBJECT',
      fields: [
        {
          name: 'id',
          type: {
            name: 'ID',
            kind: 'SCALAR',
          },
        },
        {
          name: 'title',
          type: {
            name: 'String',
            kind: 'SCALAR',
          },
        },
        {
          name: 'content',
          type: {
            name: 'String',
            kind: 'SCALAR',
          },
        },
        {
          name: 'author',
          type: {
            name: 'User',
            kind: 'OBJECT',
          },
        },
      ],
    },
    {
      name: 'Query',
      kind: 'OBJECT',
      fields: [
        {
          name: 'users',
          type: {
            name: 'User',
            kind: 'LIST',
          },
        },
        {
          name: 'posts',
          type: {
            name: 'Post',
            kind: 'LIST',
          },
        },
      ],
    },
  ],
};

describe('GraphQLSchemaViewer', () => {
  it('renders without crashing', () => {
    render(GraphQLSchemaViewer(mockData));
    expect(screen.getByText(/GraphQL Schema/i)).toBeInTheDocument();
  });

  it('renders types  fields', () => {
    render(GraphQLSchemaViewer(mockData));

    const fieldId = screen.getAllByText(/id/i);
    expect(fieldId[0]).toBeInTheDocument();

    const fieldemail = screen.getAllByText(/email/i);
    expect(fieldemail[0]).toBeInTheDocument();
  });

  it('renders an empty state message when no data is provided', () => {
    render(GraphQLSchemaViewer({ types: [] }));
    expect(
      screen.getByText(/No types found in the schema/i)
    ).toBeInTheDocument();
  });

  it('displays the correct kind for each type', () => {
    render(GraphQLSchemaViewer(mockData));

    const kindOBJECT = screen.getAllByText(/OBJECT/i);
    expect(kindOBJECT[0]).toBeInTheDocument();
    expect(kindOBJECT.length).equal(3);

    const kindSCALAR = screen.getAllByText(/SCALAR/i);
    expect(kindSCALAR[1]).toBeInTheDocument();
    expect(kindSCALAR.length).equal(6);

    const kindLIST = screen.getAllByText(/LIST/i);
    expect(kindLIST[2]).toBeInTheDocument();
    expect(kindLIST.length).equal(3);
  });
});
