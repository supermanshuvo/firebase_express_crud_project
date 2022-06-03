const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.bigban = functions.https.onRequest((req,res)=>{
    const hours =(new Date().getHours()%12)+6;
    res.status(200).send(`
    <!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${'Superman '.repeat(hours)}
    </body>
  </html>
    `);
});