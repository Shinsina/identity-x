import Route from '@ember/routing/route';
import gql from 'graphql-tag';
import { RouteQueryManager } from 'ember-apollo-client';

const query = gql`
  query EditApplication($input: ApplicationQueryInput!) {
    application(input: $input) {
      id
      name
      email
      description
      loginLinkTemplate {
        subjectLine
        unverifiedVerbiage
        verifiedVerbiage
      }
      language
      contexts {
        id
        name
        email
        description
        loginLinkTemplate {
          subjectLine
          unverifiedVerbiage
          verifiedVerbiage
        }
        language
      }
    }
  }
`;

export default Route.extend(RouteQueryManager, {
  model({ app_id: id }) {
    const variables = { input: { id } };
    return this.apollo.watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'application');
  },
});
