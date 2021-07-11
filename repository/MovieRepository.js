const knex = require('../db/connection');

class MovieRepository {

    constructor() {

    }

    getAll(limit, offset) {
        limit = limit == undefined ? 50 : limit;
        offset = offset == undefined ? 0 : offset;

        return knex.from('movies').select('name', 'genre', 'rating', 'explicit');
    }

    getOne(id) {
        return knex.from('movies').where({
            id: id
        }).select('name', 'genre', 'rating', 'explicit');
    }

    updateOne(id, title, genre, rating, explicit) {

    }

}

module.exports = new MovieRepository();