import React from 'react';

const GameInfo = ({ game, status, difficulty }) => {
    const isGameOver = game.isGameOver();
    const isCheck = game.isCheck();
    const turn = game.turn() === 'w' ? 'White' : 'Black';

    let statusMessage = `${turn}'s Turn`;
    let statusColor = '#60a5fa'; // blue

    if (isGameOver) {
        if (game.isCheckmate()) {
            statusMessage = `Checkmate! ${turn === 'White' ? 'Black' : 'White'} Wins!`;
            statusColor = '#4ade80'; // green
        } else if (game.isDraw()) {
            statusMessage = 'Draw';
            statusColor = '#9ca3af'; // gray
        } else {
            statusMessage = 'Game Over';
            statusColor = '#f87171'; // red
        }
    } else if (isCheck) {
        statusMessage = `${turn} is in Check!`;
        statusColor = '#fb923c'; // orange
    }

    const styles = {
        container: {
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #374151',
            marginBottom: '16px'
        },
        label: {
            fontSize: '11px',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '600',
            marginBottom: '4px'
        },
        value: {
            fontSize: '18px',
            fontWeight: '600',
            marginTop: '4px'
        },
        row: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.row}>
                <div>
                    <div style={styles.label}>Opponent:</div>
                    <div style={{ ...styles.value, color: '#e5e7eb' }}>AI ({difficulty || 'Medium'})</div>
                </div>
            </div>
            <div style={{ marginTop: '16px', borderTop: '1px solid #374151', paddingTop: '16px' }}>
                <div style={styles.label}>Status:</div>
                <div style={{ ...styles.value, color: statusColor }}>{statusMessage}</div>
            </div>
        </div>
    );
};

export default GameInfo;
