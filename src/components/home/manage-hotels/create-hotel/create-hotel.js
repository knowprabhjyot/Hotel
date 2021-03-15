import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { CircularProgress, Snackbar } from '@material-ui/core';
import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';

export default function CreateHotelComponent(props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('success');
  const [disabled, setDisabled] = React.useState(false);

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


  const createHotel = async (e) => {
    setDisabled(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/hotel`, {
        name,
        address
      });
      if (response) {
        setMessage(response.data.message);
        props.updateHotelList(response.data.data);
        setOpen(true);
        setSeverity('success');
        setDisabled(false);
        handleCloseDialog();
      }
    } catch (error) {
      console.log(error, 'error');
      setDisabled(false);
      (error.response.data.message) ? setMessage(error.response.data.message) : setMessage('Something went wrong');
      setSeverity('error');
      setOpen(true);
      handleCloseDialog();
    }
    setName('');
    setAddress('');
  }



  return (
    <div>
      <Snackbar onClose={handleClose} open={open} autoHideDuration={2000} >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Create Hotel
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
      <form onSubmit={createHotel}>
        <DialogTitle id="form-dialog-title">Create Hotel</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can Create a hotel with basic details
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
            variant="outlined"
            margin="normal"
            id="address"
            disabled={disabled}
            color="secondary"
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            required
            fullWidth
        />
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