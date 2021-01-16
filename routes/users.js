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
