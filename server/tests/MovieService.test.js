const knex = require('../db/connection');
const movieService = require('../service/MovieService');

const limit = 10;

describe('tests for MovieService', () => {

    afterAll(() => {
        return knex.destroy();
    });

    describe("the getAll method", () => {

        // TEST LIMIT AND OFFSET

        it(`returns default amount of movies.`, async () => {
            const allMovies = await movieService.getAll();
            console.log(allMovies.length)
            console.log(allMovies instanceof Array)
            console.log(allMovies[0] instanceof Object)

            expect(allMovies.length).toBeGreaterThan(0);
            expect(allMovies.length).toBeLessThanOrEqual(limit);
            expect(allMovies).toBeInstanceOf(Array);
            expect(allMovies[0]).toBeInstanceOf(Object);
        });

        it(`returns up to a maximum of a preset limit movies. preset limit is 5`, async () => {
            const passedLimitMovies = await movieService.getAll(5);

            expect(passedLimitMovies.length).toBeLessThanOrEqual(5);
            expect(passedLimitMovies).toBeInstanceOf(Array);
            expect(passedLimitMovies[0]).toBeInstanceOf(Object);
        });

        it(`returns up to a maximum of default limit movies with offset 3.`, async () => {
            const defaultOffsetMovies = await movieService.getAll(limit)
            const presetOffsetMovies = await movieService.getAll(limit, 3);

            expect(presetOffsetMovies).not.toMatchObject(defaultOffsetMovies);
        });

    });

    describe("the getOne method", () => {

        it(`returns one movie.`, async () => {
            const id = 1;
            const movie = await movieService.getOne(id);

            // Idempotent test
            const newMovie = await movieService.getOne(id);

            expect(movie).toHaveLength(1);
            expect(movie[0]).toBeInstanceOf(Object);
            expect(movie[0]).toEqual(newMovie[0])
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