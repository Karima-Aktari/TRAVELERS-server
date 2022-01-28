const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0mt6g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('Database connected Successfully');
        const database = client.db('travelersBlog');
        const spotCollection = database.collection('spots');
        const usersCollection = database.collection('users');
        const userExperienceCollection = database.collection('userExperience');
        const blogCollection = database.collection('blogs');

        //Get SpotCollections API
        app.get('/spots', async (req, res) => {
            const cursor = spotCollection.find({});
            const spots = await cursor.toArray();
            res.send(spots);
        })

        //POST UserExperience API
        app.post('/userExperience', async (req, res) => {
            const userExperience = req.body;
            console.log(userExperience);
            const result = await userExperienceCollection.insertOne(userExperience);
            res.json(result);
            console.log(result);
        })

        //GET Experience API
        app.get('/userExperience', async (req, res) => {
            const cursor = userExperienceCollection.find({});
            const experience = await cursor.toArray();
            res.send(experience);
        })

        //GET Single experience BY ID
        app.get('/userExperience/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const userExperience = await userExperienceCollection.findOne(query);
            res.json(userExperience);
        })

        //POST admin Blog API
        app.post('/addBlog', async (req, res) => {
            const blog = req.body;
            console.log(blog);
            const result = await blogCollection.insertOne(blog);
            console.log(result);
            res.send('result');
        })
        //GET BlogCollections API
        app.get('/addBlog', async (req, res) => {
            const cursor = blogCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        })
        //GET single Blog API
        app.get('/addBlog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const adminBlog = await blogCollection.findOne(query);
            res.json(adminBlog);
        })
        //POST users to database
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })

        // //Update users API
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        //Make Admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

//Server checking
app.get('/', (req, res) => {
    res.send('Server is Connected');
});
app.listen(port, () => {
    console.log('Server running at port', port)
})
