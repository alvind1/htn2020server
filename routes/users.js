const { info } = require('console');
var express = require('express');
var router = express.Router();
var fs = require('fs')
var pg = require('pg')
var sharp = require('sharp');

const {config, connectString} = require('../config')
/* GET users listing. */

router.post('/testUpload', async (req, res) => {
    console.log("asdfasdfa");
    res.send("yay");
});

router.post('/imageUpload', async(req, res) => {
  let info = req.body; //Need encoded, username
  var client = new pg.Client(config);
  console.log("HI23412");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  command2 = `UPDATE users SET profilePic = '${info["encoded"]}' WHERE username = '${info["username"]}' `;
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
  return;
});

router.post('/uploadDownloads', async(req, res) => {
  var client = new pg.Client(config);
  console.log("HI23412");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  sharp(fs.readFileSync('./Downloads/Olaf.jpg'))
  .resize({width: 400, height: 400})
  .toBuffer()
  .then((img) => {
    return img.toString('base64');
  })
  .then((encoded) => {
    command1 = `UPDATE users SET age = 11 WHERE firstname = 'userFirst'`;
    command2 = `UPDATE users SET photos = '${encoded}' WHERE username = 'testUsername'`;
    return client.query(command2)
    .then((output) => {
      //console.log("good", output);
      client.end();
      res.send("good!");
      return;
    })
  })
  .then(() => {
    res.send("yayy");
  })
  .catch((err) => {
    console.log("nah", err.message);
    res.send("bad1287");
  });
});

router.post('/image', async(req, res) => {
  var client = new pg.Client(config);
  console.log("HI23412");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  output = fs.readFileSync('./Downloads/donkey.jpg');
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
    command2 = `UPDATE users SET photos = '${encoded}' WHERE username = 'olaf'`;
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

router.get('/byUser/:username', async(req, res) => {
  try{
    var client = new pg.Client(config);
    console.log("H234");
  
    client.connect()
    .catch((err) => {
      console.log(err);
      res.send("uh oh");
      return;
    });

    client.query(`SELECT * FROM users WHERE username = '${req.params.username}'`)
    .then((output) => {
      console.log("good");
      res.send(output.rows[0]);
    })
    .catch((err) => {
      throw err;
    });

  }catch(err){
    console.log(err.message);
    res.send("bad 19823");
  }
})

router.delete("/:username", async(req, res) => {
  try{
    var client = new pg.Client(config);
    console.log("HI");
  
    client.connect()
    .catch((err) => {
      console.log(err);
      res.send("uh oh");
      return;
    });

    client.query(`DELETE FROM users WHERE username = '${req.params.username}'`)
    .then((output) => {
      console.log("good");
      res.send(output.rows[0]);
    })
    .catch((err) => {
      throw err;
    });

  }catch(err){
    console.log(err.message);
    res.send("bad 19823");
  }
})

router.put('/:username', async(req, res) => {
  //possible fields: firstName, lastName, age, email, bio, feature, profilePic
  try{
    var client = new pg.Client(config);
    console.log("HI");
  
    client.connect()
    .catch((err) => {
      console.log(err);
      res.send("uh oh");
      return;
    });

    commandText = "";
    if (req.body['firstName']){
      commandText += `firstName = '${req.body['firstName']}',`
    }

    if(req.body['lastName']){
      commandText += `lastName = '${req.body['lastName']}',`
    }

    if(req.body['age']){
      commandText += `age = ${req.body['age']},`
    }

    if(req.body['email']){
      commandText += `email = '${req.body['email']}',`
    }

    if(req.body['bio']){
      commandText += `bio = '${req.body['bio']}',`
    }

    if(req.body['feature']){
      commandText += `feature = '${req.body['feature']}',`
    }

    if(req.body['galleryPics']){
      commandText += `galleryPics = '{${req.body['galleryPics'][0]}, ${req.body['galleryPics'][1]}, ${req.body['galleryPics'][2]}}',`
    }

    commandText = commandText.substring(0, commandText.length-1);

    client.query(`UPDATE users SET ` + commandText + ` WHERE username = '${req.params.username}'`)
    .then((output) => {
      console.log("good12");
      res.send(output.rows[0]);
    })
    .catch((err) => {
      throw err;
    });

  }catch(err){
    console.log(err.message);
    res.send("bad 19823");
  }
})

router.post('/fillCol', async(req, res) => {
  let info = req.body; //Need table, column, value
  var client = new pg.Client(config);
  console.log("HI2");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  client.query(`UPDATE ${info["table"]} SET ${info["column"]} = ${info["value"]}`)
  .then(() => {
    res.send("good");
  })
  .catch((err) => {
    console.log(err.message);
    res.send("bad23974");
  })
})

router.put('/', async(req, res) => { 
  //changing table stuff
  try{
    var client = new pg.Client(config);
    console.log("HI2");
  
    client.connect()
    .catch((err) => {
      console.log(err);
      res.send("uh oh");
      return;
    });
  
    //client.query("INSERT INTO users(firstname, lastname) VALUES ('userFirst', 'userLast')");
    //output = await client.query("SELECT * FROM users");

    //output = await client.query("ALTER TABLE users DROP COLUMN photos");

    //output = await client.query("ALTER TABLE users ADD COLUMN photos text");

    //output = await client.query("ALTER TABLE users ADD COLUMN userId ");

    //output = await client.query("UPDATE users SET username = 'testUsername' WHERE firstName = 'userFirst'");
    //output = await client.query("ALTER TABLE users ADD PRIMARY KEY (username)");
    //output = await client.query("ALTER TABLE users ALTER COLUMN username SET NOT NULL");
    //output = await client.query("ALTER TABLE questions ADD COLUMN username STRING REFERENCES users(username)");
    
    //output = await client.query("ALTER TABLE users ADD COLUMN eliminated BOOLEAN");

    //output = await client.query("ALTER TABLE users ADD COLUMN profilePic STRING");
    //output = await client.query("ALTER TABLE users ADD COLUMN galleryPics STRING[3]");

    //output = await client.query("UPDATE users SET gallerypics = '{string1, string2, string3}'")

    res.send("good123768");
  }catch(err){
    console.log(err.message, "bad123187");
    res.send("bad1824");
  }
});

router.get('/woot', async (req, res, next) => {
    var client = new pg.Client(config);
    client.connect();
    await client.query("ALTER TABLE users ADD COLUMN bio STRING, ADD COLUMN feature STRING");
    let output = await client.query("SELECT * FROM users");
    res.send(output);
});

router.post('/register', async (req, res, next) => {
    let input = req.body; //necessary input fields are firstname, lastname, email, password, username, phone
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

router.post('/eliminate', async(req, res) => {
  let info = req.body; //give eliminated username
  var client = new pg.Client(config);
  console.log("HI3");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  client.query(`UPDATE users SET eliminated = TRUE WHERE username = '${info["username"]}'`)
  .then(() => {
    res.send("good");
  })
  .catch((err) => {
    res.send("bad", err.message);
  })
})

router.post('/beginGroup', async(req, res) => {
  var client = new pg.Client(config);
  console.log("HI3");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  client.query(`CREATE TABLE questions (round INTEGER, question STRING, PRIMARY KEY (round))`)
  .then(client.query(`CREATE TABLE answers (round INTEGER REFERENCES questions (round), answer STRING, username STRING REFERENCES users (username))`))
  .then(() => {res.send("good")})
  .catch((err) => {
    console.log("bad192837", err.message);
    res.send("bad12387")
  })
  client.end();
});

router.get('/prevRounds', async(req, res) => {
  var client = new pg.Client(config);
  console.log("HI2alsdjfl;ksjdlkfj");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  client.query("SELECT * FROM questions")
  .then(async (questions) => {
    return [questions['rows'], await client.query("SELECT * FROM answers")]
  })
  .then(async ([questions, answers]) => {
    return [questions, answers['rows'], await client.query("SELECT * FROM users")]
  })
  .then(([questions, answers, users]) => {
    arr = [];
    roundNum = questions.length;
    questions.forEach((item, idx) => {      round = {}
      round['question'] = item;
      round['answers'] = idx;
    })
    res.send([questions, answers, users['rows']])
  })
  .catch((err) => {
    console.log("err", err.message);
    res.send("nah 23874");
  })
})

router.get('/column', async(req, res) => {
  let info = req.body; //Needs column, table
  var client = new pg.Client(config);
  console.log("HI2alsdjfl;ksjdlkfj");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  client.query(`SELECT ${info["column"]} FROM ${info["table"]}`)
  .then((info) => {
    console.log("good2", info);
    res.send(info);
  })
  .catch((err) => {
    console.log("err", err.message);
    res.send("bad2394");
  });
})

router.post('/question', async(req, res) => {
  let info = req.body; //Needs question and username
  var client = new pg.Client(config);
  console.log("HI4");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  client.query('SELECT count(*) FROM questions')
  .then((num) => {
    num = num.rows[0].count;
    return client.query(`INSERT INTO questions(round, question, username) VALUES (${num}, '${info["question"]}', '${info["username"]}')`)
  })
  .then(() => {
    res.send("good");
  })
  .catch((err) => {
    console.log(err.message, "bad");
    res.send("u oh8973");
  })
});

router.post('/answer', async(req, res) => {
  let info = req.body; //Needs answer, round, username
  var client = new pg.Client(config);
  console.log("HI4");

  client.connect()
  .catch((err) => {
    console.log(err);
    res.send("uh oh");
    return;
  });

  client.query(`INSERT INTO answers (round, answer, username) VALUES (${info["round"]}, '${info["answer"]}', '${info["username"]}')`)
  .then(() => {
    res.send("good");
  })
  .catch((err) => {
    console.log(err.message, "bad");
    res.send("u oh8973");
  });
})


router.get('/', async (req, res, next) => { //gets all info about user
  try{
    var client = new pg.Client(config);
    console.log("HI123");

    client.connect()
    .catch((err) => {
      console.log(err);
      res.send("uh oh");
      return;
    });

    client.query("SELECT * FROM users")
    .then((users) => {
      console.log("got users");
      res.send(users);
    })
  }catch(err){
    console.log("!!!", err);
    res.send("yikes")
  } 
});

module.exports = router;
