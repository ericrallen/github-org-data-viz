import React from 'react';

import OrganizationStats from './components/organization-stats';
import CompanyGraph from './components/company-graph';
import RepoNetwork from './components/repo-network';

// TODO: hook up with real data from GitHub GraphQL API
// using the query from ./.data/github-skookums.gql
import { data } from './.data/github';

import './App.css';

function App() {
  return (
    <section className="App">
      <OrganizationStats data={data} width={800} height={480} margin={{ bottom: 80, left: 40, right: 30, top: 0 }} />
      <RepoNetwork data={data} width={800} height={480} />
      <CompanyGraph data={data} width={800} height={480} margin={{ bottom: 80, left: 40, right: 30, top: 0 }} />
    </section>
  );
}

export default App;
