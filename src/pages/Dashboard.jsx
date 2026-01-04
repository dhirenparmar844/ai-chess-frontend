import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import chessApi from '../api/chess.api';

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
                setGames(myGames);
            } catch (err) {
                console.error("Failed to fetch games:", err);
                // Don't block the UI if backend is offline, just show error
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
            // Assuming backend returns { game_id: "..." } or similar
            const gameId = newGame.game_id || newGame.id;
            navigate(`/game/${gameId}`);
        } catch (err) {
            console.error("Failed to create game:", err);
            setError("Failed to create new game.");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="dashboard p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Chess Dashboard</h1>
                    <p className="text-gray-400">Welcome, {currentUser?.displayName || currentUser?.email}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleCreateGame}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                        disabled={creating}
                    >
                        {creating ? 'Creating...' : '+ New Game'}
                    </button>
                    <button
                        onClick={logout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6">
                    {error}
                </div>
            )}

            <h2 className="text-xl font-semibold mb-4">Your Games</h2>

            {loading ? (
                <div className="text-center py-8">Loading games...</div>
            ) : games.length === 0 ? (
                <div className="text-center py-12 bg-gray-800 rounded">
                    <p className="text-gray-400 mb-4">You haven't played any games yet.</p>
                    <button
                        onClick={handleCreateGame}
                        className="text-blue-400 hover:underline"
                        disabled={creating}
                    >
                        Start your first game
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {games.map((game) => (
                        <Link
                            key={game.id || game.game_id}
                            to={`/game/${game.id || game.game_id}`}
                            className="block bg-gray-800 p-4 rounded hover:bg-gray-700 transition"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-mono text-sm text-gray-500">#{game.id || game.game_id}</span>
                                <span className={`text-xs px-2 py-1 rounded ${game.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
                                    }`}>
                                    {game.status || 'Active'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-300">
                                VS AI ({game.difficulty || 'Medium'})
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
