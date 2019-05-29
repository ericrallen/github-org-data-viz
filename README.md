# github-org-data-viz

This project will eventually allow you to plug in an organization name and will
generate a nice data vizualization dashboard of relevant stats.

## Current Considerations

Currently it expects a hardcoded JSON response from the GitHub GraphQL API.

You can fill out the `variables` in the provided `example.gql` file and run it
through the [GitHub GraphQL API EXplorer](https://developer.github.com/v4/explorer/)
and save the result to `src/.data/github.gql` to see the dashboard until this is
hooked up to the GitHub API.

## Using

1. `git clone` this repo
2. `cd` into your new repo
3. `yarn`
4. Follow the instructions from the **Current Considerations** section above
4. `yarn start`
