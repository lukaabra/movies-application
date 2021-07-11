const knex = require('../db/connection');
const request = require('supertest');
const app = require('../app');

describe('tests for MovieController', () => {

    const baseUrl = '/api/v1/movies'

    afterAll(() => {
        return knex.destroy();
    });

    describe('POST method test', () => {

        it('should create a new movie', async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'Successful post title',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(201)
        });

        it("shouldn't create a new movie with the same title", async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'The Land Before Time',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(409)
        });

        it("shouldn't create a new movie with one property missing", async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'Very Unique movie name',
                    genre: 'Testing',
                    rating: 7,
                })
            expect(res.statusCode).toEqual(400)
        });

        // The extra property will not be used in the controller, so it's existence is not a problem
        it("should create a new movie with one extra property", async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'Very Unique movie name',
                    genre: 'Testing',
                    rating: 7,
                    explicit: false,
                    test: 123
                })
            expect(res.statusCode).toEqual(201)
        });

        it('attempts to add a movie with an empty title', async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: '',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(400)
        });

        it('attempts to add a movie with an empty genre', async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'Empty genre',
                    genre: '',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(400)
        });

        // Type coercion is automatically done. Rating is being checked with middleware
        it('adds a movie with a string representation of rating', async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'String representation movie',
                    genre: 'test',
                    rating: '7',
                    explicit: true
                })
            expect(res.statusCode).toEqual(201)
        });

        it('attempts to add a movie with a negative rating', async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'Negative rating',
                    genre: 'Testing',
                    rating: -10,
                    explicit: true
                })
            expect(res.statusCode).toEqual(400)
        });

        it('attempts to add a movie with a too large rating', async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'Large rating',
                    genre: 'Testing',
                    rating: 1000,
                    explicit: true
                })
            expect(res.statusCode).toEqual(400)
        });

        it('attempts to add a movie with a string rating', async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'Testing movie 2000',
                    genre: 'Testing',
                    rating: 'test',
                    explicit: true
                })
            expect(res.statusCode).toEqual(400)
        });

        it('attempts to add a movie with a non-boolean explicit', async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'Testing movie 3000',
                    genre: 'Testing',
                    rating: 5,
                    explicit: 'test'
                })
            expect(res.statusCode).toEqual(400)
        });

        it("adds a movie with a 'true' explicit", async () => {
            const res = await request(app)
                .post(baseUrl)
                .send({
                    name: 'Another very unique movie name',
                    genre: 'Testing',
                    rating: 7,
                    explicit: 'true'
                })
            expect(res.statusCode).toEqual(201)
        });

    });

    describe('GET method test', () => {

        it('should return one new movie', async () => {
            const res = await request(app)
                .get(`${baseUrl}/4`);
            const movie = res.body[0];

            expect(res.statusCode).toEqual(200);
            expect(movie).toBeInstanceOf(Object);
            expect(movie).toHaveProperty('name');
            expect(movie.name).toEqual('Pulp Fiction');
            expect(movie.genre).toEqual('Crime');
            expect(movie.rating).toEqual(10);
            expect(movie.explicit).toEqual(true);
        });

        it('should return multiple movies', async () => {
            const res = await request(app)
                .get(baseUrl);
            const movies = res.body;

            expect(res.statusCode).toEqual(200);
            expect(movies).toBeInstanceOf(Array);
            expect(movies.length).toBeGreaterThan(0);
            expect(movies.length).toBeLessThanOrEqual(51);
            expect(movies[0]).toBeInstanceOf(Object);
            expect(movies[0]).toHaveProperty('name');
        });

    });

});