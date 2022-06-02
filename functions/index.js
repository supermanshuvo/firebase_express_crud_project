'use strict';
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require('express');
const cors = require('cors');
let serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
app.use(cors({origin:true}));

// Get All Data
app.get("/api/read",async (req,res)=>{
  try{
    const document = db.collection('userInfo');
    const response = [];
    await document.get().then(Snapshot=>{
      let docs = Snapshot.docs;
      for(doc of docs){
        const selectedItem = {
          id: doc.id,
          name: doc.data().name,
          mobile: doc.data().mobile,
          address: doc.data().address
        }
        response.push(selectedItem);
      }
      return response;
    });
    return res.status(200).send(response);
  }catch (error){
    return res.status(404).send({status:"Failed",msg:"No data Found"});
  }
});
// Post api
app.post("/api/create", async (req,res)=>{
  try{
    await db.collection('userInfo').doc(`/${Date.now()}`).create({
      id:Date.now(),
      name: req.body.name,
      mobile: req.body.mobile,
      address: req.body.address
    });
    return res.status(200).send({status:"Success",msg:"Data not saved"});
  }catch (error){
    return res.status(500).send({status:"Failed",msg:"Data not saved"});
  }
})