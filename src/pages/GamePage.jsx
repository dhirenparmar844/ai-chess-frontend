import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import chessApi from '../api/chess.api';
import Board from '../components/Game/Board';
import GameInfo from '../components/Game/GameInfo';
import MoveHistory from '../components/Game/MoveHistory';

const GamePage = () => {
    const { gameId } = useParams();
    const [game, setGame] = useState(new Chess());
    const [gameState, setGameState] = useState(null); // Backend state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [aiThinking, setAiThinking] = useState(false);

    // Initial Load
    useEffect(() => {
        const loadGame = async () => {
            try {
                const data = await chessApi.getGame(gameId);
                setGameState(data);

                // Initialize chess.js with FEN from backend
                const newGame = new Chess(data.fen || 'start');
                setGame(newGame);
            } catch (err) {
                console.error("Failed to load game:", err);
                setError("Failed to load game data.");
            } finally {
                setLoading(false);
            }
        };

        if (gameId) {
            loadGame();
        }
    }, [gameId]);

    // Handle Piece Drop
    const onPieceDrop = async (sourceSquare, targetSquare) => {
        if (aiThinking || (gameState && gameState.status !== 'IN_PROGRESS' && gameState.status !== 'active')) return false;

        // 1. Validate move with local chess.js instance
        const gameCopy = new Chess(game.fen());
        let move = null;

        try {
            move = gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });
        } catch (e) {
            return false;
        }

        if (!move) return false;

        // 2. Update local state immediately for responsiveness
        setGame(gameCopy);

        // 3. Send move to backend
        setAiThinking(true);
        try {
            const moveSan = move.san;

            // Player Move
            const playerMoveFn = await chessApi.makeMove(gameId, moveSan);
            setGameState(playerMoveFn); // Update state immediately (might show game over if player checkmated)

            // Check if game ended after player move
            if (playerMoveFn.status !== 'active' && playerMoveFn.status !== 'IN_PROGRESS') {
                setAiThinking(false);
                return true;
            }

            // AI Move
            const updatedGameData = await chessApi.makeAiMove(gameId);

            // Update local board with new FEN (including AI move)
            if (updatedGameData && updatedGameData.fen) {
                const updatedGame = new Chess(updatedGameData.fen);
                setGame(updatedGame);
                setGameState(updatedGameData);
            }

        } catch (err) {
            console.error("Move failed:", err);
            setError("Failed to process move.");
            const revertedGame = new Chess(gameState.fen);
            setGame(revertedGame);
        } finally {
            setAiThinking(false);
        }

        return true;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="animate-pulse">Loading Game...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white gap-4">
                <div className="text-red-400 text-xl">{error}</div>
                <Link to="/" className="text-blue-400 hover:underline">← Back to Dashboard</Link>
            </div>
        );
    }

    const isGameOver = gameState?.status === 'COMPLETED' || gameState?.status === 'mate' || gameState?.status === 'draw' || gameState?.result !== 'undecided';

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Link to="/" className="inline-block text-gray-400 hover:text-white mb-6 transition-colors">
                    ← Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Board */}
                    <div className="lg:col-span-2 flex justify-center lg:justify-end">
                        <Board
                            game={game}
                            onPieceDrop={onPieceDrop}
                            orientation={gameState?.color === 'black' ? 'black' : 'white'}
                            gameOver={isGameOver ? {
                                winner: gameState.result === 'win' ? (gameState.moves.length % 2 !== 0 ? 'White' : 'Black') : null, // Rough estimation, better if backend sends winner
                                result: gameState.result,
                                reason: gameState.end_reason
                            } : null}
                        />
                    </div>

                    {/* Right Column: Info & History */}
                    <div className="lg:col-span-1 space-y-4">
                        <GameInfo
                            game={game}
                            status={gameState?.status}
                            difficulty={gameState?.difficulty}
                        />

                        {aiThinking && (
                            <div className="bg-blue-900/30 border border-blue-500/30 text-blue-200 px-4 py-2 rounded animate-pulse">
                                AI is thinking...
                            </div>
                        )}

                        <MoveHistory history={game.history({ verbose: true })} />

                        <div className="text-xs text-gray-600 font-mono mt-4 break-all">
                            GAME ID: {gameId}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;
