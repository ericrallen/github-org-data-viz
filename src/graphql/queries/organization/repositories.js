import { gql } from "apollo-boost";

export default gql`
  query OrgRepositoryQuery($org:String!, $repos:Int!) {
    organization(login: $org) {
      repositories(first: $repos, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          name
          nameWithOwner
          licenseInfo {
            nickname
          }
          defaultBranchRef {
            name
          }
          #resourcePath
          #dependencyGraphManifests {
            #nodes {
              #dependencies {
                #nodes {
                  #packageName
                  #packageManager
                  #repository
                #}
              #}
            #}
          #}
        }
      }
    }
  }
`;
