import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import { indigo } from '@mui/material/colors';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../general.css';

import {
  useBackgroundDispatch,
  useBackgroundSelector,
} from '../../../App/hooks';
import {
  denyOrRevokePermission,
  grantPermission,
} from '../../../Background/redux-slices/permissions';
import {
  getAccountInfo,
  getActiveAccount,
} from '../../../Background/redux-slices/selectors/accountSelectors';
import { selectCurrentPendingPermission } from '../../../Background/redux-slices/selectors/dappPermissionSelectors';
import AccountInfo from '../../components/account-info';
import OriginInfo from '../../components/origin-info';
import darkTheme from '../../../../assets/themes/darkTheme';
import { AspectRatio } from '@mui/icons-material';

const DappPermission = () => {
  const permission = useBackgroundSelector(selectCurrentPendingPermission);
  const [awaitingBackgroundDispatch, setAwaitingBackgroundDispatch] =
    useState(false);

  const activeAccount = useBackgroundSelector(getActiveAccount);
  const accountInfo = useBackgroundSelector((state) =>
    getAccountInfo(state, activeAccount)
  );

  const navigate = useNavigate();
  const backgroundDispatch = useBackgroundDispatch();

  useEffect(() => {
    if (!permission && !awaitingBackgroundDispatch) navigate('/');
  }, [permission, awaitingBackgroundDispatch, navigate]);

  const deny = useCallback(async () => {
    console.log('is this the problem?');
    // The denyOrRevokePermission will be dispatched in the onbeforeunload effect
    if (typeof permission !== 'undefined') {
      setAwaitingBackgroundDispatch(true);
      await backgroundDispatch(
        denyOrRevokePermission({
          ...permission,
        })
      );
    }
    window.close();
  }, [permission, backgroundDispatch]);

  const grant = useCallback(async () => {
    if (
      typeof permission !== 'undefined' &&
      typeof activeAccount !== 'undefined'
    ) {
      setAwaitingBackgroundDispatch(true);
      await backgroundDispatch(
        grantPermission({
          ...permission,
          accountAddress: activeAccount, // make sure address is matching current account
          state: 'allow',
        })
      );
    }
    window.close();
  }, [backgroundDispatch, permission, activeAccount]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          backgroundColor: darkTheme.palette.background.default,
          minHeight: '100vh',
          width: '100vw',
        }}
      >
        <Container>
          <Typography
            variant="h6"
            color={darkTheme.palette.primary.light}
            fontSize={20}
            py={2}
            pt={8}
          >
            CONNECTION REQUEST
          </Typography>
          <AccountInfo
            accountInfo={accountInfo}
            activeAccount={activeAccount || ''}
          />
          <Stack spacing={2} sx={{ position: 'relative', pt: 2, mb: 4 }}>
            <OriginInfo permission={permission} />
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Requesting permissions
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">• See address</Typography>
                <Typography variant="body2">• Account Balance</Typography>
                <Typography variant="body2">
                  • Past transactions activity
                </Typography>
                <Typography variant="body2">
                  • Suggest new transactions for approvals
                </Typography>
                <Typography variant="body2">• Request signatures</Typography>
              </Stack>
            </Paper>
          </Stack>
          <Box
            justifyContent="space-between"
            alignItems="center"
            display="flex"
            gap={2}
          >
            <Button sx={{ width: 150 }} variant="outlined" onClick={deny}>
              Reject
            </Button>
            <Button
              sx={{ width: 150 }}
              variant="contained"
              color="primary"
              onClick={grant}
            >
              Connect
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DappPermission;
