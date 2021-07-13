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

        it('should not return any movie with too large id', async () => {
            const res = await request(app)
                .get(`${baseUrl}/1000`);

            expect(res.statusCode).toEqual(404);
        });

        it('should not return any movie with negative id', async () => {
            const res = await request(app)
                .get(`${baseUrl}/-1`);

            expect(res.statusCode).toEqual(404);
        });

        it('should not return any movie with string id', async () => {
            const res = await request(app)
                .get(`${baseUrl}/test`);

            expect(res.statusCode).toEqual(500);
        });

        it('should not return any movie with 0 id', async () => {
            const res = await request(app)
                .get(`${baseUrl}/0`);

            expect(res.statusCode).toEqual(404);
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

    describe('DELETE method test', () => {

        it("should delete 'Happy Gilmore' movie with id 9", async () => {
            const res = await request(app)
                .delete(`${baseUrl}/9`);
            const resCode = res.body;

            expect(res.statusCode).toEqual(200);
            expect(resCode).toBe(1);
        });

        it('should not delete any movie with too large id', async () => {
            const res = await request(app)
                .delete(`${baseUrl}/1000`);
            const {
                result,
                message
            } = res.body;

            expect(res.statusCode).toEqual(404);
            expect(message).toEqual('A movie with that id does not exist');
            expect(result).toBe(0);
        });

        it('should not delete any movie with negative id', async () => {
            const res = await request(app)
                .delete(`${baseUrl}/-4332`);
            const {
                result,
                message
            } = res.body;

            expect(res.statusCode).toEqual(404);
            expect(message).toEqual('A movie with that id does not exist');
            expect(result).toBe(0);
        });

        it('should not delete any movie with 0 id', async () => {
            const res = await request(app)
                .delete(`${baseUrl}/0`);
            const {
                result,
                message
            } = res.body;

            expect(res.statusCode).toEqual(404);
            expect(message).toEqual('A movie with that id does not exist');
            expect(result).toBe(0);
        });

        it('should not delete any movie with string id', async () => {
            const res = await request(app)
                .delete(`${baseUrl}/test`);
            const err = res.body;

            expect(res.statusCode).toEqual(500);
            expect(err.code).toEqual('22P02');
            expect(err.name).toEqual('error');
            expect(err.severity).toEqual('ERROR');
        });

    });

    describe('PUT method test', () => {

        it('should update a movie', async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: 'Successful put title',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(200);
        });

        it('should not update a movie with negative id', async () => {
            const res = await request(app)
                .put(`${baseUrl}/-1`)
                .send({
                    name: 'Successful put title',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(400);
        });

        it('should not update a movie with 0 id', async () => {
            const res = await request(app)
                .put(`${baseUrl}/0`)
                .send({
                    name: 'Successful put title',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(404);
        });

        it('should not update a movie with string id', async () => {
            const res = await request(app)
                .put(`${baseUrl}/test`)
                .send({
                    name: 'Successful put title',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(400);
        });

        it('should not update a movie with too large id', async () => {
            const res = await request(app)
                .put(`${baseUrl}/1000`)
                .send({
                    name: 'Successful put title',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(404);
        });

        it("should update a movie with the same title", async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: 'The Land Before Time',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(200)
        });

        it("shouldn't update a movie with one property missing", async () => {
            const res = await request(app)
                .put(`${baseUrl}/1000`)
                .send({
                    name: 'The Land Before Time',
                    genre: 'Testing 2',
                    rating: 7,
                })
            expect(res.statusCode).toEqual(400)
        });

        // The extra property will not be used in the controller, so it's existence is not a problem
        it("should update a movie with one extra property", async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: 'The Land Before Time',
                    genre: 'Testing 3',
                    rating: 7,
                    explicit: false,
                    test: 123
                })
            expect(res.statusCode).toEqual(200)
        });

        it("shouldn't update a movie with an empty title", async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: '',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(400)
        });

        it("shouldn't update a movie with an empty genre", async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: 'The Land Before Time',
                    genre: '',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(400)
        });

        // Type coercion is automatically done. Rating is being checked with middleware
        it('should not update a movie with a string representation of rating', async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: 'The Land Before Time',
                    genre: 'test',
                    rating: '7',
                    explicit: true
                })
            expect(res.statusCode).toEqual(200)
        });

        it('should not update a movie with a negative rating', async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: 'The Land Before Time',
                    genre: 'Testing',
                    rating: -10,
                    explicit: true
                })
            expect(res.statusCode).toEqual(400)
        });

        it('should not update a movie with a too large rating', async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: 'The Land Before Time',
                    genre: 'Testing',
                    rating: 1000,
                    explicit: true
                })
            expect(res.statusCode).toEqual(400)
        });

        it('should not update a movie with a string rating', async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: 'The Land Before Time',
                    genre: 'Testing',
                    rating: 'test',
                    explicit: true
                })
            expect(res.statusCode).toEqual(400)
        });

        it('should not update a movie with a non-boolean explicit', async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: 'The Land Before Time',
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
                    name: 'This one is a totally unique name',
                    genre: 'Testing',
                    rating: 7,
                    explicit: 'true'
                })
            expect(res.statusCode).toEqual(201)
        });

        it("shouldn't update a movie with the same title already existing explicit", async () => {
            const res = await request(app)
                .put(`${baseUrl}/1`)
                .send({
                    name: 'Another very unique movie name',
                    genre: 'Testing',
                    rating: 7,
                    explicit: true
                })
            expect(res.statusCode).toEqual(500)
        });

    });

});