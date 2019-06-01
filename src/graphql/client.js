import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = new HttpLink({ uri: process.env.REACT_APP_GITHUB_API_ENDPOINT });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: `bearer ${process.env.REACT_APP_GITHUB_API_TOKEN}` || null,
    }
  });

  return forward(operation);
});

const cache = new InMemoryCache();

const link = concat(authMiddleware, httpLink);

const client = new ApolloClient({
  link,
  cache,
});

export default client;
