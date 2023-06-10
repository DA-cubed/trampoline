import { createTheme } from '@mui/material';
import { indigo } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: indigo.A400,
    },
    background: {
      default: '#000000',
    },
  },
  typography: {
    fontFamily: '"Fira Code", monospace',
  },
});

export default darkTheme;