const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let users = [];

function validateRegisterParams(req, res, next) {
    const { name, lastname, email, password } = req.body;
    if (name && lastname && email && password) {
        next();
    } else {
        res.status(400).json({ error: "invalidate params" });
    }
}

function validateUserEmail(req, res, next) {
    const email = req.params.email;
    let index = users.findIndex(el => el.email == email);
    req.body.index = index;
    if (index == -1) {
        res.status(404).json({ error: 'user not found' });
    } else {
        next();
    }
}

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/register', validateRegisterParams, (req, res) => {
    users.push({ id: (users.length + 1), ...req.body });
    res.json({ msg: 'user added' });
});

app.patch('/editUser/:email', validateUserEmail, (req, res) => {
    let index = req.body.index;
    users[index].name = req.body.name;
    users[index].lastname = req.body.lastname;
    users[index].password = req.body.password;
    users[index].isAutenticated = req.body.isAutenticated;

    res.json({ msg: 'user updated' });
});

app.listen(3000, () => {
    console.log("server on port ", 3000);
});