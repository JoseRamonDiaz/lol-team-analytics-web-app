const express = require('express');
const os = require('os');
const port = 8081;
const summonersApi = require('./summoners');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data


const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.get('/api/hostname', (req, resp) => {
    resp.send({ hostname: os.hostname() });
});

app.post('/api/summoners/stats', upload.array(), (req, resp) => {
    console.log(req.body.summoners);
    summonersApi.getSummoners(req.body.summoners).then((summonersArray) => {
        resp.json(summonersArray);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));