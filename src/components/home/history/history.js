import { Box, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const HistoryComponent = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    useEffect( () => {
        getPaymentHistory();
        // eslint-disable-next-line
    }, []);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const useStyles = makeStyles({
        root: {
            width: '100%',
        },
        container: {
            maxHeight: 440,
        },
    });
    const classes = useStyles();
    const columns = [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'contact', label: 'Contact' },
        { id: 'checkin', label: 'CheckIn' },
        { id: 'checkout', label: 'CheckOut' },
        { id: 'amount', label: 'Amount' },
    ];

    const getPaymentHistory = async () => {
        try {
            const response = await axios.get('http://localhost:5000/payments');
            if (response) {
                setPaymentHistory(response.data.data);
                console.log(paymentHistory, 'value');
                return response;
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Grid container>
            <Box display="flex" flexDirection="column" className={classes.root}>
                <Grid item>
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paymentHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item>
                    <TablePagination

                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={paymentHistory.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>
            </Box>
        </Grid>

    )
}

export default HistoryComponent;