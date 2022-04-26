const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gplkv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const productCollection = client.db("emaJohn").collection("product");
        app.get('/product', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
           
            const query = {};
            console.log(page, size)
            let products;
            const cursor = productCollection.find(query);
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray()
            } else {
                products = await cursor.toArray();
            }
            res.send(products)
        })

        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = { _id: { $in: ids } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)

        })
        app.get('/pageCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.json({ count })
        })


    }
    finally {
        // client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('connection compleat')
})

app.listen(port, () => {
    console.log('john is running')
})
