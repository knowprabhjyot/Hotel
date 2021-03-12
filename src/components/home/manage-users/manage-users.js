import { Box, Button, CircularProgress, makeStyles, Paper, Snackbar } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateUserComponent from './create-user/create-user';
import MuiAlert from '@material-ui/lab/Alert';
import { AuthContext } from '../../../context/authContext';

const columns = [
  { field: 'hotel', headerName: 'Hotel', width: 200 },
  { field: 'email', headerName: 'Email', width: 300 },
  { field: 'role', headerName: 'Role' },
  { field: 'createdAt', headerName: 'Created On', width: 400}
];


export default function ManageUsersComponent() {
  const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const authContext  = useContext(AuthContext);


  const classes = useStyles();
  useEffect(() => {
    getUsersList();
    // eslint-disable-next-line
  }, []);

  const convertDate = (date) => {
    return `${new Date(date).getDate()}/${new Date(date).getMonth()}/${new Date(date).getFullYear()}`;
}


  const getUsersList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
      if (response) {
        const newUsersList = response.data.map(({ _id, email, role, hotel, createdAt }) => {
          return { id: _id, email, role, hotel: hotel.name, createdAt: (createdAt) ? convertDate(createdAt) : '' }
        })
        setUsersList(newUsersList);
        setLoading(false);
        return response;
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const deleteUser = async (id) => {
    if (window.confirm('Do you want to delete User ?')) {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`);
        if (response) {
          const index = usersList.findIndex((item) => item.id === id);
          if (index > 0) {
            usersList.splice(index, 1);
            setMessage('Delete user succesfully');
            setSeverity('success');
            getUsersList();
            setOpen(true);
            setUsersList(usersList);
            setSelectedUser(null);
          }
          return response;
        }
      } catch (error) {
        setLoading(false);
        setMessage(error.message);
        setSeverity('error');
        setOpen(true);
        console.log(error);
      }
    }
  }


  const selectUserList = (e) => {
    setSelectedUser(e.data.id);
  }

  const Alert = ((props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  });


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Box display="flex" width="100%" justifyContent="center">
      <Snackbar onClose={handleClose} open={open} autoHideDuration={2000} >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      { loading ? <CircularProgress color="secondary" /> : null}
      { !loading ? <Box display="flex" flexDirection="column" height="400" width="80%">
        <Box display="flex" marginBottom="8px" justifyContent="space-between">
          <CreateUserComponent />
          {selectedUser ? <Button
            variant="contained"
            color="primary"
            disabled={selectedUser === authContext.userId}
            onClick={() => deleteUser(selectedUser)}
            className={classes.button}
            startIcon={<DeleteIcon />}
          >
            Delete
      </Button> : null}
        </Box>
        <Paper>
          <DataGrid autoHeight onRowSelected={selectUserList} rows={usersList} columns={columns} pageSize={5} />
        </Paper>
      </Box> : null}
    </Box>

  );
}