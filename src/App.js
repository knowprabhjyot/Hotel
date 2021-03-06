import { Box, createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import { green, purple } from '@material-ui/core/colors';
import Routes from './routes';
import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import TabPanelComponent from './components/tab-panel/tabPanel';
import { Redirect, useHistory, useLocation } from 'react-router';
import axios from 'axios';
import { AuthContext } from './context/authContext';

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

let logoutTimer;

const App = (props) => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  // const [isLoading, setIsloading] = useState(true);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    // setIsloading(false)
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('profileData');
    let token = null
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    // setIsloading(false)
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);


  return (
    <AuthContext.Provider
    value={{
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login: login,
      logout: logout
    }}
  >
    <ThemeProvider theme={theme}>
      <Box style={{ height: '100vh' }}>
        <Grid container>
          <Grid item lg={2}>
            { token ?  <Box display="flex" justifyContent="center">
              <h1>Your Logo</h1>
            </Box> : null}
          </Grid>
          <Grid item lg={12}></Grid>
          <Grid item lg={2}>
            {token ? <TabPanelComponent /> : null}
          </Grid>
          <Grid item lg={!token ? 12 : 10}>
            <Box display="flex" justifyContent="center" alignItems="center">
            { token ? <Redirect exact from="/" to="/payments" /> : <Redirect exact from="/" to="/login" />}
              <Routes />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
