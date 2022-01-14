import React from 'react';
import { DAppProvider, Kovan, Rinkeby } from '@usedapp/core';
import Header from './components/Header';
import { Container } from '@mui/material';
import Main from './components/Main';

function App() {
  return (
    <DAppProvider config={{
      networks: [Kovan, Rinkeby],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000
      }
      // supportedChains: [ChainId.Kovan, ChainId.Rinkeby]
    }}>
      <Header />
      <Container maxWidth='md'>
        <Main/>
      </Container>
    </DAppProvider>
  );
}

export default App;
