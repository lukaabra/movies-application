const movieRepo = require("../repository/MovieRepository");

/**
 * Instructs the repository to create, retrieve, delete, or update movies.
 * Passes along the returned values from the repository.
 */
class MovieService {

    constructor() {}

    async getAll(limit, offset) {
        return await movieRepo.getAll(limit, offset);
    }

    async getOne(id) {
        return await movieRepo.getOne(id);
    }

    updateOne(id, title, genre, rating, explicit) {

    }

    createNew(title, genre, rating, explicit) {

    }

    deleteOne(id) {

    }

}

module.exports = new MovieService();