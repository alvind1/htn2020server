const { info } = require('console');
var express = require('express');
var router = express.Router();
var fs = require('fs')
var pg = require('pg')

const {config, connectString} = require('../config')
/* GET users listing. */

router.post('/', async(req, res) => {
  var client = new pg.Client(config);
  console.log("HI");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  output = fs.readFileSync('./Downloads/person1.jpg');
  encodedImage = new Promise(async (resolve, reject) => {
    try{
      resolve(await Buffer.from(output, 'binary').toString('base64'));
    }catch(err){
      reject(err);
    }
  });

  encodedImage
  .then((encoded) => {
    console.log("enc", encoded);
    
    command1 = `UPDATE users SET age = 11 WHERE firstname = 'userFirst'`;
    command2 = `UPDATE users SET photos = '${encoded}' WHERE firstname = 'userFirst'`;
    client.query(command2)
    .then((output) => {
      console.log("good", output);
      client.end();
      res.send("good!");
      return;
    })
    .catch((err) => {
      throw err;
    });
    console.log("HERE?");
    return;
  })
  .catch((err) => {
    console.log(err.message);
    client.end();
    res.send("not good 128743");
  })
  return;
});

router.get('/userFirst', async(req, res) => {
  try{
    var client = new pg.Client(config);
    console.log("HI");
  
    client.connect()
    .catch((err) => {
      console.log(err);
      res.send("uh oh");
      return;
    });
  
    client.query("SELECT * FROM users WHERE firstname = 'userFirst'")
    .then((output) => {
      console.log("good", output);
      res.send(output.rows[0].photos);
    })
    .catch((err) => {
      throw err;
    });

  }catch(err){
    console.log(err.message);
    res.send("bad 19823");
  }
})

router.put('/', async(req, res) => { 
  //changing table stuff
  try{
    var client = new pg.Client(config);
    console.log("HI");
  
    client.connect()
    .catch((err) => {
      console.log(err);
      res.send("uh oh");
      return;
    });
  
    //client.query("INSERT INTO users(firstname, lastname) VALUES ('userFirst', 'userLast')");
    //output = await client.query("SELECT * FROM users");

    //output = await client.query("ALTER TABLE users DROP COLUMN photos");

    output = await client.query("ALTER TABLE users ADD COLUMN photos text");

    res.send("good123768");
  }catch(err){
    console.log(err.message, "bad123187");
    res.send("bad1824");
  }
})

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

    returnVal = 'respond with a resource';
    let output = 1;

    output = fs.readFileSync('./Downloads/person1.jpg');
    
    //encodedImage = await Buffer.from(output, 'binary').toString('base64');


    returnVal = encodedImage;
    console.log("output = ", encodedImage);
    res.send(encodedImage);
  }catch(err){
    console.log("!!!", err);
    res.send("yikes")
  } 
});

module.exports = router;
