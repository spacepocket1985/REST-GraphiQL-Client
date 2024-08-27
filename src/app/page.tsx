'use client';

import styles from './page.module.css';
import { UILink } from '@/components/ui/UILink';

import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/spinner/Spinner';
import { RoutePaths } from '@/constants/routePaths';

export default function WelcomePage() {
  const { user, name, isLoading } = useAuth();
  if (isLoading) return <Spinner />;

  return (
    <>
      <div className={styles.welcomeWrapper}>
        <h2>{name ? `Welcome Back, ${name}!` : 'Welcome!'}</h2>
        {user ? (
          <>
            <div className="welcomeSection">
              <h3 className={styles.wrapperSubTitle}>
                Available utilities and features
              </h3>
              <div className={styles.welcomeTools}>
                <UILink text="REST Client" href="" />
                <UILink text="GraphiQL Client" href={RoutePaths.GRAPHIQL} />
                <UILink text="History" href="" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.welcomeSection}>
              <h3 className={styles.welcomeSectionTitle}>Info about task</h3>
              <p className={styles.welcomeSectionInfo}>
                lightweight application that combines the functionalities of two
                leading API clients: Postman and GraphiQL. It is designed for
                developers working with both REST and GraphQL APIs, providing an
                intuitive interface for creating, testing, and documenting
                requests.
              </p>
            </div>
            <div className={styles.welcomeSection}>
              <h3 className={styles.welcomeSectionTitle}>
                About Postman [for sticky header]
              </h3>
              <p className={styles.welcomeSectionInfo}>
                Postman started in 2012 as a side project of software engineer
                Abhinav Asthana, who wanted to simplify API testing while
                working at Yahoo Bangalore. He named his app Postman – a play on
                the API request “POST” – and offered it free in the Chrome Web
                Store. As the apps usage grew to 500,000 users with no
                marketing, Abhinav recruited former colleagues Ankit Sobti and
                Abhijit Kane to help create Postman, Inc. The three co-founders
                lead the company today, with Abhinav serving as CEO and Ankit as
                CTO. In 2023, Postman announced it had acquired Akita, an API
                observability solution. In 2024, Postman acquired Orbit, a
                solution for building and managing developer communities.
              </p>
              <ul className={styles.welcomeList}>
                <b>Postman features include:</b>
                <li>
                  Workspaces: Personal, team, partner, and public workspaces
                  allow for API collaboration internally and externally
                </li>
                <li>
                  API repository: Allows users to store, catalog, and
                  collaborate around API artifacts in a central platform within
                  public, private, or partner networks
                </li>
                <li>
                  API builder: Helps implement an API design workflow through
                  specifications including OpenAPI, GraphQL, and RAML.
                  Integrates varied source controls, CI/CD, gateways, and APM
                  solutions
                </li>
                <li>
                  Tools: API client, API design, API documentation, API testing,
                  mock servers, and API detection
                </li>
                <li>
                  Intelligence: Security warnings, API repository search,
                  workspaces, reporting, API governance
                </li>
              </ul>
              <p className={styles.welcomeSectionInfo}>
                Postman v11 was released in May 2024. The update includes
                AI-powered features to help developers with API test generation,
                documentation, debugging, and data visualization.[7] V11 also
                enables more users to share API collections with external
                partners.
              </p>
            </div>
            <div className={styles.welcomeSection}>
              <h3 className={styles.welcomeSectionTitle}>
                About Postman [for sticky header]
              </h3>
              <p className={styles.welcomeSectionInfo}>
                GraphQL is a data query and manipulation language for APIs, that
                allows a client to specify what data it needs (declarative data
                fetching). A GraphQL server can fetch data from separate sources
                for a single client query and present the results in a unified
                graph, so it is not tied to any specific database or storage
                engine. The associated GraphQL runtime engine is open-source.
              </p>
              <p className={styles.welcomeSectionInfo}>
                GraphQL supports reading, writing (mutating), and subscribing to
                changes to data (realtime updates – commonly implemented using
                WebSockets).[8] A GraphQL service is created by defining types
                with fields, then providing functions to resolve the data for
                each field. The types and fields make up what is known as the
                schema definition. The functions that retrieve and map the data
                are called resolvers.[9] After being validated against the
                schema, a GraphQL query is executed by the server. The server
                returns a result that mirrors the shape of the original query,
                typically as JSON.[10]
              </p>
              <p className={styles.welcomeSectionInfo}>
                GraphQL does not provide a full-fledged graph query language
                such as SPARQL, or even in dialects of SQL that support
                transitive closure. For example, a GraphQL interface that
                reports the parents of an individual cannot return, in a single
                query, the set of all their ancestors.
              </p>
              <p className={styles.welcomeSectionInfo}>
                The root type of a GraphQL schema, Query by default, contains
                all of the fields that can be queried. Other types define the
                objects and fields that the GraphQL server can return. There are
                several base types, called scalars, to represent things like
                strings, numbers, and IDs. Fields are defined as nullable by
                default, and a trailing exclamation mark can be used to make a
                field non-nullable (required). A field can be defined as a list
                by wrapping the fields type in square brackets (for example,
                authors: [String]).
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
