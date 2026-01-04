import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const GameCard = ({ game, userColor = 'white' }) => {
    const navigate = useNavigate();
    const gameId = game.id || game.game_id;
    const fen = game.fen || 'start';
    const status = game.status || 'active';
    const isGameOver = status !== 'active' && status !== 'IN_PROGRESS';

    // Determine whose turn it is
    let isYourTurn = false;
    try {
        const chess = new Chess(fen);
        const turn = chess.turn(); // 'w' or 'b'
        isYourTurn = !isGameOver && ((turn === 'w' && userColor === 'white') || (turn === 'b' && userColor === 'black'));
    } catch (e) {
        // Invalid FEN, default to false
    }

    const displayId = gameId ? `#${gameId.toString().slice(0, 4)}...` : '#???';

    return (
        <div
            style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }}
        >
            {/* Board Thumbnail */}
            <div style={{ width: '120px', height: '120px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid #4b5563' }}>
                <Chessboard
                    position={fen}
                    arePiecesDraggable={false}
                    boardWidth={120}
                    customDarkSquareStyle={{ backgroundColor: '#779556' }}
                    customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
                />
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <span style={{ fontFamily: 'monospace', color: '#9ca3af', fontWeight: 'bold', fontSize: '16px' }}>{displayId}</span>
                        <span style={{
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: (status === 'active' || status === 'IN_PROGRESS') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(75, 85, 99, 0.5)',
                            color: (status === 'active' || status === 'IN_PROGRESS') ? '#4ade80' : '#9ca3af',
                            border: `1px solid ${(status === 'active' || status === 'IN_PROGRESS') ? '#22c55e' : '#4b5563'}`
                        }}>
                            {status}
                        </span>
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#e5e7eb', marginBottom: '4px' }}>
                        VS AI ({game.difficulty || 'Medium'})
                    </div>

                    <div style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: isYourTurn ? '#facc15' : '#6b7280'
                    }}>
                        {isGameOver
                            ? (game.result ? `Result: ${game.result}` : 'Completed')
                            : (isYourTurn ? 'Active - Your Move' : 'Active - Waiting...')}
                    </div>
                </div>

                <button
                    onClick={() => navigate(`/game/${gameId}`)}
                    style={{
                        width: '100%',
                        marginTop: '8px',
                        padding: '10px 12px',
                        backgroundColor: '#eab308',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(234, 179, 8, 0.2)',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ca8a04'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eab308'}
                >
                    Resume Game
                </button>
            </div>
        </div>
    );
};

export default GameCard;
