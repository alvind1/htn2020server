var express = require('express');
var router = express.Router();
var fs = require('fs')
var pg = require('pg')

const {config, connectString} = require('../config')
/* GET users listing. */
router.get('/', async (req, res, next) => {
  try{
    //console.log(connectString);
    //var pool = new pg.Pool(connectString);
    //console.log(config);
    var client = new pg.Client(config);
    console.log("HI");

    client.connect()
    .catch((err) => {
      console.log(err);
      res.send("uh oh");
      return;
    });

    //client.query("INSERT INTO users(firstname, lastname) VALUES ('userFirst', 'userLast')");
    output = await client.query("SELECT * FROM users");
    console.log(output);

    res.send('respond with a resource');
  }catch{
    res.send("yikes")
  } 
});

module.exports = router;
