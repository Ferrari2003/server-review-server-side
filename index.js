const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wjha8kd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const barberCollection = client.db('barber').collection('shop');
        const reviewCollection = client.db('barber').collection('review');

        app.get('/', async (req, res) => {
            const query = {}
            const limit = 3
            const cursor = barberCollection.find(query).limit(limit)
            const service = await cursor.toArray()
            res.send(service)
        });
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = barberCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const user = await barberCollection.findOne(query)
            res.send(user)
        })

        // review API
        app.get('/review', async(req, res) => {          
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })
        app.post('/review', async(req, res)=> {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Barber shop server is running')
})

app.listen(port, () => {
    console.log(`barber shop Online API server Active `)
})