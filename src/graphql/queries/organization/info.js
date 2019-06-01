import { gql } from "apollo-boost";

export default gql`
  query query($org:String!, $members:Int!) {
    organization(login: $org) {
      name
      url
      websiteUrl
      avatarUrl
      description
      pinnedItemsRemaining
      location
      isVerified
      pendingMembers {
        totalCount
      }
      membersWithRole(first: $members) {
        totalCount
      }
    }
  }
`;
