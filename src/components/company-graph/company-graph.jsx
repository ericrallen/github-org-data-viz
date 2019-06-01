import React from 'react';
import { Group } from '@vx/group';
import { GradientOrangeRed } from '@vx/gradient';

import makePie from '../../utils/make-pie';

function CompanyGraph({ data: { organization }, width, height, margin }) {
  const white = '#ffffff';
  const black = '#000000';

  const innerRadius = Math.min(width, height) / 2 - 40;
  const outerRadius = innerRadius + 80;
  const centerY = height / 2;
  const centerX = width / 2;

  const companyName = organization.name;
  const companyUrl = organization.url;
  const companySlug = organization.login;

  const orgData = organization.membersWithRole.nodes.reduce((containerObject, member) => {
    const { company } = member;

    const checkForMultipleMentions = company && company.indexOf('@') !== -1 && company.lastIndexOf('@') !== 0;

    if (checkForMultipleMentions) {
      console.log(company);

      company.split('@').forEach((companyWithoutMention) => {
        const formattedCompany = `@${companyWithoutMention.trim()}`;

        if (containerObject[formattedCompany]) {
          containerObject[formattedCompany].value += 1;
        } else {
          containerObject[formattedCompany] = {
            value: 1,
          };
        }
      });
    } else {
      const formattedCompany = (company) ? company.trim() : 'null';

      if (containerObject[formattedCompany]) {
        containerObject[formattedCompany].value += 1;
      } else {
        containerObject[formattedCompany] = {
          value: 1,
        };
      }
    }

    return containerObject;
  }, {});

  const ourOrgCompanyNameData = [];

  const combinedOrgUsers = {
    value: 0
  };

  const formattedOrgData = [];

  Object.keys(orgData).forEach((userCompany) => {
    const checkForMultipleMentions = userCompany && userCompany.indexOf('@') !== -1 && userCompany.lastIndexOf('@') !== 0;

    if (checkForMultipleMentions) {
      userCompany.split('@').forEach((companyWithoutMention) => {
        const company = `@${companyWithoutMention.trim()}`;

        const companyNameRegEx = new RegExp(`${companyName}|${companySlug}`, 'i');

        if (companyNameRegEx.test(company)) {
          ourOrgCompanyNameData.push(Object.assign({}, { label: company }, orgData[company]));
          combinedOrgUsers.value += orgData[company].value;
        } else {
          formattedOrgData.push(Object.assign({}, { label: company }, orgData[company]));
        }
      });
    } else {
      const companyNameRegEx = new RegExp(`${companyName}|${companySlug}`, 'i');

      if (companyNameRegEx.test(userCompany)) {
        ourOrgCompanyNameData.push(Object.assign({}, { label: userCompany }, orgData[userCompany]));
        combinedOrgUsers.value += orgData[userCompany].value;
      } else {
        formattedOrgData.push(Object.assign({}, { label: userCompany }, orgData[userCompany]));
      }
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
}

export default CompanyGraph;
