import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import chessApi from '../api/chess.api';
import GameCard from '../components/Dashboard/GameCard';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const myGames = await chessApi.getMyGames();
                const gamesList = Array.isArray(myGames) ? myGames : (myGames.games || []);
                setGames(gamesList.reverse());
            } catch (err) {
                console.error("Failed to fetch games:", err);
                setError("Could not load your games. Is the backend running?");
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchGames();
        }
    }, [currentUser]);

    const handleCreateGame = async () => {
        setCreating(true);
        setError(null);
        try {
            const newGame = await chessApi.createGame('white', 'medium');
            const gameId = newGame.game_id || newGame.id;
            navigate(`/game/${gameId}`);
        } catch (err) {
            console.error("Failed to create game:", err);
            setError("Failed to create new game.");
        } finally {
            setCreating(false);
        }
    };

    // Inline styles for guaranteed rendering
    const styles = {
        page: {
            minHeight: '100vh',
            backgroundColor: '#111827',
            padding: '48px 24px',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#f3f4f6'
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto'
        },
        header: {
            textAlign: 'center',
            marginBottom: '48px'
        },
        title: {
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '8px',
            letterSpacing: '-0.025em'
        },
        welcome: {
            fontSize: '18px',
            color: '#9ca3af',
            marginBottom: '24px'
        },
        userName: {
            color: '#e5e7eb',
            fontWeight: '600'
        },
        buttonGroup: {
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
        },
        newGameBtn: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#eab308',
            color: '#000000',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 15px rgba(234, 179, 8, 0.2)',
            transition: 'all 0.2s'
        },
        signOutBtn: {
            backgroundColor: 'transparent',
            border: '1px solid #4b5563',
            color: '#9ca3af',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '500',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        sectionTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '24px'
        },
        gamesGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
        },
        loadingSpinner: {
            display: 'flex',
            justifyContent: 'center',
            padding: '80px 0'
        },
        emptyState: {
            textAlign: 'center',
            padding: '64px 0',
            backgroundColor: 'rgba(31, 41, 55, 0.5)',
            border: '1px dashed #374151',
            borderRadius: '16px'
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* Header Section */}
                <div style={styles.header}>
                    <h1 style={styles.title}>Chess Dashboard</h1>
                    <p style={styles.welcome}>
                        Welcome, <span style={styles.userName}>{currentUser?.displayName || currentUser?.email}</span> 👤
                    </p>

                    <div style={styles.buttonGroup}>
                        <button
                            onClick={handleCreateGame}
                            disabled={creating}
                            style={{
                                ...styles.newGameBtn,
                                opacity: creating ? 0.5 : 1,
                                cursor: creating ? 'not-allowed' : 'pointer'
                            }}
                            onMouseOver={(e) => { if (!creating) e.currentTarget.style.backgroundColor = '#ca8a04'; }}
                            onMouseOut={(e) => { if (!creating) e.currentTarget.style.backgroundColor = '#eab308'; }}
                        >
                            <span style={{ fontSize: '20px' }}>+</span> {creating ? 'Creating...' : 'New Game'}
                        </button>
                        <button
                            onClick={logout}
                            style={styles.signOutBtn}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#9ca3af'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#4b5563'; e.currentTarget.style.color = '#9ca3af'; }}
                        >
                            ↪ Sign Out
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto 32px',
                        backgroundColor: 'rgba(127, 29, 29, 0.3)',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        color: '#fecaca',
                        padding: '16px',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Section Divider */}
                <div style={{ borderTop: '1px solid #1f2937', margin: '32px 0' }}></div>

                {/* Games Section */}
                <h2 style={styles.sectionTitle}>Your Games</h2>

                {loading ? (
                    <div style={styles.loadingSpinner}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '3px solid #374151',
                            borderTopColor: '#eab308',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    </div>
                ) : games.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ color: '#9ca3af', fontSize: '18px', marginBottom: '16px' }}>No active games found.</p>
                        <button
                            onClick={handleCreateGame}
                            disabled={creating}
                            style={{ color: '#60a5fa', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            Start your first match now
                        </button>
                    </div>
                ) : (
                    <div style={styles.gamesGrid}>
                        {games.map((game) => (
                            <GameCard
                                key={game.id || game.game_id}
                                game={game}
                                userColor="white"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Keyframe animation for spinner */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;

