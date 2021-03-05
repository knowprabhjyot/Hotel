import { Box, createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import { green, purple } from '@material-ui/core/colors';
import Routes from './routes';
import React from 'react';
import './App.css';
import TabPanelComponent from './components/tab-panel/tabPanel';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box style={{height: '100vh'}}>
        <Grid container>
          <Grid item lg={2}>
          <Box display="flex" justifyContent="flex-start" alignItems="center">
              <h1>
                YOUR  LOGO
              </h1>
            </Box>
          </Grid>
          <Grid item lg={10}></Grid>
          <Grid item lg={2}>
            <TabPanelComponent />
          </Grid>
          <Grid item lg={10}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Routes />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
