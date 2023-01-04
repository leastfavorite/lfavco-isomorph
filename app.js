const express = require('express');
const app = express();

const fs = require('fs');
let peeked = JSON.parse(fs.readFileSync('peeked.json', 'utf8'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => { res.render('index'); });
app.get('/chat', (req, res) => { res.render('chat'); });

app.use('/resources', express.static('resources'));
app.get('/resources/*', (req, res) => { res.status(404).send(""); }); 

// redirect to random song
app.use('/i-peeked-at-the-html', (req, res) => {
    res.redirect(303, peeked[Math.floor(Math.random() * peeked.length)]);
});

// not found -> redirect home
app.get('*', (req, res) => { res.redirect(303, '/'); });

app.listen(process.env.PORT || 8080);
