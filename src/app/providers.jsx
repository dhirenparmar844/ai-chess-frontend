import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthProvider } from '../auth/AuthContext';

const Providers = ({ children }) => {
    return (
        <BrowserRouter>
            <AuthProvider>
                {children}
            </AuthProvider>
        </BrowserRouter>
    );
};

export default Providers;

Providers.propTypes = {
    children: PropTypes.node.isRequired
};
