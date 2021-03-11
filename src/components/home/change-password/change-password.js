import { Box, Button, CircularProgress, Grid, makeStyles, Paper, Snackbar, TextField } from '@material-ui/core';
import axios from 'axios';
import React, { useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';

const ChangePasswordComponent = () => {
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [disabled, setDisabled]= useState(false);

    
    const useStyles = makeStyles((theme) => ({
        submitContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        submit: {
            margin: '8px 0px'
        },
        paper: {
            padding: theme.spacing(4)
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
          },
    }));

    const classes = useStyles();
    const Alert = ((props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    });

    const resetPassword = async (e) => {
        setDisabled(true);
        e.preventDefault();
        const data = {password, newPassword};
        try {
          const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/reset-password`, data);
          if (response) {
            setMessage(response.data.message);
            setOpen(true);
            setSeverity('success');
            setDisabled(false);
          }
        } catch(error) {
          setSeverity('error');
          setOpen(true);
          setMessage(error.response.data.message);
          setDisabled(false);
        }
        setPassword('');
        setNewPassword('');
    }

    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    
  

    return (
        <Box display="grid" gridGap="32px" width="50%">
            <form className={classes.form} onSubmit={resetPassword}>
                <Snackbar onClose={handleClose} open={open} autoHideDuration={2000} >
                    <Alert onClose={handleClose} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
                <Paper className={classes.paper}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                color="secondary"
                                required
                                fullWidth
                                disabled={disabled}
                                value={password}
                                name="password"
                                label="Current Password"
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                autoComplete="off"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                color="secondary"
                                required
                                fullWidth
                                disabled={disabled}
                                value={newPassword}
                                name="newPassword"
                                label="New Password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="password"
                                id="newPassword"
                                autoComplete="off"
                            />
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            disabled={disabled}
                            className={classes.submit}
                        >
                            <span style={{ marginRight: '8px' }}>
                                {(disabled) ? <CircularProgress size={20} /> : null}
                            </span>
                            Reset Password
                        </Button>
                    </Grid>
                </Paper>
            </form>
        </Box>
    )
}

export default ChangePasswordComponent;