const request = require('supertest');
const moment = require('moment');
const { Rental } = require('../../../models/rentals');
const { User } = require('../../../models/users');
const { Movie } = require('../../../models/movies');
const mongoose = require('mongoose');

describe('Returns [/api/returns]', () => {
    let server;
    let rental;
    let token;
    let customerId;
    let movieId;
    let movie;

    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach(async() => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    afterAll(async() => {
        await mongoose.disconnect();
    });

    beforeEach(async() => {
        token = new User().generateAuthToken();
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        
        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {name: '12345', total: 10},
            numberInStock: 10
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        await rental.save();
    });

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    }

    it('should return 401 if the client is not logged in', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if the customerId is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if the movieId is not provided', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if the rental is not found for customerId/movieId', async () => {
        customerId = new mongoose.Types.ObjectId().toHexString();
        movieId = new mongoose.Types.ObjectId().toHexString();
        
        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if the rental is already processed', async () => {
        rental.dateReturned = Date.now();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if the return is valid', async () => {

        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the dateReturned property if the return is valid', async () => {
        await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
        // expect(rentalInDb.dateReturned).not.toBeNull();
    });

    it('should set the rentalFee property if the return is valid', async () => {
        rental.dateOut = moment().add(-10, 'days').toDate();
        await rental.save();

        await exec();

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(20);
    });

    it('should increase the numberInStock property if the input is valid', async () => {
        await exec();

        const movieInDb = await Movie.findById(rental.movie._id);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if the input is valid', async () => {
        
        const res = await exec();

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['_id', 'movie', 'customer', 'dateOut', 'dateReturned', 'rentalFee'])
        );

    });
});