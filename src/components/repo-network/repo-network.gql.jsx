import React from 'react';
import { Query } from 'react-apollo';

import RepoNetwork from './repo-network';

import REPO_QUERY from '../../graphql/queries/organization/repositories';

function RepoNetworkWithQuery({ organization, ...props }) {
  return (
    <Query query={REPO_QUERY} variables={{
      "org": organization,
      "repos": parseInt(process.env.REACT_APP_GITHUB_MAX_REPOS, 10),
    }}>
      {({ data, error, loading }) => {
        if (loading) return (<p>Loading...</p>)

        if (error) {
          console.error(error);

          return (
            <p>Error retrieving repostories for {organization}.</p>
          );
        }

        return (
          <RepoNetwork data={data} {...props} />
        );
      }}
    </Query>
  );
}

export default RepoNetworkWithQuery;
