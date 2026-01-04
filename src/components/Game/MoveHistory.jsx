import React, { useRef, useEffect } from 'react';

const MoveHistory = ({ history }) => {
    const scrollRef = useRef(null);

    // Auto-scroll to bottom of history
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // Group moves into pairs (White, Black)
    const movePairs = [];
    for (let i = 0; i < history.length; i += 2) {
        movePairs.push({
            number: Math.floor(i / 2) + 1,
            white: history[i],
            black: history[i + 1] || null,
        });
    }

    return (
        <div className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 flex flex-col h-[300px]">
            <h3 className="text-gray-200 font-semibold mb-2 border-b border-gray-700 pb-2">Move History</h3>
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar"
            >
                {movePairs.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center italic mt-10">
                        Game started. White to move.
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-gray-500">
                                <th className="w-10">#</th>
                                <th className="w-24">White</th>
                                <th>Black</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movePairs.map((pair) => (
                                <tr key={pair.number} className="hover:bg-gray-700/50">
                                    <td className="text-gray-500 py-1">{pair.number}.</td>
                                    <td className="text-gray-300 font-mono">{pair.white.san}</td>
                                    <td className="text-gray-300 font-mono">{pair.black ? pair.black.san : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MoveHistory;
