const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../../models/genres");
const { User } = require("../../../models/users");
let server;
/**
 * Integration tests for the /genres endpoint
 * @group integration
 */
describe('/genres', () => {

    /**
     * Setup the server before each test
     */
    beforeEach(() => { 
        server = require("../../../index"); 
    });

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
    /**
     * Test the GET /genres endpoint to return all the genres
     * @test {GET /genres}
     */
    describe('GET /', () => {
        it('should return all the genres', async () => {
            await Genre.collection.insertMany([
                {name: 'genre_1'},
                {name: 'genre_2'}
            ]);

            const res = await request(server).get('/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre_1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre_2')).toBeTruthy();
        });
    });

    describe('GET [/:id]', () => {
        it('should return the genre with given id', async() => {
            const genre = new Genre({name: 'genre_1'});
            await genre.save();

            const res = await request(server).get('/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid is passed', async() => {

            const res = await request(server).get('/genres/1');
            expect(res.status).toBe(404);
        });

        it('shoould return 404 if the genre with the given id does not exists', async() => {
            const id = new mongoose.Types.ObjectId().toHexString();

            const res = await request(server).get('/genres/'+id);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        // Define the happy path, and then in each test, we change
        // one parameter that clearly aligns with the name of the
        // test.

        let token;
        let name;

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre_1';
        });

        const exec = async() => {
            return await request(server)
                .post('/genres')
                .set('x-auth-token', token)
                .send({name: name, total:2});
        }


        it('should return 401 if the client is not logged in', async() => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if the genre is less than 5 characters', async() => {
            name = '1';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if the genre is more than 50 characters', async() => {
            name = new Array(52).join('n');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is vaild', async() => {
            name = 'genre_2'
            const res = await exec();

            const genre = await Genre.find({name: 'genre_2'});
            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is vaild', async() => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name','genre_1');
        });
    });

    describe('PUT [/:id]', () => {

        let token;
        let newName;
        let genre;
        let id;

        beforeEach(async() => {

            genre = new Genre({name: 'genre_1', total:2});
            await genre.save();

            token = new User().generateAuthToken();
            newName = 'genre_3';
            id = genre._id;
        });

        const postExec = async() => {
            return await request(server)
                .post('/genres')
                .set('x-auth-token', token)
                .send({name: name, total:2});
        }
        const exec = async() => {
            return await request(server)
                .put('/genres/' + id)
                .set('x-auth-token', token)
                .send({name: newName, total:2});
        }


        it('should return 401 if client is not logged in', async () => {
           token = ''
           
           const res = await exec();

           expect(res.status).toBe(401);
        });

        it('should return 400 if the genre is less than 5 characters', async () => {
            
            newName = 'Com';
            
            const res = await exec();
 
            expect(res.status).toBe(400);
         });

         it('should return 400 if the genre is more than 50 characters', async () => {

            newName = new Array(52).join('n');
            
            const res = await exec();
 
            expect(res.status).toBe(400);
         });

         it('should return 404 if the id is invalid', async () => {
            
            id = '123s';
            
            const res = await exec();
 
            expect(res.status).toBe(404);
         });

         it('should return 404 if the given genre is not found', async () => {
            
            id = new mongoose.Types.ObjectId().toHexString();
            
            const res = await exec();
 
            expect(res.status).toBe(404);
         });

         it('should update the genre if it is valid', async () => {
            await exec();

            const updateGenre = await Genre.findById(genre._id);

            expect(updateGenre.name).toBe(newName);
         });

         it('should return the updated genre if it is valid', async () => {
            
            const res = await exec(); 

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name',newName);
         });
    });

    describe('delete [/:id]', () => {
        let token;
        let genre;
        let id;

        beforeEach(async() => {

            genre = await Genre({name: 'genre_3', total:2});
            await genre.save();

            token = new User({ isAdmin: true }).generateAuthToken();
            id = genre._id;
        });

        const exec = async() => {
            return await request(server)
                .delete('/genres/' + id)
                .set('x-auth-token', token)
                .send();
        }

        it('should return 401 if client is not logged in', async () => {
            token = ''
            
            const res = await exec();
 
            expect(res.status).toBe(401);
         });

         it('should return 403 if user is not admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();
            
            const res = await exec();
 
            expect(res.status).toBe(403);
         });

         it('should return 404 if given genre id is invalid', async () => {
            id = '123s';

            const res = await exec();
 
            expect(res.status).toBe(404);
         });

         it('should return 404 if genre with given id is not found', async () => {
            id = new mongoose.Types.ObjectId().toHexString();  

            const res = await exec();
 
            expect(res.status).toBe(404);
         });

         it('should delete the genre if input is valid', async () => {
            await exec();

            const genreInDb = await Genre.findById(id);

            expect(genreInDb).toBeNull();
         });

         it('should return the genre if it deleted', async () => {
            const res = await exec(); 

            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
         });
    });
});
