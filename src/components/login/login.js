import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import MuiAlert from '@material-ui/lab/Alert';
import { CircularProgress, Paper, Snackbar } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
        Big Payment Solution
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Alert = ((props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
});


const useStyles = makeStyles((theme) => ({
  container: {
    border: `1px solid green`,
    borderRadius: '16px',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInComponent() {
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [disabled, setDisabled]= useState(false);
  const authContext  = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = useState('success');

  
  const signIn = async (e) => {
      setDisabled(true);
      e.preventDefault();
      const data = {email, password};
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, data);
        if (response) {
          authContext.login(response.data.user._id,response.data.user.role, response.data.token);
            setTimeout(() => {
              setDisabled(false);
              history.push('/payments');
              window.location.reload();
            }, 1000);
        }
      } catch(error) {
        setSeverity('error');
        setOpen(true);
        setMessage(error.response.data.message);
        setDisabled(false);
      }
  }

  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Paper>
    <Container component="main" maxWidth="xs">
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <CssBaseline />
      <div className={classes.paper}>
        <Box width="250px" height="100">
          <img src="../assets/images/logo.png" alt="logo" style={{width: '100%', height: '100%'}} />
        </Box>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={signIn}>
          <TextField
            variant="outlined"
            margin="normal"
            color="secondary"
            required
            type="email"
            fullWidth
            disabled={disabled}
            id="email"
            label="Email Address"
            name="email"
            onChange={ (e) => setEmail(e.target.value)}
            autoComplete="off"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            color="secondary"
            required
            fullWidth
            disabled={disabled}
            name="password"
            label="Password"
            onChange={ (e) => setPassword(e.target.value)}
            type="password"
            id="password"
            autoComplete="off"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
             <span style={{ marginRight: '8px' }}>
                {(disabled) ? <CircularProgress size={20} /> : null}
              </span>
            Sign In
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </form>
      </div>
      <Box mt={2} mb={2}>
        <Copyright />
      </Box>
    </Container>
    </Paper>
  );
}