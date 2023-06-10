import { Box, Stack, Typography, styled } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import cube from '../../../../assets/cube.png';
import {
  getActiveNetwork,
  getSupportedNetworks,
} from '../../../Background/redux-slices/selectors/networkSelectors';
import { useBackgroundSelector } from '../../hooks';

const SpinningImage = styled('img')`
  animation: spin 8s linear infinite;
  transform-origin: center;
  filter: ${({ color }) => `hue-rotate(${color})`};

  @keyframes spin {
    0% {
      transform: rotate(0deg) scale(1);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const activeNetwork = useBackgroundSelector(getActiveNetwork);
  const supportedNetworks = useBackgroundSelector(getSupportedNetworks);

  return (
    <Box
      component="div"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        padding: '22px 12px',
        height: 80,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          padding: '220px 12px',
          height: 60,
        }}
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => navigate('/')}
      >
        <Stack direction="row" spacing={2}>
          <SpinningImage src={cube} height="40px" />
          <SpinningImage src={cube} height="40px" color="60deg" />
          <SpinningImage src={cube} height="40px" color="90deg" />
        </Stack>
        <Typography
          fontWeight={'bold'}
          color={'white'}
          variant="h5"
          fontFamily={'monospace'}
        >
          da
          <sup style={{ fontWeight: 'normal', fontSize: '16px' }}>(cubed)</sup>
        </Typography>
      </Stack>
      {/* <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <FormControl sx={{ minWidth: 80 }}>
          <InputLabel id="chain-selector">Chain</InputLabel>
          <Select
            labelId="chain-selector"
            id="chain-selector"
            value={activeNetwork.chainID}
            label="Chain"
            // onChange={handleChange}
          >
            {supportedNetworks.map((network) => (
              <MenuItem key={network.chainID} value={network.chainID}>
                {network.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <SettingsIcon fontSize="large" />
      </Stack> */}
    </Box>
  );
};

export default Header;
