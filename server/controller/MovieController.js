const movieService = require('../service/MovieService');
const {
    validationResult
} = require('express-validator');

/**
 * Calls the Movie service to get, create, update, or delete Movie objects
 */
class MovieController {

    constructor() {
        this.getMovies = this.getMovies.bind(this);
        this.getMovie = this.getMovie.bind(this);
        this.createMovie = this.createMovie.bind(this);
        this.updateMovie = this.updateMovie.bind(this);
        this.deleteMovie = this.deleteMovie.bind(this);
    }

    async getMovies(req, res) {
        let {
            limit,
            offset
        } = req.query;

        limit = Math.min(limit, 5) || 5;
        offset = parseInt(offset) || 0;

        try {
            const allMovies = await movieService.getAll(limit, offset);

            if (allMovies) {
                res.status(200).json(allMovies);
            } else {
                res.status(404).json({
                    succcess: false,
                    status: 404
                });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async getMovie(req, res) {
        try {
            const {
                id
            } = req.params;

            const movie = await movieService.getOne(id);

            if (movie.length > 0 && movie) {
                res.status(200).json(movie);
            } else {
                res.status(404).json({
                    succcess: false,
                    status: 404,
                });
            }
        } catch (err) {
            res.status(500).json({
                err: err,
                success: false,
                status: 500
            });
        }
    }

    async createMovie(req, res) {
        if (!this.validateBody(req, res))
            return;

        const {
            name,
            genre,
            rating,
            explicit
        } = req.body;

        try {

            const createdMovieId = await movieService.createNew(name, genre, rating, explicit);

            if (createdMovieId) {
                res.status(201).json({
                    success: true,
                    createdId: createdMovieId,
                    status: 201
                });
            } else {
                res.status(404).json({
                    succcess: false,
                    status: 404
                });
            }
        } catch (err) {
            // Key already exists error code
            if (err.code = 23505) {
                res.status(409).json({
                    succcess: false,
                    message: 'Title already exists. Please choose another movie.',
                    status: 409
                });
            } else {
                res.status(500).json(err);
            }
        }
    }

    async updateMovie(req, res) {
        if (!this.validateBody(req, res))
            return;

        try {
            const {
                name,
                genre,
                rating,
                explicit
            } = req.body;
            const {
                id
            } = req.params;

            if (explicit instanceof String) {
                res.status(400).json({
                    succcess: false,
                    message: 'Check for any incorrectly filled fields.',
                    status: 400
                });
            }

            const movie = await movieService.updateOne(id, name, genre, rating, explicit);

            if (movie) {
                res.status(200).json(movie);
            } else {
                res.status(404).json({
                    succcess: false,
                    status: 404
                });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async deleteMovie(req, res) {
        try {
            const {
                id
            } = req.params;

            const result = await movieService.deleteOne(id);

            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    succcess: false,
                    message: 'A movie with that id does not exist',
                    status: 404,
                    result: result
                });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }

    validateBody(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                succcess: false,
                message: 'Check for any incorrectly filled fields.',
                status: 400
            });
            return false;
        } else {
            return true;
        }
    }

};

module.exports = new MovieController();