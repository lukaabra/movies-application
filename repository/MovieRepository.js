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

    // All columns are always updated since they are all NOT NULL columns
    updateOne(id, name, genre, rating, explicit) {
        return knex('movies')
            .where({
                id
            })
            .update({
                name: name,
                genre: genre,
                rating: rating,
                explicit: explicit
            });
    }

}

module.exports = new MovieRepository();