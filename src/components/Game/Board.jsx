import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const Board = ({ game, onPieceDrop, orientation = 'white', onPieceDragBegin, onPieceDragEnd, gameOver }) => {
    const [optionSquares, setOptionSquares] = useState({});
    const [rightClickedSquares, setRightClickedSquares] = useState({});
    const [moveFrom, setMoveFrom] = useState('');

    function getMoveOptions(square) {
        const moves = game.moves({
            square,
            verbose: true,
        });
        if (moves.length === 0) {
            setOptionSquares({});
            return false;
        }

        const newSquares = {};
        moves.map((move) => {
            newSquares[move.to] = {
                background:
                    game.get(move.to) && game.get(move.to).color !== game.get(square).color
                        ? 'radial-gradient(circle, rgba(255,0,0,.5) 25%, transparent 25%)'
                        : 'radial-gradient(circle, rgba(0,0,0,.5) 25%, transparent 25%)',
                borderRadius: '50%',
            };
            return move;
        });
        newSquares[square] = {
            background: 'rgba(255, 255, 0, 0.4)',
        };
        setOptionSquares(newSquares);
        return true;
    }

    function onSquareClick(square) {
        if (gameOver) return; // Disable clicks if game over
        setRightClickedSquares({});

        // Click to move logic
        if (!moveFrom) {
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) setMoveFrom(square);
            return;
        }

        // If clicking same piece, cancel
        if (moveFrom === square) {
            setMoveFrom('');
            setOptionSquares({});
            return;
        }

        // Attempt move
        const moveDetails = {
            from: moveFrom,
            to: square,
            promotion: 'q',
        };

        const result = onPieceDrop(moveFrom, square);
        if (result) {
            setMoveFrom('');
            setOptionSquares({});
        } else {
            // Failed move - if clicked another own piece, switch selection
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) setMoveFrom(square);
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
            [square]:
                rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === colour
                    ? undefined
                    : { backgroundColor: colour },
        });
    }

    return (
        <div className="relative w-full max-w-[600px] aspect-square bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
            <Chessboard
                id="BasicBoard"
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
                onPieceDragBegin={(function (piece, sourceSquare) {
                    if (gameOver) return;
                    getMoveOptions(sourceSquare);
                })}
                onPieceDragEnd={() => setOptionSquares({})}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                customSquareStyles={{
                    ...optionSquares,
                    ...rightClickedSquares,
                }}
                boardOrientation={orientation}
                customDarkSquareStyle={{ backgroundColor: '#779556' }}
                customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
                animationDuration={200}
            />

            {/* Game Over Overlay */}
            {gameOver && (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-gray-900/90 border border-gray-600 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all scale-100 opacity-100">
                        <div className="text-5xl mb-4">
                            {gameOver.result === 'win' || gameOver.result === 'checkmate' ? '👑' : '🤝'}
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2 font-display bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                            {gameOver.result === 'win' || gameOver.result === 'checkmate'
                                ? (gameOver.winner ? `${gameOver.winner} Wins!` : 'Checkmate!')
                                : 'Game Drawn'}
                        </h2>
                        <p className="text-gray-300 text-lg mb-6">
                            {gameOver.reason || 'by unknown reason'}
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-900/50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Valid Games
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
                            >
                                Rematch (Reload)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Board;
