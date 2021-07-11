const movieService = require('../service/MovieService');

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

        limit = Math.min(limit, 50);
        offset = parseInt(offset);

        try {
            const allMovies = await movieService.getAll(limit, offset);

            if (allMovies) {
                res.status(200).json(allMovies);
            } else {
                res.status(404).json({
                    succcess: false
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

            if (movie) {
                res.status(200).json(movie);
            } else {
                res.status(404).json({
                    succcess: false
                });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async createMovie(req, res) {
        try {
            const {
                name,
                genre,
                rating,
                explicit
            } = req.body;

            const createdMovieId = await movieService.createNew(name, genre, rating, explicit);

            if (createdMovieId) {
                res.status(200).json({
                    success: true,
                    createdId: createdMovieId
                });
            } else {
                res.status(404).json({
                    succcess: false
                });
            }
        } catch (err) {
            console.log(err);

            if (err.code = 23505) {
                res.status(409).json({
                    succcess: false,
                    message: 'Title already exists. Please choose another movie.',
                });
            } else {
                res.status(500).json(err);
            }
        }
    }

    updateMovie(id, title, genre, rating, explicit) {

    }

    deleteMovie(id) {

    }

};

module.exports = new MovieController();