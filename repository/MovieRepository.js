const knex = require('../db/connection');

class MovieRepository {

    constructor() {

    }

    getAll(limit, offset) {
        return knex.from('movies').select('name', 'genre', 'rating', 'explicit');
    }

    getOne(id) {
        return knex.from('movies').where({
            id: id
        }).select('name', 'genre', 'rating', 'explicit');
    }

    createNew(name, genre, rating, explicit) {
        return knex('movies').insert({
            name: name,
            genre: genre,
            rating: rating,
            explicit: explicit
        });
    }

    updateOne(id, name, genre, rating, explicit) {

    }

}

module.exports = new MovieRepository();