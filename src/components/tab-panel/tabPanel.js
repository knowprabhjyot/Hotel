import React, { useContext } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { matchPath, NavLink, useLocation, withRouter } from "react-router-dom";
import { AuthContext } from '../../context/authContext';

const navItems = [
    {
        id: 'payments',
        path: '/payments',
        text: 'Payments',
    },
    {
        id: 'refund',
        path: '/refund',
        text: 'Refund',
    },
    {
        id: 'request',
        path: '/request',
        text: 'Request',
    },
    {
        id: 'history',
        path: '/history',
        text: 'History',
    },
    {
        id: 'manage-users',
        path: '/manage-users',
        text: 'Manage Users',
    },
    {
        id: 'changepassword',
        path: '/changepassword',
        text: 'Change Password',
    },
];


const TabPanelComponent = (props) => {
    const { pathname } = useLocation();
    const authContext = useContext(AuthContext);
    const logout = () => {
        authContext.logout();
    }

    console.log(authContext);

    if (!authContext.admin) {
        const index = navItems.findIndex((item) => item.id === 'manage-users' );
        if (index > -1) {
            navItems.splice(index, 1);
        }
    }
    console.log(navItems);
    const activeItem = navItems.find((item) => !!matchPath(pathname, { path: item.path }));
    return (
        <div>
            <Tabs value={activeItem?.id} orientation="vertical" TabIndicatorProps={{
           style: { background: "cyan" }
         }}>
                {navItems.map((item) => (
                    <Tab fullWidth key={item.id} value={item.id} label={item.text} component={NavLink} to={item.path} />
                ))}
                <Tab key="logout" value="logout" label="Logout" onClick={logout} />
            </Tabs>
        </div>
    );
}

export default withRouter(TabPanelComponent);