import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import chessApi from '../api/chess.api';
import Board from '../components/Game/Board';
import GameInfo from '../components/Game/GameInfo';
import MoveHistory from '../components/Game/MoveHistory';

const GamePage = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(new Chess());
    const [gameState, setGameState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [aiThinking, setAiThinking] = useState(false);

    useEffect(() => {
        const loadGame = async () => {
            try {
                const data = await chessApi.getGame(gameId);
                setGameState(data);
                const newGame = new Chess(data.fen || 'start');
                setGame(newGame);
            } catch (err) {
                console.error("Failed to load game:", err);
                setError("Failed to load game data.");
            } finally {
                setLoading(false);
            }
        };

        if (gameId) loadGame();
    }, [gameId]);

    const onPieceDrop = async (sourceSquare, targetSquare) => {
        if (aiThinking || (gameState && gameState.status !== 'IN_PROGRESS' && gameState.status !== 'active')) return false;

        const gameCopy = new Chess(game.fen());
        let move = null;

        try {
            move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
        } catch (e) {
            return false;
        }

        if (!move) return false;

        setGame(gameCopy);
        setAiThinking(true);

        try {
            const playerMoveResult = await chessApi.makeMove(gameId, move.san);
            setGameState(playerMoveResult);

            if (playerMoveResult.status !== 'active' && playerMoveResult.status !== 'IN_PROGRESS') {
                setAiThinking(false);
                return true;
            }

            const aiMoveResult = await chessApi.makeAiMove(gameId);
            if (aiMoveResult?.fen) {
                setGame(new Chess(aiMoveResult.fen));
                setGameState(aiMoveResult);
            }
        } catch (err) {
            console.error("Move failed:", err);
            setError("Failed to process move.");
            setGame(new Chess(gameState.fen));
        } finally {
            setAiThinking(false);
        }

        return true;
    };

    const styles = {
        page: {
            minHeight: '100vh',
            backgroundColor: '#111827',
            padding: '24px',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#f3f4f6'
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto'
        },
        backBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: 'transparent',
            border: '1px solid #4b5563',
            color: '#9ca3af',
            borderRadius: '10px',
            cursor: 'pointer',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32px'
        },
        boardColumn: {
            display: 'flex',
            justifyContent: 'center'
        },
        infoColumn: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        aiThinking: {
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#93c5fd',
            padding: '12px 16px',
            borderRadius: '10px',
            textAlign: 'center',
            fontWeight: '500'
        },
        resignBtn: {
            width: '100%',
            padding: '14px',
            backgroundColor: 'transparent',
            border: '1px solid #4b5563',
            color: '#9ca3af',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '15px',
            marginTop: '8px'
        },
        gameId: {
            fontSize: '11px',
            color: '#4b5563',
            fontFamily: 'monospace',
            marginTop: '16px',
            wordBreak: 'break-all'
        },
        loadingScreen: {
            minHeight: '100vh',
            backgroundColor: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f3f4f6'
        },
        errorScreen: {
            minHeight: '100vh',
            backgroundColor: '#111827',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f3f4f6',
            gap: '16px'
        }
    };

    // Responsive grid for larger screens
    const gridStyle = {
        ...styles.grid,
        ...(window.innerWidth >= 1024 ? { gridTemplateColumns: '2fr 1fr' } : {})
    };

    if (loading) {
        return (
            <div style={styles.loadingScreen}>
                <div>Loading Game...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorScreen}>
                <div style={{ color: '#f87171', fontSize: '20px' }}>{error}</div>
                <button
                    onClick={() => navigate('/')}
                    style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    const isGameOver = gameState?.status === 'COMPLETED' || gameState?.status === 'mate' || gameState?.status === 'draw' || gameState?.result !== 'undecided';

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <button
                    onClick={() => navigate('/')}
                    style={styles.backBtn}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#9ca3af'; e.currentTarget.style.color = '#ffffff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#4b5563'; e.currentTarget.style.color = '#9ca3af'; }}
                >
                    ← Back to Dashboard
                </button>

                <div style={gridStyle}>
                    {/* Board Column */}
                    <div style={styles.boardColumn}>
                        <Board
                            game={game}
                            onPieceDrop={onPieceDrop}
                            orientation={gameState?.color === 'black' ? 'black' : 'white'}
                            gameOver={isGameOver ? {
                                winner: gameState.result === 'win' ? (gameState.moves?.length % 2 !== 0 ? 'White' : 'Black') : null,
                                result: gameState.result,
                                reason: gameState.end_reason
                            } : null}
                        />
                    </div>

                    {/* Info Column */}
                    <div style={styles.infoColumn}>
                        <GameInfo
                            game={game}
                            status={gameState?.status}
                            difficulty={gameState?.difficulty}
                        />

                        {aiThinking && (
                            <div style={styles.aiThinking}>
                                🤖 AI is thinking...
                            </div>
                        )}

                        <MoveHistory history={game.history({ verbose: true })} />

                        <button
                            style={styles.resignBtn}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#4b5563'; e.currentTarget.style.color = '#9ca3af'; }}
                        >
                            Resign Game
                        </button>

                        <div style={styles.gameId}>
                            GAME ID: {gameId}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;
