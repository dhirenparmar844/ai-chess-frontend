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

    const styles = {
        container: {
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #374151',
            display: 'flex',
            flexDirection: 'column',
            height: '280px'
        },
        title: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#9ca3af',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid #374151'
        },
        scrollArea: {
            flex: 1,
            overflowY: 'auto',
            paddingRight: '8px'
        },
        emptyText: {
            color: '#6b7280',
            fontSize: '14px',
            textAlign: 'center',
            fontStyle: 'italic',
            marginTop: '40px'
        },
        table: {
            width: '100%',
            fontSize: '14px',
            textAlign: 'left',
            borderCollapse: 'collapse'
        },
        th: {
            color: '#6b7280',
            fontWeight: '500',
            paddingBottom: '8px',
            fontSize: '12px'
        },
        tr: {
            borderBottom: '1px solid #374151'
        },
        td: {
            padding: '6px 0',
            color: '#d1d5db',
            fontFamily: 'monospace'
        },
        moveNumber: {
            color: '#6b7280',
            width: '30px'
        }
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Move History:</h3>
            <div ref={scrollRef} style={styles.scrollArea}>
                {movePairs.length === 0 ? (
                    <div style={styles.emptyText}>
                        1. ...
                    </div>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ ...styles.th, width: '30px' }}>#</th>
                                <th style={{ ...styles.th, width: '80px' }}>White</th>
                                <th style={styles.th}>Black</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movePairs.map((pair) => (
                                <tr key={pair.number} style={styles.tr}>
                                    <td style={{ ...styles.td, ...styles.moveNumber }}>{pair.number}.</td>
                                    <td style={styles.td}>{pair.white?.san || ''}</td>
                                    <td style={styles.td}>{pair.black?.san || ''}</td>
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
