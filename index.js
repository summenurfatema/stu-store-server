const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6v5oj5d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)


async function run() {

    try {
        const studentCollection = client.db('stuStore').collection('studentsCollection')
        
        app.post('/add-student', async (req, res) => {
            const studentData = req.body
            const result = await studentCollection.insertOne(studentData)
            res.send(result)
        })

        app.get('/student/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id:new ObjectId(id) }
            const result = await studentCollection.findOne(query)
            res.send(result)
        })

        app.get('/all-student-data',async(req,res)=>{
            const query={}
            const result = await studentCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/student-data/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await studentCollection.deleteOne(query)
            res.send(result)
        })

        app.put("/updated-data/:id", async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            const filter = { _id:new ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
              $set: {
              fullName:update.fullName,
              classDevision:update.classDivision,
              rollNumber:update.roll,
              addressLine1:update.add1,
              addressLine2:update.add2,
              landmark:update.lndMrk,
              city:update.cty,
              pincode:update.pin
              },
            };
            const result = await studentCollection.updateOne(
              filter,
              updateDoc,
              option
            );
            res.send(result);
          });
    }
    finally {

    }

}
run().catch(err => console.error(err))





app.get('/', (req, res) => {
    res.send('stu-student !!')
})
app.listen(port, () => {
    console.log(`stu-student server running on ${port}`)
})