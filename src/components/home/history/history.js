import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router';
import { DateRangePicker } from "materialui-daterange-picker";
import jsPDF from 'jspdf'
import 'jspdf-autotable';
import { AuthContext } from '../../../context/authContext';

const HistoryComponent = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('success');
    const [orderBy, setOrderBy] = useState('hotel');
    const [order, setOrder] = React.useState('asc');
    const [starting_after, setStarting] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [fetched, setFetched] = useState(false);
    const [openDate, setOpenDate] = React.useState(false);
    const [dateRange, setDateRange] = React.useState(null);
    const [filterDate, setFilterDate] = React.useState('');
    const [hotelList, setHotelList] = useState([]);
    const [hotel, setHotel] = useState('');
    const [category, setFilterCategory] = useState('');
    const authContext  = useContext(AuthContext);

    const history = useHistory();
    useEffect(() => {
        getPaymentHistory();
        getHotelList();
        // eslint-disable-next-line
    }, []);

    const useStyles = makeStyles({
        root: {
            width: '100%',
        },
        container: {
        },
        paper: {
            display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'center',
            minHeight: '300px'
        }
    });
    const classes = useStyles();
    const columns = [
        { id: 'createdAt', label: 'Transaction Date' },
        { id: 'hotel', label: 'Hotel Name' },
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'contact', label: 'Contact' },
        { id: 'checkIn', label: 'CheckIn' },
        { id: 'checkOut', label: 'CheckOut' },
        { id: 'amount', label: 'Amount' },
        { id: 'action', label: 'Action' }
    ];

    const getPaymentHistory = async () => {
        setLoading(true);
        try {
            const startingAfter = (starting_after.length > 0) ? `&starting_after=${starting_after}` : '';
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/payments?limit=${10}${startingAfter}`);
            if (response) {
                if (response.data.data.length === 0) {
                    setHasMore(false);
                }
                setPaymentHistory(paymentHistory.concat(response.data.data));
                setMessage(response.data.message);
                setSeverity('success');
                setOpen(true);
                setLoading(false);
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

    const Alert = ((props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    });

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };


    const displayHotelList = () => {
        return (
            hotelList.map((item) => {
                return <MenuItem value={item._id}>{item.name}</MenuItem>
            })
        )
    }

    const downloadHistoryPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            html: '#my-table',
            styles: { fontSize: 8 },
            theme: 'grid',
            columnStyles: { 0: { minCellWidth: '100px' }, 1: { minCellWidth: '100px' }, 2: { minCellWidth: '100px' } }, // Cells in first column centered and green
        });

        const docName = (filterDate) ? filterDate : 'history';
        doc.save(`${docName}.pdf`);

    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const toggle = () => setOpenDate(!openDate);

    const chooseDate = (range) => {
        setDateRange(range);
        setOpenDate(false);
        let { startDate, endDate } = range;
        startDate = convertDate(startDate);
        endDate = convertDate(endDate);
        setFilterDate(`${startDate} - ${endDate}`)
    }

    const getHotelList = async () => {
        try {
            const hotelList = await axios.get(`${process.env.REACT_APP_API_URL}/hotel`);
            setHotelList(hotelList.data.data);
        } catch (error) {
            setMessage(error.message);
            setSeverity('error');
            setOpen(true);
        }
    }

    const convertDate = (givenDate) => {
        let date = new Date(givenDate);
        return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
    }

    const fetchMoreData = async () => {
        setFetched(true);
        const id = paymentHistory[paymentHistory.length - 1].id;
        const filterData = (dateRange) ? `&gte=${Math.floor(dateRange.startDate.getTime() / 1000)}&lte=${Math.floor(dateRange.endDate.getTime() / 1000)}` : '';
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/payments?limit=${10}&starting_after=${id}${filterData}`);
        if (response.data.data.length === 0) {
            setHasMore(false);
        }
        setStarting(id);
        setPaymentHistory(paymentHistory.concat(response.data.data));
        setFetched(false);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const createRefund = async (event, value) => {
        event.preventDefault();
        if (window.confirm('Do you want to refund the amount ?')) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/payments/refund`, value);
                setMessage(response.data.message);
                history.push('/');
                history.replace('/history');
                setOpen(true);
                setSeverity('success');
                setTimeout(() => {
                }, 1000);
            } catch (error) {
                console.log(error);
                setMessage(error.response.data.message);
                setOpen(true);
                setSeverity('error');
            }
        }
    }

    const filterHistoryByDate = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/payments?limit=${10}&gte=${Math.floor(dateRange.startDate.getTime() / 1000)}&lte=${Math.floor(dateRange.endDate.getTime() / 1000)}`);
            setPaymentHistory(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setMessage(error.response.data.message);
            setOpen(true);
            setSeverity('error');
            setLoading(false);
        }
    }

    const filterHistoryByHotel = async (e) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/payments?limit=${10}&hotel=${hotel}`);
            setPaymentHistory(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setMessage(error.response.data.message);
            setOpen(true);
            setSeverity('error');
            setLoading(false);
        }
    }

    const clearFilter = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/payments?limit=${10}`);
            setPaymentHistory(response.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setMessage(error.response.data.message);
            setOpen(true);
            setSeverity('error');
        }
        setDateRange(null);
        setFilterDate('');
    }

    return (
        <Box display="flex" width="90%" justifyContent="center" alignItems="center" height="100%">
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} >
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
            { loading ? <CircularProgress color="secondary" /> : null}
            { !loading ? <Grid container>
                <Box display="flex" flexDirection="column" className={classes.root}>
                    <Paper className={classes.paper}>
                        <div className={classes.root} >
                            <Grid item style={{ margin: '16px' }}>
                                <Box display="flex" flexDirection="column">
                                    <Box display="flex" alignItems="center">
                                        <FormControl required margin="normal" style={{width: '200px'}} variant="outlined">
                                            <InputLabel required id="Select Hotel">Filter By</InputLabel>
                                            <Select
                                                labelId="hotel"
                                                id="hotel"
                                                value={category}
                                                onChange={(e) => setFilterCategory(e.target.value)}
                                                label="Hotel"
                                            >
                                                <MenuItem value="">None</MenuItem>
                                                { authContext.admin ? <MenuItem value={1}>Hotel</MenuItem> : null}
                                                <MenuItem value={2}>Transaction Date</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {
                                            category === 1 && authContext.admin ?
                                                <Box display="flex" alignItems="center" >
                                                    <FormControl required margin="normal" style={{ marginLeft: '30px', width: '200px' }} variant="outlined">
                                                        <InputLabel required id="Select Hotel">Hotel</InputLabel>
                                                        <Select
                                                            labelId="hotel"
                                                            id="hotel"
                                                            value={hotel}
                                                            onChange={(e) => setHotel(e.target.value)}
                                                            label="Hotel"
                                                        >
                                                            <MenuItem value="">None</MenuItem>
                                                            {displayHotelList()}
                                                        </Select>
                                                    </FormControl>
                                                    <Button onClick={filterHistoryByHotel} disabled={hotel.length === 0} style={{ marginLeft: '16px' }} variant="contained" color="primary">
                                                        Filter
                                                    </Button>
                                                </Box>
                                                : null
                                        }
                                        {
                                            category === 2 ?
                                                <Box display="flex" alignItems="center" >
                                                    <TextField
                                                        label="Filter History"
                                                        name="filterDate"
                                                        variant="outlined"
                                                        color="secondary"
                                                        required
                                                        value={filterDate}
                                                        margin="normal"
                                                        type="text"
                                                        style={{marginLeft: '30px', width: '200px'}}
                                                        autoComplete="off"
                                                        onFocus={e => setOpenDate(!openDate)}
                                                        onClick={e => setOpenDate(!openDate)}
                                                    />
                                                    <Button onClick={filterHistoryByDate} disabled={!dateRange} style={{ marginLeft: '16px' }} variant="contained" color="primary">
                                                        Filter
                                            </Button>
                                                </Box>

                                                : null}
                                        <Button onClick={clearFilter} style={{ marginLeft: '16px' }} variant="contained" color="secondary">
                                            Clear Filter
                                        </Button>
                                        <Button disabled={paymentHistory.length === 0} onClick={downloadHistoryPdf} style={{ marginLeft: '16px' }} variant="contained" color="warning">
                                            Download History
                                        </Button>
                                    </Box>
                                    <DateRangePicker
                                            open={openDate}
                                            toggle={toggle}
                                            onChange={(range) => chooseDate(range)}
                                        />
                                </Box>

                            </Grid>
                            {paymentHistory.length > 0 ? <Grid item>
                                <TableContainer className={classes.container} id="scrollableDiv" style={{ height: 440, overflow: "auto" }}>
                                    <InfiniteScroll
                                        dataLength={paymentHistory.length}
                                        next={fetchMoreData}
                                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }} //To put endMessage and loader to the top.
                                        hasMore={hasMore}
                                        scrollableTarget="scrollableDiv"
                                        loader={fetched ? <Box margin="8px 0px" display="flex" justifyContent="center">
                                            <CircularProgress color="secondary" />
                                        </Box> : null}
                                        endMessage={<Box margin="8px 0px" display="flex" justifyContent="center">
                                            NO MORE HISTORY FOUND
                                                </Box>}
                                    >
                                        <Table id="my-table" stickyHeader aria-label="sticky table" >
                                            <TableHead>
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                        >
                                                            <TableSortLabel
                                                                active={orderBy === column.id}
                                                                direction={orderBy === column.id ? order : 'asc'}
                                                                onClick={createSortHandler(column.id)}
                                                            >
                                                                {column.label}
                                                            </TableSortLabel>
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {stableSort(paymentHistory, getComparator(order, orderBy))
                                                    .map((row, index) => {
                                                        return (
                                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                                {columns.map((column) => {
                                                                    const value = row[column.id];
                                                                    return (
                                                                        <TableCell key={column.id} align={column.align}>
                                                                            { column.id === 'action' ?
                                                                                <Box>
                                                                                    {
                                                                                        row.refunded ?
                                                                                            <Box display="flex" alignItems="center">
                                                                                                <CheckCircleIcon color="primary" />
                                                                                    Refunded
                                                                                </Box> :
                                                                                            <Box>
                                                                                                {
                                                                                                    row.amountReceived === row.amount ?
                                                                                                        <Button variant="contained" color="primary" onClick={(event) => createRefund(event, row)}>Refund</Button>
                                                                                                        : <Box display="flex" alignItems="center">
                                                                                                            <HourglassEmptyIcon color="primary" />
            Payment Pending</Box>
                                                                                                }
                                                                                            </Box>
                                                                                    }
                                                                                </Box> : <Box> {column.id === 'amount' ? `$${value / 100}` : value}</Box>}
                                                                        </TableCell>
                                                                    );
                                                                })}
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </InfiniteScroll>
                                </TableContainer>
                            </Grid> : <Box height="100%" display="flex" justifyContent="center" alignItems="center">No Payment History Found</Box>}
                        </div>
                    </Paper>
                </Box>
            </Grid> : null}
        </Box>

    )
}

export default HistoryComponent;