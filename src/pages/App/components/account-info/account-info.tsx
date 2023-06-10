import { Box, Button, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { getAccountInfo } from '../../../Background/redux-slices/selectors/accountSelectors';
import { useBackgroundSelector } from '../../hooks';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import darkTheme from '../../../../assets/themes/darkTheme';

const AccountInfo = ({
  address,
  showOptions = true,
}: {
  address: string;
  showOptions: boolean;
}) => {
  const [tooltipMessage, setTooltipMessage] = useState<string>('Copy address');

  const accountInfo = useBackgroundSelector((state) =>
    getAccountInfo(state, address)
  );

  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    setTooltipMessage('Address copied');
  }, [address]);

  return (
    <Box
      component="div"
      display="flex"
      flexDirection="row"
      alignItems="center"
      sx={{
        position: 'relative',
      }}
    >
      <Box component="div" display="flex" flexDirection="column" flexGrow={1}>
        <Typography
          color={darkTheme.palette.primary.light}
          fontWeight={'bold'}
          pb="8px"
        >
          WALLET INFO
        </Typography>
        <Tooltip title={tooltipMessage} enterDelay={0}>
          <Box
            onClick={copyAddress}
            component="div"
            display="flex"
            flexDirection="column"
            sx={{
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            <Typography variant="h6">{accountInfo.name}</Typography>

            <Box>
              <Button
                startIcon={
                  <ContentCopyIcon sx={{ height: 16, cursor: 'pointer' }} />
                }
              >
                {/* truncate */}
                <Typography
                  variant="overline"
                  sx={{
                    maxWidth: '50vw',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {address}
                </Typography>
              </Button>
            </Box>
          </Box>
        </Tooltip>
      </Box>
      {showOptions && <MoreVertIcon sx={{ position: 'absolute', right: 0 }} />}
    </Box>
  );
};

export default AccountInfo;
