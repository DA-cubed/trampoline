import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';

const AccountInfo = ({
  activeAccount,
  accountInfo,
}: {
  activeAccount: string;
  accountInfo: { name: string };
}) => {
  return (
    <Paper sx={{ bgcolor: 'primary.main', p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Stack>
          <Typography
            variant="overline"
            color="primary.contrastText"
            sx={{ fontFamily: 'Fira Code' }}
          >
            Account Name
          </Typography>
          <Typography
            color="primary.contrastText"
            variant="body1"
            sx={{ fontFamily: 'Fira Code' }}
          >
            {accountInfo.name}
          </Typography>
        </Stack>
        <Stack>
          <Typography
            variant="overline"
            color="primary.contrastText"
            sx={{ fontFamily: 'Fira Code' }}
          >
            Address
          </Typography>
          <Typography
            variant="subtitle1"
            color="primary.contrastText"
            sx={{ fontFamily: 'Fira Code' }}
          >
            ({activeAccount?.substring(0, 5)}...
            {activeAccount?.substring(activeAccount.length - 5)})
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AccountInfo;
