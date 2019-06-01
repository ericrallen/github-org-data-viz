import React from 'react';
import { ApolloProvider } from 'react-apollo';

import client from './graphql/client';
import Home from './components/home';

import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <section className="App">
        <Home />
      </section>
    </ApolloProvider>
  )
}

export default App;
