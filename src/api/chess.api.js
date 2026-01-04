import http from './http';

const chessApi = {
    createGame: async (color = 'white', difficulty = 'medium') => {
        const response = await http.post('/chess/new', { color, difficulty });
        return response.data;
    },

    getMyGames: async () => {
        const response = await http.get('/chess/my-games');
        // Handle cases where backend returns { games: [...] } vs [...]
        if (response.data && response.data.games && Array.isArray(response.data.games)) {
            return response.data.games;
        }
        return Array.isArray(response.data) ? response.data : [];
    },

    getGame: async (gameId) => {
        // Assuming backend has this endpoint for Game Page state
        const response = await http.get(`/chess/${gameId}`);
        return response.data;
    },

    makeMove: async (gameId, moveSan) => {
        // Backend expects 'move' as a query parameter for POST
        const response = await http.post(`/chess/${gameId}/move?move=${encodeURIComponent(moveSan)}`);
        return response.data;
    },

    makeAiMove: async (gameId) => {
        const response = await http.post(`/chess/${gameId}/ai-move`);
        return response.data;
    }
};

export default chessApi;
