import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import RequireAuth from '../auth/RequireAuth';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import GamePage from '../pages/GamePage';

const AppRouter = () => {
    const routes = useRoutes([
        {
            path: '/login',
            element: <LoginPage />
        },
        {
            path: '/api-test', // Temporary route if needed, or remove
            element: <Navigate to="/" />
        },
        {
            path: '/game/:gameId',
            element: (
                <RequireAuth>
                    <GamePage />
                </RequireAuth>
            )
        },
        {
            path: '/',
            element: (
                <RequireAuth>
                    <Dashboard />
                </RequireAuth>
            )
        },
        // Fallback
        {
            path: '*',
            element: <Navigate to="/" />
        }
    ]);

    return routes;
};

export default AppRouter;
