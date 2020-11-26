
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


let characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"


// map to store key and long urlencoded
// ideally store in db
let map = {}

getRandom = () => {
    let key = ""
    for (i = 0; i < 6; i++) {
        let rand = Math.floor(Math.random() * Math.floor(62))
        key = key + characters[rand];
    }
    return key
}


// create a GET route
app.get(/^\/[A-Za-z0-9]{6}\/?$/i, (request, response) => {
    let url = request.originalUrl
    let key = url.slice(1,7)
    if (map[key] != undefined){
        response.redirect(301, map[key])
    }else{
        response.sendStatus(404)
    }
});

app.post('/shorten', (request, response) => {
    let fullUrl = request.body.fullUrl
    let key = getRandom()
    while (map[key] != undefined) {
        key = getRandom()
    }
    map[key] = fullUrl
    response.send({ url: 'http://localhost:5000/'+key });
});
