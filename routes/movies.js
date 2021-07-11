const express = require('express');
const router = express.Router();
const movieController = require('../controller/MovieController');

const apiVersion = '/api/v1';

router.get(`${apiVersion}/movies`, movieController.getMovies);
router.post(`${apiVersion}/movies`, movieController.createMovie);

router.get(`${apiVersion}/movies/:id`, movieController.getMovie);
router.put(`${apiVersion}/movies/:id`, movieController.updateMovie);
router.delete(`${apiVersion}/movies/:id`, movieController.deleteMovie);

module.exports = router;