import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid, makeStyles, Snackbar, TextField } from '@material-ui/core';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { DateRangePicker } from "materialui-daterange-picker";
import axios from 'axios';
import './styles.css';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';

const PaymentsComponent = (props) => {

    const [fullName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [amount, setAmout] = useState("");
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [disabled, setDisable] = React.useState(false);
    const [openDate, setOpenDate] = React.useState(false);
    const [dateRange, setDateRange] = React.useState({});
    const [checkInOut, setCheckinOut] = React.useState('');
    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();
    const [isLoggedIn, setLogin] = React.useState(false);

    const Alert = ((props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    });


    const useStyles = makeStyles((theme) => ({
        submitContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        submit: {
            margin: '8px 0px'
        }
    }));


    const CompletePayment = async (data, id) => {
        const body = { data, id };
        const response = await axios.post('http://localhost:5000/payments', body);
        setOpen(true);
        console.log(response);
        setMessage(response.data.message);
        setDisable(false);
        return response;
    }

    const HandleSubmit = async (event) => {
        setDisable(true);
        event.preventDefault();
        const data = {
            name: fullName,
            email: email,
            contact: contact,
            amount: amount,
            dateSelection: dateRange,
            checkIn: dateRange.startDate,
            checkOut: dateRange.endDate,
            cardType: 'card'
        }
            ;
        const card = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card
        });

        if (!error) {
            const { id } = paymentMethod;

            try {
                const response = await CompletePayment(data, id);
                history.push('/history');
            } catch (error) {
                console.log(error);
            }
        }
    };

    const classes = useStyles();
    const toggle = () => setOpenDate(!openDate);


    const chooseDate = (range) => {
        setDateRange(range);
        setOpenDate(false);
        let { startDate, endDate } = range;
        startDate = convertDate(startDate);
        endDate = convertDate(endDate);
        setCheckinOut(`${startDate} - ${endDate}`)
    }

    const convertDate = (date) => {
        return `${new Date(date).getDate()}/${new Date(date).getMonth()}/${new Date(date).getFullYear()}`;
    }

    return (
        <Box display="grid" gridGap="32px" width="80%">
            <form className={classes.form} onSubmit={HandleSubmit}>
                <Snackbar open={open} autoHideDuration={3000} >
                    <Alert severity="success">
                        {message}
                    </Alert>
                </Snackbar>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CardElement />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="fname"
                            InputProps={{
                                classes: {
                                    notchedOutline: classes.input,
                                },
                            }}
                            name="fullName"
                            variant="outlined"
                            color="secondary"
                            disabled={disabled}
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            value={fullName}
                            onChange={e => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Amount (USD)"
                            name="amount"
                            variant="outlined"
                            required
                            fullWidth
                            value={amount}
                            type="number"
                            onChange={e => setAmout(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Checkin-Checkout"
                            name="Checkin"
                            variant="outlined"
                            required
                            fullWidth
                            value={checkInOut}
                            type="text"
                            autoComplete="off"
                            onFocus={e => setOpenDate(!openDate)}
                            onClick={e => setOpenDate(!openDate)}
                        />
                        <DateRangePicker
                            open={openDate}
                            toggle={toggle}
                            onChange={(range) => chooseDate(range)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            InputProps={{
                                classes: {
                                    notchedOutline: classes.input,
                                },
                            }}
                            variant="outlined"
                            color="secondary"
                            required
                            fullWidth
                            disabled={disabled}
                            id="email"
                            type="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            InputProps={{
                                classes: {
                                    notchedOutline: classes.input,
                                },
                            }}
                            variant="outlined"
                            color="secondary"
                            required
                            fullWidth
                            disabled={disabled}
                            type="number"
                            id="contact"
                            label="Contact number"
                            name="contact"
                            autoComplete="number"
                            value={contact}
                            onChange={e => setContact(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    </Grid>
                </Grid>
                <Grid className={classes.submitContainer}>
                    <Button
                        type="submit"
                        variant="outlined"
                        color="secondary"
                        className={classes.submit}
                        disabled={disabled && !stripe}
                    >
                        <span style={{ marginRight: '8px' }}>
                            {(disabled && !stripe) ? <CircularProgress size={20} /> : null}
                        </span>
                            Confirm Payment
                    </Button>
                </Grid>
            </form>
        </Box>
    )
}

export default PaymentsComponent;