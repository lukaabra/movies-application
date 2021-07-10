const express = require('express');
const router = express.Router();
const movieController = require('../controller/MovieController');

const apiVersion = '/api/v1';

router.get(`${apiVersion}/movies`, movieController.getMovies);

module.exports = router;