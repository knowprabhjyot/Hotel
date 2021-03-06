import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Box, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import axios from 'axios';

export default function CreateUserComponent() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('');
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const createUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/users/signup', {
        email,
        password,
        role
      });
      if (response) {
        // setUsersList(newUsersList);
        // return response;
        handleClose();
      }
    } catch (error) {
      console.log(error);
      handleClose();
    }
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Create User
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <form noValidate onSubmit={createUser}>
        <DialogTitle id="form-dialog-title">Create User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can Create a user wit basic details
          </DialogContentText>
        <TextField
            autoFocus
            variant="outlined"
            margin="dense"
            id="name"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            fullWidth
          />
         <TextField
            autoFocus
            variant="outlined"
            required
            margin="dense"
            id="name"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            fullWidth
          />
            <RadioGroup required aria-label="role" name="roleset" value={role} onChange={(e) => setRole(e.target.value)}>
                <Box display="flex">
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                <FormControlLabel value="staff" control={<Radio />} label="Staff" />
                </Box>
            </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary">
            Create
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}