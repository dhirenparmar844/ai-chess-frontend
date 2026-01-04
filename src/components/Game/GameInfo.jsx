import React from 'react';

const GameInfo = ({ game, status, difficulty }) => {
    const isGameOver = game.isGameOver();
    const isCheck = game.isCheck();
    const turn = game.turn() === 'w' ? 'White' : 'Black';

    let statusMessage = `${turn}'s Turn`;
    let statusColor = 'text-blue-400';

    if (isGameOver) {
        if (game.isCheckmate()) {
            statusMessage = `Checkmate! ${turn === 'White' ? 'Black' : 'White'} Wins!`;
            statusColor = 'text-green-400';
        } else if (game.isDraw()) {
            statusMessage = 'Draw';
            statusColor = 'text-gray-400';
        } else {
            statusMessage = 'Game Over';
            statusColor = 'text-red-400';
        }
    } else if (isCheck) {
        statusMessage = `${turn} is in Check!`;
        statusColor = 'text-orange-400 font-bold';
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h2 className="text-gray-400 text-xs text-transform uppercase tracking-wider font-semibold">Status</h2>
                    <p className={`text-xl ${statusColor} mt-1`}>{statusMessage}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-gray-400 text-xs text-transform uppercase tracking-wider font-semibold">Difficulty</h2>
                    <p className="text-xl text-purple-400 mt-1 capitalize">{difficulty || 'Medium'}</p>
                </div>
            </div>

            {/* Optional: Add captured pieces here later */}
        </div>
    );
};

export default GameInfo;
