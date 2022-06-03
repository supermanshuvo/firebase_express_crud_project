const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
/*
*   For key.json you need to create it
*   @ Project setting -> Service account -> Generate new private key button
*   then rename it key.json or any name you want
* */
let serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors({origin:true}));
// Read All data
app.get('/api/read', async  (req,res)=>{
    try{
        const document = db.collection('userInfo');
        const response = [];
        await document.get().then(Snapshot=>{
            let docs = Snapshot.docs;
            for(doc of docs){
                const selectedItem = {
                    id:doc.id,
                    name:doc.data().name,
                    mobile:doc.data().mobile,
                    address:doc.data().address,
                }
                response.push(selectedItem);
            }
            return response;
        });
        return res.status(200).send(response);
    }catch (error){
        return res.status(200).send({status:"Failed",msg:"Failed to get"});
    }
});
// post Data in user info
app.post("/api/create",async (req,res)=>{
    try{
        await db.collection('userInfo').doc(`/${Date.now()}`).create({
            id: Date.now(),
            name:req.body.name,
            mobile: req.body.mobile,
            address : req.body.address,
        });
        return res.status(200).send({status:"Success",msg:"Data saved"});
    }catch (error){
        return res.status(200).send({status:"Failed",msg:"Data not saved"});
    }
});

// Read specific data
app.get('/api/read/:id', async  (req,res)=>{
    try{
        const document = await db.collection('userInfo').doc(req.params.id).get();
        const response = document.data();
        // console.log(response);
        return res.status(200).send(response);
    }catch (error){
        return res.status(200).send({status:"Failed",msg:"Failed to get"});
    }
});

// update specific data
app.put('/api/update/:id', async  (req,res)=>{
    try{
        const document  = await db.collection('userInfo').doc(req.params.id).update({
            name:req.body.name,
            mobile: req.body.mobile,
            address : req.body.address,
        });
        return res.status(200).send("Data Updated");
    }catch (error){
        return res.status(200).send({status:"Failed",msg:"Failed to Update"});
    }
});

// Delete Data from user info

app.delete("/api/delete/:id", async (req,res)=>{
    try{
        const document = await db.collection('userInfo').doc(req.params.id).delete();
        return  res.status(200).send("Data is deleted");
    }catch (error){
        return res.status(200).send({status:"Failed",msg:"Failed to Delete"});
    }
});

// hosting api testing area

app.get("/",(req,res)=>{
    const date = new Date();
    const hours = (date.getHours()%12)+1;
    res.send(`
    <!doctype html>
    <head>
      <title>Time</title>
      <link rel="stylesheet" href="/style.css">
      <script src="/script.js"></script>
    </head>
    <body>
      <p>In London, the clock strikes:
        <span id="bongs">${'BONG '.repeat(hours)}</span></p>
      <button onClick="refresh(this)">Refresh</button>
    </body>
  </html>`)
});

// Bang end point
app.get("/api",(req,res)=>{
    const date = new Date();
    const hours = (date.getHours()%12)+1;
    res.json({bongs:'BONGS'.repeat(hours)});
});

exports.app = functions.https.onRequest(app);