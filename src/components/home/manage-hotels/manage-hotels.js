import { Box, Button, CircularProgress, makeStyles, Paper, Snackbar } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import MuiAlert from '@material-ui/lab/Alert';
import CreateHotelComponent from './create-hotel/create-hotel';
import UpdateHotelComponent from './update-hotel/update-hotel';

const columns = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'address', headerName: 'Address', width: 300 },
  { field: 'createdAt', headerName: 'Created On', width: 400}
];


export default function ManageHotelsComponent() {
  const useStyles = makeStyles((theme) => ({
  }));

  const [hotelList, setHotelList] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');


  const classes = useStyles();
  useEffect(() => {
    getHotelList();
    // eslint-disable-next-line
  }, []);


const convertDate = (givenDate) => {
  let date = new Date(givenDate);
  return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
}

    const getHotelList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/hotel`);
            if (response) {
                const newhotelList = response.data.data.map(({ _id, name, address, createdAt }) => {
                    return { id: _id, name, address , createdAt: (createdAt) ? convertDate(createdAt) : '' }
                })
                setHotelList(newhotelList);
                setLoading(false);
                return response;
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

  const deleteHotel = async (id) => {
    if (window.confirm('Do you want to delete Hotel ?')) {
      try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/hotel/${id}`);
        const index = hotelList.findIndex((item) => item.id === id);
        if (index !== -1) {
            const hotelL = hotelList;
            hotelL.splice(index, 1);
            setHotelList([...hotelL]);
            setMessage(response.data.message);
            setSeverity('success');
            setOpen(true);
            setHotelList(hotelList);
            setSelectedHotel(null);
        }
        return response;
      } catch (error) {
        setLoading(false);
        setMessage(error.message);
        setSeverity('error');
        setOpen(true);
        console.log(error);
      }
    }
  }


  const selectHotelList = (e) => {
    setSelectedHotel(e.data);
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

  const updateHotelData = (hotel) => {
      const hotelL = hotelList;
      const { _id } = hotel;
      hotel.id = _id;
      delete hotel._id;
      hotel.createdAt = convertDate(hotel.createdAt);
      hotelL.push(hotel);
      setHotelList([...hotelL]);
  }

  const updateHotelDetails = (hotel) => {
    const hotelL = hotelList.map((hot) => {
      if (hotel.id === hot.id) {
        hot.name = hotel.name;
        hot.address = hotel.address;
      }
      return hot;
    })
    setHotelList([...hotelL]);
  }



  return (
    <Box display="flex" width="100%" justifyContent="center">
      <Snackbar onClose={handleClose} open={open} autoHideDuration={2000} >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      { loading ? <CircularProgress color="secondary" /> : null}
      { !loading ? <Box display="flex" flexDirection="column" height="400" width="80%">
        <Box display="flex" marginBottom="8px">
          <CreateHotelComponent hoteList={hotelList} updateHotelList={(e) => updateHotelData(e)} />
          { selectedHotel ? <UpdateHotelComponent updateHotelList={e => updateHotelDetails(e)} hotel={selectedHotel} /> : null}
          {selectedHotel ? <Button
            style={{margin: '0px 8px'}}
            variant="contained"
            color="primary"
            onClick={() => deleteHotel(selectedHotel.id)}
            startIcon={<DeleteIcon />}
          >
            Delete
      </Button> : null}
        </Box>
        <Paper>
          <DataGrid autoHeight onRowSelected={selectHotelList} rows={hotelList} columns={columns} pageSize={5} />
        </Paper>
      </Box> : null}
    </Box>

  );
}