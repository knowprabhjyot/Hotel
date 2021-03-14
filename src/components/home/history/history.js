import { Box, Button, CircularProgress, Grid, makeStyles, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router';

const HistoryComponent = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('success');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [orderBy, setOrderBy] = useState('hotel');
    const [order, setOrder] = React.useState('asc');
    const [starting_after, setStarting] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [fetched, setFetched] = useState(false);
    const history = useHistory();
    useEffect(() => {
        getPaymentHistory();
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
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px'
        }
    });
    const classes = useStyles();
    const columns = [
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

    const fetchMoreData = async () => {
        setFetched(true);
        const id = paymentHistory[paymentHistory.length - 1].id;
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/payments?limit=${10}&starting_after=${id}`);
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
                        {paymentHistory.length > 0 ? <div className={classes.root} >
                            <Grid item>
                                <TableContainer className={classes.container} id="scrollableDiv" style={{ height: 440, overflow: "auto" }}>
                                <InfiniteScroll
                                        dataLength={paymentHistory.length}
                                        next={fetchMoreData}
                                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }} //To put endMessage and loader to the top.
                                        hasMore={hasMore}
                                        scrollableTarget="scrollableDiv"
                                        loader={ fetched ? <Box margin="8px 0px" display="flex" justifyContent="center">
                                            <CircularProgress color="secondary" />
                                        </Box> : null}
                                        endMessage={<Box margin="8px 0px" display="flex" justifyContent="center">
                                            NO MORE HISTORY FOUND
                                                </Box>}
                                    >
                                    <Table stickyHeader aria-label="sticky table" >
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
                                                                                            <Box display="flex" justifyContent="space-between" alignItems="center">
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
                                                                                </Box> : <Box> { column.id === 'amount' ? `$${value / 100}` : value }</Box>}
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
                            </Grid>
                        </div> : <div>No Payment History Found</div>}
                    </Paper>
                </Box>
            </Grid> : null}
        </Box>

    )
}

export default HistoryComponent;