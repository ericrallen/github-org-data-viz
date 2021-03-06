import { gql } from "apollo-boost";

export default gql`
  query OrgMemberQuery($org:String!, $startDate:DateTime!, $endDate:DateTime!, $members:Int!, $repos:Int!) {
    organization(login: $org) {
      name
      url
      login
      pendingMembers {
        totalCount
      }
      membersWithRole(first: $members) {
        totalCount
        nodes {
          name
          company
          login
          isBountyHunter
          isCampusExpert
          isDeveloperProgramMember
          contributionsCollection(from: $startDate, to: $endDate) {
            hasAnyContributions
            hasAnyRestrictedContributions
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalPullRequestReviewContributions
            totalRepositoriesWithContributedCommits
            totalRepositoriesWithContributedPullRequests
            totalRepositoriesWithContributedIssues
            totalRepositoriesWithContributedPullRequestReviews
            commitContributionsByRepository(maxRepositories: $repos) {
              repository {
                nameWithOwner
                isPrivate
                updatedAt
                owner {
                  login
                }
              }
            }
            pullRequestContributionsByRepository(maxRepositories: $repos) {
              repository {
                nameWithOwner
                isPrivate
                updatedAt
                owner {
                  login
                }
              }
            }
            issueContributionsByRepository(maxRepositories: $repos) {
              repository {
                nameWithOwner
                isPrivate
                updatedAt
                owner {
                  login
                }
              }
            }
            pullRequestReviewContributionsByRepository(maxRepositories: $repos) {
              repository {
                nameWithOwner
                isPrivate
                updatedAt
                owner {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
`;
