const request = require("supertest");
const { Genre } = require("../../../models/genres");
const { User } = require("../../../models/users");
const mongoose = require("mongoose");
let server;
describe('auth middleware', () => {
    beforeEach(() => { 
        server = require("../../../index"); 
    });

    let token;
    /**
     * Close the server and disconnect from MongoDB after each test
     */
    afterEach(async() => {
        await server.close();
        await Genre.deleteMany({});
    });

    afterAll(async() => {
        await mongoose.disconnect();
    });

    const exec = () => {
        return request(server)
        .post('/genres')
        .set('x-auth-token', token)
        .send({name: 'genre_2', total:1});
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    })

    it('should return if no token is provided', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});