var express = require('express');
var router = express.Router();
var fs = require('fs')
var pg = require('pg')

const {config, connectString} = require('../config')
/* GET users listing. */
router.get('/woot', async (req, res, next) => {
    var client = new pg.Client(config);
    client.connect();
    await client.query("ALTER TABLE users ADD COLUMN bio STRING, ADD COLUMN feature STRING");
    let output = await client.query("SELECT * FROM users");
    res.send(output);
});

router.post('/register', async (req, res, next) => {
    let input = req.body;
    var client = new pg.Client(config);
    await client.connect();

    let user  = await client.query(`SELECT * FROM users WHERE email='${input.email}' OR username='${input.username}'`);

    if(user.rowCount > 0){
        res.status(400);
        res.send("email or username already taken");
        return;
    }

    await client.query(`INSERT INTO users(firstname, lastname, email, password, username, phone) VALUES ('${input.firstName}','${input.lastName}','${input.email}','${input.password}','${input.username}', '${input.phone}')`);

    user = await client.query(`SELECT * FROM users WHERE email='${input.email}'`);

    res.send(user.rows[0]);
});

router.post('/login', async (req, res, next) => {
    let input = req.body;
    var client = new pg.Client(config);
    await client.connect();

    let user = await client.query(`SELECT * FROM users WHERE email='${input.email}' AND password='${input.password}'`);
    if(user.rowCount == 0){
        res.status(401);
        res.send("invalid email password combo");
        return;
    }

    res.send(user.rows[0]);
});

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
