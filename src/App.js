import { Box, createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import { green, purple } from '@material-ui/core/colors';
import Routes from './routes';
import React, { useEffect, useState } from 'react';
import './App.css';
import TabPanelComponent from './components/tab-panel/tabPanel';
import { useHistory, useLocation } from 'react-router';

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
  const [isLoggedIn, setLogin] = useState(false);
  const history = useLocation();

  useEffect(() => {
    setLogin(history.pathname);
    console.log(history.pathname);
  })

  return (
    <ThemeProvider theme={theme}>
      <Box style={{ height: '100vh' }}>
        <Grid container>
          <Grid item lg={2}>
            { isLoggedIn !== '/login' ?             <Box display="flex" justifyContent="center">
              <h1>Your Logo</h1>
            </Box> : null}
          </Grid>
          <Grid item lg={12}></Grid>
          <Grid item lg={2}>
            {isLoggedIn !== '/login' ? <TabPanelComponent /> : null}
          </Grid>
          <Grid item lg={isLoggedIn === '/login' ? 12 : 10}>
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
