const knex = require('../db/connection');
const movieService = require('../service/MovieService');

const limit = 50;

describe('tests for MovieService', () => {

    afterAll(() => {
        return knex.destroy();
    });

    describe("the getAll method", () => {

        const allMovies = movieService.getAll();

        it(`returns at least one movie.`, async () => {
            expect.assertions(1);
            expect((await allMovies).length).toBeGreaterThan(0);
        });

        it(`returns up to a maximum of ${limit} movies.`, async () => {
            expect.assertions(1);
            expect((await allMovies).length).toBeLessThanOrEqual(50);
        });

        it(`returns an array of movies`, async () => {
            expect.assertions(1);
            expect((await allMovies)).toBeInstanceOf(Array);
        });

        it('has a JSON inside of an array', async () => {
            expect.assertions(1);
            expect((await allMovies)[0]).toBeInstanceOf(Object);
        });

    });

    describe("the getOne method", () => {

        expect.assertions(4);

        it(`returns one movie.`, async () => {
            const id = 1;
            const movie = await movieService.getOne(id);

            expect(movie).toHaveLength(1);
            expect(movie[0]).toBeInstanceOf(Object);
            expect(movie[0]).toEqual(expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                genre: expect.any(String),
                rating: expect.any(Number),
                explicit: expect.any(Boolean)
            }));
        });

        it(`tries to gets a movie with the id of 0.`, async () => {
            const id = 0;
            const movie = await movieService.getOne(id);

            expect(movie).toEqual([]);
        });

        it(`tries to get a movie with too large id`, async () => {
            const id = 40;
            const movie = await movieService.getOne(id);

            expect(movie).toHaveLength(0);
            expect(movie).toEqual([]);
        });

        it('tries to get a movie with a negative id', async () => {
            const id = -5;
            const movie = await movieService.getOne(id);

            expect(movie).toHaveLength(0);
            expect(movie).toEqual([]);
        });

    });

    describe("the createNew method", () => {

        expect.assertions(2);

        it(`creates a new movie with a unique name.`, async () => {

            const tableCountBefore = parseInt((await knex('movies').count('*'))[0].count);
            const name = 'Very Unique Name',
                genre = 'Science Fiction',
                rating = 8,
                explicit = true;

            await movieService.createNew(name, genre, rating, explicit);

            const tableCountAfter = parseInt((await knex('movies').count('*'))[0].count);
            const movie = (await knex.from('movies').where({
                name: name
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            expect(movie).toEqual(expect.objectContaining({
                name: name,
                genre: genre,
                rating: rating,
                explicit: explicit
            }));
            expect(tableCountBefore).toBe(tableCountAfter - 1);
        });

        it(`attempts to create a new movie with an existing name.`, async () => {

            const tableCountBefore = parseInt((await knex('movies').count('*'))[0].count);
            const name = 'Very Unique Name',
                genre = 'Science Fiction',
                rating = 8,
                explicit = true;

            try {
                await movieService.createNew(name, genre, rating, explicit);
            } catch (err) {
                var error = err
            }

            const tableCountAfter = parseInt((await knex('movies').count('*'))[0].count);

            expect(error.name).toBe('error');
            expect(error.severity).toBe('ERROR');
            expect(error.code).toBe('23505');
            expect(error.constraint).toBe('movies_name_unique');
            expect(tableCountBefore).toBe(tableCountAfter);
        });

    });

    describe("the updateOne method", () => {

        expect.assertions(2);

        it(`updates a movie (all fields).`, async () => {

            const id = 5,
                name = 'Updated Name',
                genre = 'Romance',
                rating = 2,
                explicit = false;

            const tableCountBefore = parseInt((await knex('movies').count('*'))[0].count);
            const movieBefore = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            const result = await movieService.updateOne(id, name, genre, rating, explicit);

            const tableCountAfter = parseInt((await knex('movies').count('*'))[0].count);
            const movieAfter = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            expect(movieAfter).toEqual(expect.objectContaining({
                name: name,
                genre: genre,
                rating: rating,
                explicit: explicit
            }));
            expect(movieBefore).not.toEqual(expect.objectContaining({
                name: movieAfter.name,
                genre: movieAfter.genre,
                rating: movieAfter.rating,
                explicit: movieAfter.explicit
            }));
            expect(result).toBe(1);
            expect(tableCountBefore).toBe(tableCountAfter);
        });

        it(`updates a movie (all fields) several times. idempotent test.`, async () => {

            const id = 5,
                name = 'Totally new name',
                genre = 'Romance',
                rating = 2,
                explicit = false;

            // Before the update
            const movieBefore = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            await movieService.updateOne(id, name, genre, rating, explicit);

            // After first update
            const movieMiddle = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            await movieService.updateOne(id, name, genre, rating, explicit);

            // After second update
            const movieAfter = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            expect(movieAfter).toEqual(expect.objectContaining({
                name: name,
                genre: genre,
                rating: rating,
                explicit: explicit
            }));
            expect(movieBefore).not.toEqual(expect.objectContaining({
                name: movieAfter.name,
                genre: movieAfter.genre,
                rating: movieAfter.rating,
                explicit: movieAfter.explicit
            }));
            expect(movieMiddle).toEqual(movieAfter);
        });

        it(`attempts to update a movie that doesn't exist.`, async () => {

            const id = 10000,
                name = 'Updated Name',
                genre = 'Romance',
                rating = 2,
                explicit = false;

            const tableCountBefore = parseInt((await knex('movies').count('*'))[0].count);
            const movieBefore = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            try {
                var result = await movieService.updateOne(id, name, genre, rating, explicit);
            } catch (err) {}

            const tableCountAfter = parseInt((await knex('movies').count('*'))[0].count);
            const movieAfter = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            expect(movieBefore).toBeUndefined()
            expect(movieAfter).toBeUndefined()
            expect(result).toBe(0)
            expect(tableCountBefore).toBe(tableCountAfter);
        });

    });

    describe("the deleteOne method", () => {

        expect.assertions(2);

        it(`successfully deletes a movie`, async () => {

            const id = 7,
                name = 'Lord of the Rings: The Return of the King',
                genre = 'Science Fiction',
                rating = 10,
                explicit = false;

            const tableCountBefore = parseInt((await knex('movies').count('*'))[0].count);
            const movieBefore = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            const result = await movieService.deleteOne(id);

            const tableCountAfter = parseInt((await knex('movies').count('*'))[0].count);
            const movieAfter = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            expect(movieBefore).toEqual(expect.objectContaining({
                name: name,
                genre: genre,
                rating: rating,
                explicit: explicit
            }));
            expect(movieAfter).toBeUndefined();
            expect(result).toBe(1);
            expect(tableCountBefore).toBe(tableCountAfter + 1);
        });

        it(`attempts to delete a movie that doesn't exist.`, async () => {

            const id = 10000,
                name = 'Updated Name',
                genre = 'Romance',
                rating = 2,
                explicit = false;

            const tableCountBefore = parseInt((await knex('movies').count('*'))[0].count);
            const movieBefore = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            try {
                var result = await movieService.updateOne(id, name, genre, rating, explicit);
            } catch (err) {}

            const tableCountAfter = parseInt((await knex('movies').count('*'))[0].count);
            const movieAfter = (await knex.from('movies').where({
                id: id
            }).select('name', 'genre', 'rating', 'explicit'))[0];

            expect(movieBefore).toBeUndefined()
            expect(movieAfter).toBeUndefined()
            expect(result).toBe(0)
            expect(tableCountBefore).toBe(tableCountAfter);
        });

    });

});