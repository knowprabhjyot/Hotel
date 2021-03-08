import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, makeStyles, OutlinedInput, Paper, Snackbar, TextField } from '@material-ui/core';
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
    const [amount, setAmount] = useState("");
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [severity, setSeverity] = React.useState('success');
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
        },
        paper: {
            padding: theme.spacing(4)
        }
    }));


    const HandleSubmit = async (event) => {
        setDisable(true);
        event.preventDefault();
        const data = {
            name: fullName,
            email: email,
            contact: contact,
            amount: amount * 100,
            dateSelection: dateRange,
            checkIn: dateRange.startDate,
            checkOut: dateRange.endDate,
            cardType: 'card'
        }
            ;
        const card = elements.getElement(CardElement);
        card.update({ disabled : true})
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card
        });
        
        console.log(paymentMethod);

        if (!error) {
            const { id } = paymentMethod;
            try {
                const response = await axios.post('http://localhost:5000/payments', {data, id});
                setMessage(response.data.message);
                setOpen(true);
                setSeverity('success');
                setDisable(false);
                setTimeout(() => {
                    history.push('/history');
                }, 1000);
            } catch (error) {
                setMessage(error.message);
                setOpen(true);
                setDisable(false);
                setSeverity('error');
            }
        } else {
            setMessage(error.message);
            setOpen(true);
            card.update({ disabled: false})
            setDisable(false);
            setSeverity('error');
        }
    };

    const classes = useStyles();
    const toggle = () => setOpenDate(!openDate);
    const cardOptions = {
        hidePostalCode: true
    }

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

    const allowUpto2Decimal = (value) => {
        const separatorList = {
            period: {
              name: "period",
              regex: /^\d+(\.\d{0,2})?$/
            }
        };  
        if (separatorList['period'].regex.test(value)) {
            setAmount(value);
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };
    

    return (
        <Box display="grid" gridGap="32px" width="80%">
            <Paper className={classes.paper}>
            <form className={classes.form} onSubmit={HandleSubmit}>
                <Snackbar onClose={handleClose} open={open} autoHideDuration={2000} >
                    <Alert onClose={handleClose} severity={severity}>
                        {message}
                    </Alert>
                </Snackbar>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CardElement options={cardOptions} />
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
                            <FormControl fullWidth className={classes.margin} variant="outlined">
                                <InputLabel color="secondary" htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    color="secondary"
                                    value={amount}
                                    type="number"
                                    disabled={disabled}
                                    required
                                    onChange={(e) => allowUpto2Decimal(e.target.value)}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    labelWidth={60}
                                />
                            </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Checkin-Checkout"
                            name="Checkin"
                            variant="outlined"
                            color="secondary"
                            required
                            disabled={disabled}
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
                        disabled={disabled}
                    >
                        <span style={{ marginRight: '8px' }}>
                            {(disabled) ? <CircularProgress size={20} /> : null}
                        </span>
                            Confirm Payment
                    </Button>
                </Grid>
            </form>
            </Paper>
        </Box>
    )
}

export default PaymentsComponent;