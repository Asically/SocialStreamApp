const express = require('express');
const StreamController = require('../controllers/streamController');

const setStreamRoutes = (app) => {
    const router = express.Router();
    const streamController = new StreamController();

    router.get('/streams', streamController.getStream.bind(streamController));
    router.post('/streams', streamController.createStream.bind(streamController));
    router.delete('/streams/:id', streamController.deleteStream.bind(streamController));

    app.use('/api', router);
};

module.exports = setStreamRoutes;