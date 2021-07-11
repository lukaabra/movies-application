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
            expect((await allMovies).length).toBeGreaterThan(0);
        });

        it(`returns up to a maximum of ${limit} movies.`, async () => {
            expect((await allMovies).length).toBeLessThanOrEqual(50);
        });

        it(`returns an array of movies`, async () => {
            expect(await allMovies).toBeInstanceOf(Array);
        });

        it('the first element of the array is a JSON', async () => {
            expect((await allMovies)[0]).toBeInstanceOf(Object);
        });

    });

    describe("the getOne method", () => {

        it(`returns one movie.`, async () => {
            const id = 1;
            const movie = await movieService.getOne(id);

            expect(movie).toHaveLength(1);
            expect(movie[0]).toBeInstanceOf(Object);
            expect(movie[0]).toEqual(expect.objectContaining({
                name: expect.any(String),
                genre: expect.any(String),
                rating: expect.any(Number),
                explicit: expect.any(Boolean)
            }));
        });

        it(`try getting a movie with the id of 0.`, async () => {
            const id = 0;
            const movie = await movieService.getOne(id);

            expect(movie).toEqual([]);
        });

        it(`try getting a movie with too large id`, async () => {
            const id = 40;
            const movie = await movieService.getOne(id);

            expect(movie).toHaveLength(0);
            expect(movie).toEqual([]);
        });

        it('try getting a movie with a negative id', async () => {
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

            console.log(error)

            const tableCountAfter = parseInt((await knex('movies').count('*'))[0].count);

            expect(error.name).toBe('error');
            expect(error.severity).toBe('ERROR');
            expect(error.code).toBe('23505');
            expect(error.constraint).toBe('movies_name_unique');
            expect(tableCountBefore).toBe(tableCountAfter);
        });

    });
});