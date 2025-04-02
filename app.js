const express = require('express');
const app = express();
const port = 3001;
app.use(express.static('public'));
const myRepository = require('./myRepository');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.json()); // Enable JSON parsing
// By crypt 
const bcrypt = require('bcrypt');
const send = require('send');
const { hash } = require('crypto');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const { log } = require('console');
app.use(cookieparser('secret'));
require('dotenv').config();
// Middleware 

const authnticationToken = (async (req, res, next) => {
    const authHeader = req.headers.autorization;
    try {
        const check = await jwt.verify(authHeader, process.env.JWT_SECRET);
        if (check) {
            console.log('Check', check);

        }

    } catch (err) {
        console.log('Error', err);
    }



    next();
});


app.get('/hello', (req, res) => {
    res.send({ "hello": "Haim Huber" });
});

app.post('/signup', async (req, res) => {
    const { userName, password } = req.body; // creating to variables named: userName, password
    if (!userName || !password) {
        console.log("All fields are required");
        return;
    }
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const result = await myRepository.addNewUser(userName, hashedPassword);
        if (result === 'RequestError') {
            return res.status(400).send(`Bad request - User must be unique`);
        } else if (result.rowsAffected[0] === 1) {
            console.log(`User: ${userName} has inserted successfully`);
            return res.status(200).send(`User: ${userName} has inserted successfully`);
        }
        return send.status(404).send("Bad request");
    } catch (error) {
        console.log(error);

    }
});

app.post('/signin', async (req, res) => {
    const { userName, password } = req.body;
    if (!userName && !password) {
        console.log("All fields are required");
        return;
    }
    try {
        const result = await myRepository.getUserByUserName(userName);
        if (result.id > 0) {
            const enctypedPassword = await bcrypt.compare(password, result.password);
            if (enctypedPassword) {
                const token = jwt.sign({ username: userName }, process.env.JWT_SECRET, { expiresIn: '1s' });
                res.cookie("token", token);
                console.log(token);

                return res.status(200).send(`Welocome back: ${userName}`);
            } else {
                return res.status(404).send(`User name or password are wrong`);
            }
        } else {
            return res.status(400).send(`User name or password are wrong`);
        }
    } catch (error) {
        console.log(error);

    }
});


app.get('/protected', authnticationToken, (req, res) => {
    res.json({ msg: "Hello From protected" });
})

app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`);

})
