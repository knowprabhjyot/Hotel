import React from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { matchPath, NavLink, useLocation, withRouter } from "react-router-dom";

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
        id: 'changepassword',
        path: '/changepassword',
        text: 'Change Password',
    },
];

const TabPanelComponent = (props) => {
    const { pathname } = useLocation();
    const activeItem = navItems.find((item) => !!matchPath(pathname, { path: item.path }));
    return (
        <Tabs value={activeItem?.id} orientation="vertical">
            {navItems.map((item) => (
                <Tab fullWidth key={item.id} value={item.id} label={item.text} component={NavLink} to={item.path} />
            ))}
        </Tabs>
    );
}

export default withRouter(TabPanelComponent);