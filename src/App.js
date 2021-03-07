import { Box, createMuiTheme, Grid, Snackbar, ThemeProvider } from '@material-ui/core';
import { green, purple } from '@material-ui/core/colors';
import Routes from './routes';
import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import TabPanelComponent from './components/tab-panel/tabPanel';
import { Redirect, useHistory, useLocation } from 'react-router';
import axios from 'axios';
import { AuthContext } from './context/authContext';
import MuiAlert from '@material-ui/lab/Alert';

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

const Alert = ((props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
});



const App = (props) => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [role, setRole] = useState(false);
  const [userId, setUserId] = useState(false);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');

  
  // const [isLoading, setIsloading] = useState(true);

  const login = useCallback((uid,role, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    console.log(role, 'in login');
    if (role === 'admin') {
      setRole(true);
    }
    // setIsloading(false)
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        role: role,
        expiration: tokenExpirationDate.toISOString()
      })
    );
    setOpen(true);
    setSeverity('success');
    setMessage('Successfully logged in');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setRole(false);
    localStorage.removeItem('userData');
    localStorage.removeItem('profileData');
    let token = null
    setOpen(true);
    setSeverity('success');
    setMessage('Successfully logged out');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    history.push('/login');

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
      storedData.role &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId,storedData.role, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  return (
    <AuthContext.Provider
    value={{
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      admin: role,
      login: login,
      logout: logout
    }}
  >
    <ThemeProvider theme={theme}>
      <Box style={{ height: '100vh' }}>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity}>
              {message}
            </Alert>
          </Snackbar>
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
