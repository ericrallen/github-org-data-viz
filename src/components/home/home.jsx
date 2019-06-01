import React, { useState, Fragment } from 'react';
import { Query } from 'react-apollo';
import debounce from 'lodash.debounce';

import Search from '../search';
import OrganizationStats from '../organization-stats';
import CompanyGraph from '../company-graph';
import RepoNetwork from '../repo-network';
import DependencyStats from '../dependency-stats';

import ORGANIZATION_QUERY from '../../graphql/queries/organization/info';


// TODO: separate <Query /> into it's own `home.gql.jsx` file and have it render <Home />
function Home() {
  const today = new Date();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [organizationName, setOrganizationName] = useState("");
  const [graphWidth, setGraphWidth] = useState(window.innerWidth - 40);

  // TODO: add filtering for past 30 (default), 60, 90 days
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);

  const debouncedResize = debounce(() => setGraphWidth(window.innerWidth - 40), 50);

  window.addEventListener('resize', debouncedResize);

  return (
    <React.Fragment>
      {!organizationName &&
        <Search onSubmit={setOrganizationName} query={organizationName} />
      }

      {organizationName &&
        <Query query={ORGANIZATION_QUERY} variables={{
          "org": organizationName,
          "members": 100, //TODO: implement pagination up to process.env.REACT_APP_GITHUB_MAX_MEMBERS
        }}>
          {({ loading, error, data }) => {
            if (loading) return <p>Getting data for {organizationName}...</p>;

            if (error) {
              console.error(error);

              return (
                <Fragment>
                  <h2>We couldn't find any data for {organizationName}.</h2>
                  <Search onSubmit={setOrganizationName} query={organizationName} />
                </Fragment>
              );
            }

            // TODO: reimplement the RepoNetwork below with the new separated GraphQL query approach
            // TODO: figure out how to get DependencyStats data since `dependencyGraphManifests` doesn't seem to exist in the API yet
            return (
              <Fragment>
                <OrganizationStats
                  data={data}
                  startDate={startDate}
                  endDate={endDate}
                  width={graphWidth}
                  height={480}
                  margin={{ bottom: 80, left: 40, right: 30, top: 0 }}
                />
                {/*<RepoNetwork organization={organizationName} width={800} height={480} />*/}
                {/*<DependencyStats organization={organizationName} />*/}
                <CompanyGraph
                  organization={organizationName}
                  startDate={startDate}
                  endDate={endDate}
                  width={graphWidth}
                  height={480}
                  margin={{ bottom: 80, left: 40, right: 30, top: 0 }}
                />
              </Fragment>
            );
          }}
        </Query>
      }
    </React.Fragment>
  );
};

export default Home;
