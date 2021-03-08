import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ChangePasswordComponent from './components/home/change-password/change-password';
import HistoryComponent from './components/home/history/history';
import RefundComponent from './components/home/refund/refund';
import RequestPaymentComponent from './components/home/request-payment/requestPayment';
import StripeComponent from './components/home/payments/stripe';
import SignInComponent from './components/login/login';
import ManageUsersComponent from './components/home/manage-users/manage-users';
import PrivateRoute from './components/privateRoute';
import { AuthContext } from './context/authContext';

const Routes = () => {
    const { admin } = useContext(AuthContext);
    return (
            <Switch>
                <PrivateRoute path="/payments">
                    <StripeComponent />
                </PrivateRoute>
                <PrivateRoute path="/request">
                    <RequestPaymentComponent />
                </PrivateRoute>
                <PrivateRoute path="/history">
                    <HistoryComponent />
                </PrivateRoute>
                <PrivateRoute path="/refund">
                    <RefundComponent />
                </PrivateRoute >
                <PrivateRoute path="/changepassword">
                    <ChangePasswordComponent />
                </PrivateRoute>
                <Route path="/login">
                    <SignInComponent />
                </Route>
                {admin ? <PrivateRoute path="/manage-users" ><ManageUsersComponent /> </PrivateRoute> : <Redirect to="/login" />}
            </Switch>
    )
}

export default Routes;