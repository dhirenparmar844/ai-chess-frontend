import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const LoginPage = () => {
    const { login, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    React.useEffect(() => {
        if (currentUser) {
            navigate(from, { replace: true });
        }
    }, [currentUser, navigate, from]);

    const handleLogin = async () => {
        try {
            await login();
            // AuthContext listener will handle redirection via useEffect
        } catch (error) {
            console.error("Failed to login", error);
            alert("Login failed: " + error.message);
        }
    };

    return (
        <div className="login-page">
            <h2>Welcome to AI Chess</h2>
            <p>Sign in to play</p>
            <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Sign in with Google
            </button>
        </div>
    );
};

export default LoginPage;
