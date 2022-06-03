const functions = require("firebase-functions");

/*
  * Require firebase admin, express and cors
  * for the work
 */

const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
/*
*   For key.json you need to create it
*   @ Project setting -> Service account -> Generate new private key button
*   then rename it key.json or any name you want
* */
