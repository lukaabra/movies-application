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

        it(`returns at least one movie.`, async () => {
            const id = 19;
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

        it(`returns up to a maximum of ${limit} movies.`, async () => {
            const id = 1;
            const movie = await movieService.getOne(id);

            expect(movie).toEqual([]);
        });

        it(`returns an array of movies`, async () => {
            const id = 40;
            const movie = await movieService.getOne(id);

            expect(movie).toHaveLength(0);
            expect(movie).toEqual([]);
        });

        it('the first element of the array is a JSON', async () => {
            const id = 0;
            const movie = await movieService.getOne(id);

            expect(movie).toHaveLength(0);
            expect(movie).toEqual([]);
        });

        it('the first element of the array is a JSON', async () => {
            const id = -5;
            const movie = await movieService.getOne(id);

            expect(movie).toHaveLength(0);
            expect(movie).toEqual([]);
        });

    });
});