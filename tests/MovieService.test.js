const knex = require('../db/connection');
const movieService = require('../service/MovieService');

const limit = 50;

describe("the getAll method", () => {

    const allMovies = movieService.getAll();

    beforeAll((done) => {
        // const seed = knex.insert(require('../db/seeds/movies_seed'));
        // return knex.migrate.latest().then(seed);
        done();
    })

    afterAll(() => {
        // Closing the DB connection allows Jest to exit successfully.
        // return knex.migrate
        //     .rollback()
        //     .then(() => knex.destroy());
        return knex.destroy();
    })

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