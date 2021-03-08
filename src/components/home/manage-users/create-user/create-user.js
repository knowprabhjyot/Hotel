import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, CircularProgress, FormControlLabel, Radio, RadioGroup, Snackbar } from '@material-ui/core';
import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';

export default function CreateUserComponent() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const Alert = ((props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  });



  const createUser = async (e) => {
    setDisabled(true);
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/signup', {
        email,
        password,
        role,
        name
      });
      if (response) {
        // setUsersList(newUsersList);
        // return response;
        setMessage('User Created successfully');
        setOpen(true);
        setLoading(false);
        setSeverity('success');
        setDisabled(false);
        handleCloseDialog();
      }
    } catch (error) {
      console.log(error, 'error');
      setLoading(false);
      setDisabled(false);
      (error.response.data.message) ? setMessage(error.response.data.message) : setMessage('Something went wrong');
      setSeverity('error');
      setOpen(true);
      handleCloseDialog();
    }
    setEmail('');
    setPassword('');  
    setName('');
    setRole('');
  }



  return (
    <div>
      <Snackbar onClose={handleClose} open={open} autoHideDuration={2000} >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Create User
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
      <form onSubmit={createUser}>
        <DialogTitle id="form-dialog-title">Create User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can Create a user with basic details
          </DialogContentText>
          <TextField
            autoFocus
            variant="outlined"
            margin="normal"
            id="name"
            disabled={disabled}
            color="secondary"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required
            fullWidth
          />
        <TextField
            autoFocus
            variant="outlined"
            margin="normal"
            id="email"
            disabled={disabled}
            color="secondary"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            fullWidth
          />
         <TextField
            variant="outlined"
            required
            margin="normal"
            disabled={disabled}
            color="secondary"
            id="name"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            fullWidth
          />
            <RadioGroup required aria-label="role" name="roleset" value={role} onChange={(e) => setRole(e.target.value)}>
                <Box display="flex">
                <FormControlLabel value="admin" control={<Radio required />} label="Admin" />
                <FormControlLabel value="staff" control={<Radio required />} label="Staff" />
                </Box>
            </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit" color="secondary">
              <span style={{ marginRight: '8px' }}>
                {(disabled) ? <CircularProgress size={20} /> : null}
              </span>
            Create
          </Button>
          <Button variant="contained" onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}