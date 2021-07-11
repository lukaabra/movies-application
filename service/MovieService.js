const movieRepo = require("../repository/MovieRepository");

/**
 * Instructs the repository to create, retrieve, delete, or update movies.
 * Passes along the returned values from the repository.
 */
class MovieService {

    constructor() {}

    async getAll(limit, offset) {
        limit = limit == undefined ? 50 : limit;
        offset = offset == undefined ? 0 : offset;

        return await movieRepo.getAll(limit, offset);
    }

    async getOne(id) {
        return await movieRepo.getOne(id);
    }

    updateOne(id, name, genre, rating, explicit) {

    }

    async createNew(name, genre, rating, explicit) {
        return await movieRepo.createNew(name, genre, rating, explicit);
    }

    deleteOne(id) {

    }

}

module.exports = new MovieService();