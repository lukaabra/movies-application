const express = require('express');
const router = express.Router();
const {
    body,
    param
} = require('express-validator');
const movieController = require('../controller/MovieController');

const apiVersion = '/api/v1';

router.get(`${apiVersion}/movies`, movieController.getMovies);

router.post(`${apiVersion}/movies`,
    body('name').not().isEmpty().trim(),
    body('genre').not().isEmpty().trim(),
    body('rating').isInt({
        min: 0,
        max: 10
    }),
    body('explicit').isBoolean(),
    movieController.createMovie);



router.get(`${apiVersion}/movies/:id`,
    param('id').isInt({
        min: 0
    }),
    movieController.getMovie);

router.put(`${apiVersion}/movies/:id`,
    body('name').not().isEmpty().trim(),
    body('genre').not().isEmpty().trim(),
    body('rating').isInt({
        min: 0,
        max: 10
    }),
    body('explicit').isBoolean(),
    param('id').isInt({
        min: 0
    }),
    movieController.updateMovie);

router.delete(`${apiVersion}/movies/:id`,
    param('id').isInt({
        min: 0
    }),
    movieController.deleteMovie);

module.exports = router;