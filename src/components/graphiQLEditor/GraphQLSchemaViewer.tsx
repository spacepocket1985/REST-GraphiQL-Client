'use client';
import { GraphQLType } from '@/utils/fetchGraphQLSchema';
import React from 'react';
import styles from './GraphQLSchemaViewer.module.css';

export const GraphQLSchemaViewer: React.FC<{ types: GraphQLType[] }> = ({
  types,
}) => {
  return (
    <div className={styles.schemaContainer}>
      <h1>GraphQL Schema</h1>
      <ul>
        {types.map((type) => (
          <li key={type.name}>
            <div className={styles.kindWrapper}>
              <span className={styles.kind}>{type.kind}:</span>
              <span className={styles.kindName}>{type.name}</span>
            </div>
            {type.fields && type.fields.length > 0 && (
              <ul className={styles.fields}>
                {type.fields.map((field) => (
                  <li key={field.name}>
                    Field: <strong>{field.name}</strong> (Type:{' '}
                    {field.type.kind === 'OBJECT'
                      ? field.type.name
                      : field.type.kind}
                    )
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {types.length === 0 && <p>No types found in the schema.</p>}
    </div>
  );
};

export default GraphQLSchemaViewer;
