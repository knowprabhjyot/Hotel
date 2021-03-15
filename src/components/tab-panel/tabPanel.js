import React, { useContext } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { matchPath, NavLink, useLocation, withRouter } from "react-router-dom";
import { AuthContext } from '../../context/authContext';
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

const navItems = [
    {
        id: 'payments',
        path: '/payments',
        text: 'Payments',
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
        id: 'manage-hotels',
        path: '/manage-hotels',
        text: 'Manage Hotels',
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

    let condTabOrientation;
    if (isWidthUp("sm", props.width)) {
      condTabOrientation = "vertical";
    } else {
      condTabOrientation = "horizontal";
    }

    if (!authContext.admin) {
        const index = navItems.findIndex((item) => item.id === 'manage-users' );
        if (index !== -1) {
            console.log(navItems);
            navItems.splice(index, 1);
        }

        const index2 = navItems.findIndex((item) => item.id === 'manage-hotels' );

        if (index2 !== -1) {
            navItems.splice(index2, 1);
        }
    }
    const activeItem = navItems.find((item) => !!matchPath(pathname, { path: item.path }));
    return (
        <div>
            <Tabs value={activeItem?.id} orientation={condTabOrientation} TabIndicatorProps={{
           style: { background: "#DD2C00" }
         }}>
                {navItems.map((item) => (
                    <Tab fullWidth key={item.id} value={item.id} label={item.text} component={NavLink} to={item.path} />
                ))}
                <Tab key="logout" value="logout" label="Logout" onClick={logout} />
            </Tabs>
        </div>
    );
}

export default withRouter(withWidth() (TabPanelComponent));