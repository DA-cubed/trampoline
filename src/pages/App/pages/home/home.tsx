import { Box, Card, CardContent, Container, Stack } from '@mui/material';
import React from 'react';
import { getActiveAccount } from '../../../Background/redux-slices/selectors/accountSelectors';
import AccountBalanceInfo from '../../components/account-balance-info';
import AccountInfo from '../../components/account-info';
import Header from '../../components/header';
import TransferAssetButton from '../../components/transfer-asset-button';
import { useBackgroundSelector } from '../../hooks';

const Home = () => {
  const activeAccount = useBackgroundSelector(getActiveAccount);

  return (
    <Container sx={{ width: '100vw', height: '100vh', gap: '4' }}>
      <Header />
      <Stack gap="4" spacing="4">
        {activeAccount && (
          <Card sx={{ marginBottom: '12px' }}>
            <CardContent>
              <AccountInfo address={activeAccount}></AccountInfo>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent>
            <Box
              component="div"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              sx={{ m: 2 }}
            >
              <AccountBalanceInfo address={activeAccount} />
            </Box>
            <Box
              component="div"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              sx={{ m: 4 }}
            >
              <TransferAssetButton activeAccount={activeAccount || ''} />
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

export default Home;
