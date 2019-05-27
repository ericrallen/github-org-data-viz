import React from 'react';
import { Group } from '@vx/group';
import { GradientOrangeRed } from '@vx/gradient';

// TODO: Interate with the Bamboo API to grab this data
import { employees } from '../../.data/skookum-employees';

import makePie from '../../utils/make-pie';

export default ({ data, width, height, margin }) => {
  const white = '#ffffff';
  const black = '#000000';

  const innerRadius = Math.min(width, height) / 2 - 40;
  const outerRadius = innerRadius + 80;
  const centerY = height / 2;
  const centerX = width / 2;

  const { organization } = data;

  const people = organization.membersWithRole.nodes
    .map((member) => {
      if (member.name) {
        const nameArray = member.name.split(' ');

        return `${nameArray[0]} ${nameArray[nameArray.length - 1]}`;
      } else {
        return null;
      }
    })
    .filter(name => name)
  ;

  const validMembers = people.reduce((validPeople, person) => {
    if (employees.indexOf(person) !== -1) {
      validPeople += 1;
    }

    return validPeople;
  }, 0);

  const contributionStats = organization.membersWithRole.nodes.reduce((contributionsObject, member) => {
    const {
      hasAnyContributions,
    } = member.contributionsCollection;

    if (!Object.keys(contributionsObject).length) {
      contributionsObject = {
        totalCommits: 0,
        totalPullRequests: 0,
        totalIssues: 0,
        totalPullRequestReviews: 0,
        totalCommitRepos: 0,
        totalPullRequestRepos: 0,
        totalIssueRepos: 0,
        totalPullRequestReviewRepos: 0,
      }
    }

    if (hasAnyContributions) {
      const {
        // hasAnyRestrictedContributions,
        totalCommitContributions,
        totalPullRequestContributions,
        totalIssueContributions,
        totalPullRequestReviewContributions,
        totalRepositoriesWithContributedCommits,
        totalRepositoriesWithContributedPullRequests,
        totalRepositoriesWithContributedIssues,
        totalRepositoriesWithContributedPullRequestReviews,
        // commitContributionsByRepository,
        // pullRequestContributionsByRepository,
        // issueContributionsByRepository,
        // pullRequestReviewContributionsByRepository,
      } = member.contributionsCollection;

      contributionsObject.totalCommits = contributionsObject.totalCommits + totalCommitContributions;
      contributionsObject.totalPullRequests = contributionsObject.totalPullRequests + totalPullRequestContributions;
      contributionsObject.totalIssues = contributionsObject.totalIssues + totalIssueContributions;
      contributionsObject.totalPullRequestReviews = contributionsObject.totalPullRequestReviews + totalPullRequestReviewContributions;
      contributionsObject.totalCommitRepos = contributionsObject.totalCommitRepos + totalRepositoriesWithContributedCommits;
      contributionsObject.totalPullRequestRepos = contributionsObject.totalPullRequestRepos + totalRepositoriesWithContributedPullRequests;
      contributionsObject.totalIssueRepos = contributionsObject.totalIssueRepos + totalRepositoriesWithContributedIssues;
      contributionsObject.totalPullRequestReviewRepos = contributionsObject.totalPullRequestReviewRepos + totalRepositoriesWithContributedPullRequestReviews;
    }

    return contributionsObject;
  }, {});

  const reportDate = new Date().toLocaleDateString(process.env.REACT_APP_LOCALE, { month: 'long', year: 'numeric' });

  const contributionData = [];
  const repoData = [];

  const statKeyMap = {
    totalCommits: 'Commits',
    totalPullRequests: 'PRs',
    totalIssues: 'Issues',
    totalPullRequestReviews: 'Reviews',
    totalCommitRepos: 'Commits',
    totalPullRequestRepos: 'PRs',
    totalIssueRepos: 'Issues',
    totalPullRequestReviewRepos: 'Reviews',
  };

  Object.keys(contributionStats).forEach((stat) => {
    if (stat.endsWith('Repos')) {
      repoData.push({
        label: statKeyMap[stat],
        value: contributionStats[stat]
      });
    } else {
      contributionData.push({
        label: statKeyMap[stat],
        value: contributionStats[stat],
      });
    }
  });

  const totalRepos = repoData.reduce((total, repoStat) => {
    return total += repoStat.value;
  }, 0);

  const totalContributions = contributionData.reduce((total, contributionStat) => {
    return total += contributionStat.value;
  }, 0);

  return (
    <section>
      <header>
        <h1>{organization.name} GitHub Analysis</h1>
        <h2>Stats for {reportDate}</h2>
        <p>
          <strong>Organization URL</strong>:&nbsp;
          <a href={organization.url} target="_blank" rel="noopener noreferrer">
            {organization.url}
          </a>
        </p>
        <p>
          <strong>Team Members</strong>: {organization.membersWithRole.totalCount + organization.pendingMembers.totalCount}* (<em>{organization.pendingMembers.totalCount} pending</em>)
          <br />
          <sub><em>*Only {validMembers} are recognized as employees.</em></sub>
        </p>
      </header>
      <article>
        <header>
          <h2>Contribution Activity</h2>
          <p>How many repositories did our team memebers contribute to? How many total contributions were made across the organization?</p>
        </header>
        <svg width={width} height={height}>
          <rect rx={14} width={width} height={height} fill="url('#org-gradients')" />
          <GradientOrangeRed id="org-gradients" />
          <Group top={centerY - margin.top} left={centerX}>
            {makePie(repoData, innerRadius, false, { text: `Repos: ${totalRepos}`, top: centerY - 100 }, { arc: black, text: white })}
            {makePie(contributionData, outerRadius, true, { text: `Total Contributions: ${totalContributions}`, top: centerY - 20 })}
          </Group>
        </svg>
      </article>
    </section>
  );
};
