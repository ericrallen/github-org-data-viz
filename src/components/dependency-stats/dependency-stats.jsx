import React from 'react';

import getDependencies from '../../utils/get-dependencies';

export default ({ data }) => {
  const repos = [];
  // TODO: gather repos and default branches from data.organization.repositories.nodes
  // and then try to retrieve any package.json files that we can find so we can parse
  // them for dependency weights
  return (
    <h2>Dependencies</h2>
  );
};
