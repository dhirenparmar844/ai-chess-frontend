import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';

const Board = ({ game, onPieceDrop, orientation = 'white', gameOver }) => {
    const [optionSquares, setOptionSquares] = useState({});
    const [rightClickedSquares, setRightClickedSquares] = useState({});
    const [moveFrom, setMoveFrom] = useState('');

    function getMoveOptions(square) {
        const moves = game.moves({ square, verbose: true });
        if (moves.length === 0) {
            setOptionSquares({});
            return false;
        }

        const newSquares = {};
        moves.forEach((move) => {
            newSquares[move.to] = {
                background:
                    game.get(move.to) && game.get(move.to).color !== game.get(square).color
                        ? 'radial-gradient(circle, rgba(255,0,0,.5) 25%, transparent 25%)'
                        : 'radial-gradient(circle, rgba(0,0,0,.5) 25%, transparent 25%)',
                borderRadius: '50%',
            };
        });
        newSquares[square] = { background: 'rgba(255, 255, 0, 0.4)' };
        setOptionSquares(newSquares);
        return true;
    }

    function onSquareClick(square) {
        if (gameOver) return;
        setRightClickedSquares({});

        if (!moveFrom) {
            if (getMoveOptions(square)) setMoveFrom(square);
            return;
        }

        if (moveFrom === square) {
            setMoveFrom('');
            setOptionSquares({});
            return;
        }

        const result = onPieceDrop(moveFrom, square);
        if (result) {
            setMoveFrom('');
            setOptionSquares({});
        } else {
            if (getMoveOptions(square)) setMoveFrom(square);
            else {
                setMoveFrom('');
                setOptionSquares({});
            }
        }
    }

    function onSquareRightClick(square) {
        const colour = 'rgba(0, 0, 255, 0.4)';
        setRightClickedSquares({
            ...rightClickedSquares,
            [square]: rightClickedSquares[square]?.backgroundColor === colour ? undefined : { backgroundColor: colour },
        });
    }

    const styles = {
        boardContainer: {
            position: 'relative',
            width: '100%',
            maxWidth: '560px',
            aspectRatio: '1/1',
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid #374151'
        },
        overlay: {
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)'
        },
        overlayCard: {
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid #4b5563',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            maxWidth: '320px',
            width: '100%',
            textAlign: 'center'
        },
        emoji: {
            fontSize: '48px',
            marginBottom: '16px'
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#fbbf24',
            marginBottom: '8px'
        },
        reason: {
            color: '#9ca3af',
            fontSize: '16px',
            marginBottom: '24px'
        },
        btnPrimary: {
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            borderRadius: '10px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '12px',
            fontSize: '14px'
        },
        btnSecondary: {
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#374151',
            color: '#e5e7eb',
            borderRadius: '10px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
        }
    };

    return (
        <div style={styles.boardContainer}>
            <Chessboard
                id="GameBoard"
                position={game.fen()}
                onPieceDrop={(source, target) => {
                    if (gameOver) return false;
                    const result = onPieceDrop(source, target);
                    if (result) {
                        setOptionSquares({});
                        setMoveFrom('');
                    }
                    return result;
                }}
                onPieceDragBegin={(piece, sourceSquare) => {
                    if (gameOver) return;
                    getMoveOptions(sourceSquare);
                }}
                onPieceDragEnd={() => setOptionSquares({})}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                customSquareStyles={{ ...optionSquares, ...rightClickedSquares }}
                boardOrientation={orientation}
                customDarkSquareStyle={{ backgroundColor: '#b58863' }}
                customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
                animationDuration={200}
            />

            {/* Game Over Overlay */}
            {gameOver && (
                <div style={styles.overlay}>
                    <div style={styles.overlayCard}>
                        <div style={styles.emoji}>
                            {gameOver.result === 'win' || gameOver.result === 'checkmate' ? '👑' : '🤝'}
                        </div>
                        <h2 style={styles.title}>
                            {gameOver.result === 'win' || gameOver.result === 'checkmate'
                                ? (gameOver.winner ? `${gameOver.winner} Wins!` : 'Checkmate!')
                                : 'Game Drawn'}
                        </h2>
                        <p style={styles.reason}>{gameOver.reason || 'Game ended'}</p>
                        <button
                            onClick={() => window.location.href = '/'}
                            style={styles.btnPrimary}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={styles.btnSecondary}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                        >
                            Rematch
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Board;
