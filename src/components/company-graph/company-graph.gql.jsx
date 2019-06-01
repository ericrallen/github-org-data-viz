import React from 'react';
import { Query } from 'react-apollo';

import CompanyGraph from './company-graph';

import MEMBER_QUERY from '../../graphql/queries/organization/members';

function CompanyGraphWithQuery({ organization, startDate, endDate, ...props }) {
  return (
    <Query query={MEMBER_QUERY} variables={{
      "org": organization,
      "members": 100, //TODO: implement pagination up to process.env.REACT_APP_GITHUB_MAX_MEMBERS
      "repos": parseInt(process.env.REACT_APP_GITHUB_MAX_REPOS, 10),
      "startDate": startDate.toISOString(),
      "endDate": endDate.toISOString(),
    }}>
      {({ loading, error, data }) => {
        if (loading) return (<p>Loading...</p>)

        if (error) {
          console.error(error);

          return (
            <p>Error retrieving members for {organization}.</p>
          );
        }

        console.log(data);

        return (
          <CompanyGraph data={data} {...props} />
        );
      }}
    </Query>
  );
}

export default CompanyGraphWithQuery;
