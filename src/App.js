import { Box, createMuiTheme, Grid, Hidden, makeStyles, Snackbar, ThemeProvider } from '@material-ui/core';
import { blueGrey, red } from '@material-ui/core/colors';
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
      main: red[700],
    },
    secondary: {
      main: blueGrey[900],
    },
  },
});

let logoutTimer;

const Alert = ((props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
});


const useStyles = makeStyles({
  logoContainer: {
    margin: '16px 0px' 
  },
  logo: {
    width: '100%',
    height: '100px',
    padding: '8px'
  }
});

const App = (props) => {
  const classes = useStyles();
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
        <Grid item xs={3} sm={2}>
          <Box display="flex" alignItems>
            {token ? 
            <Box display="flex" flexDirection="column">
               <img className={classes.logo} src="../assets/images/logo.png" alt="logo" />
              <TabPanelComponent />
            </Box>
            : null}
          </Box>
          </Grid>
          <Grid item xs={!token ? 12 : 9} sm={!token ? 12 : 10}  >
            <Box marginTop="100px" display="flex" justifyContent="center" alignItems="center" >
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
