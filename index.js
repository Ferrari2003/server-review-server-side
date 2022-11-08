const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wjha8kd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serverCollection = client.db('barber').collection('shop');
        app.get('/services',async(req, res) => {
            const query = {};
            const cursor = serverCollection.find(query);
            const services = await cursor.limit(3).toArray();           
            res.send(services)
        });
        app.get('/service',async(req, res) => {
            const query = {};
            const cursor = serverCollection.find(query);
            const service = await cursor.toArray();           
            res.send(service)
        })
        
    }
    finally{

    }
}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Barber shop server is running')
})

app.listen(port, () => {
    console.log(`barber shop Online API server Active `)
})