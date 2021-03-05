import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ChangePasswordComponent from './components/home/change-password/change-password';
import HistoryComponent from './components/home/history/history';
import RefundComponent from './components/home/refund/refund';
import RequestPaymentComponent from './components/home/request-payment/requestPayment';
import StripeComponent from './components/home/payments/stripe';
import SignInComponent from './components/login/login';

const Routes = () => {
    return (
        <Switch>
            <Redirect exact from="/" to="/login" />
            <Route exact path="/payments" component={StripeComponent}></Route>
            <Route exact path="/request" component={RequestPaymentComponent}></Route>
            <Route exact path="/history" component={HistoryComponent}></Route>
            <Route exact path="/refund" component={RefundComponent}></Route>
            <Route exact path="/changepassword" component={ChangePasswordComponent}></Route>
            <Route exact path="/login" component={SignInComponent}></Route>
        </Switch>
    )
}

export default Routes;