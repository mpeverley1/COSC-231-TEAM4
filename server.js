const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));


const config = {
    host: 'localhost',
    port: 3306,
    user: 'username',
    password: 'passwords',
    database: 'userInfo'
};

const db = mysql.createPool(config);

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'pages/project/Signup.html'));
});

app.post('/register', async(req, res) => {
    const {username, firstName, lastName, password} = req.body;
    if (!username || !password || !firstName || !lastName) {
        return res.status(400).send('Missing required fields');
    }
    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
        INSERT INTO users (username, firstName, lastName, passwordHash) VALUES (?, ?, ?, ?)`;

        await db.query(sql, [username, firstName, lastName, hashedPassword]);
        return res.status(200).send('successfully registered');

    }catch(err){
        console.log(err);
        return res.status(500).send('Database Error');
    }

    app.listen(3000, ()=>{
        console.log('Server started on port 3306');
    })

})