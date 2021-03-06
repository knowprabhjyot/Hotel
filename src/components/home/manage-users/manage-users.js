import { Box, Button, makeStyles } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateUserComponent from './create-user/create-user';

const columns = [
  { field: 'id', headerName: 'id', width: 400 },
  { field: 'email', headerName: 'Email', width: 400 },
  { field: 'role', headerName: 'Role', width: 400 },
];


export default function ManageUsersComponent() {
  const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const classes = useStyles();
  useEffect(() => {
    getUsersList();
    // eslint-disable-next-line
  }, []);

  const getUsersList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      if (response) {
        const newUsersList = response.data.map(({ _id, email, role }) => {
          return { id: _id, email, role }
        })
        setUsersList(newUsersList);
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteUser = async (id) => {
    if (window.confirm('Do you want to delete User ?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/users/${id}`);
        if (response) {
          const index = usersList.findIndex((item) => item.id === id);
          if (index > 0) {
            usersList.splice(index, 1);
            setUsersList(usersList);
            setSelectedUser(null);
          }
          return response;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }


  const selectUserList = (e) => {
    setSelectedUser(e.data.id);
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Box display="flex" justifyContent="space-between">
        <CreateUserComponent />
      { selectedUser ? <Button
        variant="contained"
        color="primary"
        onClick={() => deleteUser(selectedUser)}
        className={classes.button}
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button> : null}
      </Box>
      <DataGrid autoHeight onRowSelected={selectUserList} rows={usersList} columns={columns} pageSize={5} />
    </div>
  );
}