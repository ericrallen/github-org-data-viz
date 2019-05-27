import React from 'react';
import { Group } from '@vx/group';
import { GradientOrangeRed } from '@vx/gradient';

import makePie from '../../utils/make-pie';

export default ({ data, width, height, margin }) => {
  const white = '#ffffff';
  const black = '#000000';

  const innerRadius = Math.min(width, height) / 2 - 40;
  const outerRadius = innerRadius + 80;
  const centerY = height / 2;
  const centerX = width / 2;

  const companyName = data.organization.name;
  const companyUrl = data.organization.url;

  const orgData = data.organization.membersWithRole.nodes.reduce((containerObject, member) => {
    const { company } = member;

    const formattedCompany = (company) ? company.trim() : 'null';

    if (containerObject[formattedCompany]) {
      containerObject[formattedCompany].value += 1;
    } else {
      containerObject[formattedCompany] = {
        value: 1,
      };
    }

    return containerObject;
  }, {});

  const ourOrgCompanyNameData = [];

  const combinedOrgUsers = {
    value: 0
  };

  const formattedOrgData = [];

  Object.keys(orgData).forEach((company) => {
    if (company.includes(companyName)) {
      ourOrgCompanyNameData.push(Object.assign({}, { label: company }, orgData[company]));
      combinedOrgUsers.value += orgData[company].value;
    } else {
      formattedOrgData.push(Object.assign({}, { label: company }, orgData[company]));
    }
  });

  formattedOrgData.push(Object.assign({}, { label: `${companyName}-ish` }, combinedOrgUsers));

  return (
    <article id="company-graph">
      <header>
        <h2>Team Member Company Names</h2>
        <p>The desired value is <code>@{companyName}</code>, which links the user to the <a href={companyUrl} target="_blank" rel="noopener noreferrer">{companyName}</a> organization.</p>
      </header>
      <svg width={width} height={height}>
        <rect rx={14} width={width} height={height} fill="url('#company-gradients')" />
        <GradientOrangeRed id="company-gradients" />
        <Group top={centerY - margin.top} left={centerX}>
          {makePie(formattedOrgData, innerRadius, false, { text: 'Company Names', top: centerY - 100 })}
          {makePie(ourOrgCompanyNameData, outerRadius, true, { text: `Variations of ${companyName}`, top: centerY - 20 }, { arc: black, text: white })}
        </Group>
      </svg>
    </article>
  );
};
