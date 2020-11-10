const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });

dotenv.config();

const route = require('./routes');

app.use("/", route);

app.listen(process.env.PORT || 4001, function(err) {
    if (err) console.log("Error in server setup") 
    console.log("Server listening on Port", 4001); 
});