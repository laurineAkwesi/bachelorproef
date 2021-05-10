const express = require("express");
const app = express();
const bodyparser = require('body-parser')
const port = 63342;
const assert = require('assert');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next();
});

app.use(bodyparser.urlencoded({
    extended: false
}));

const username = "laurineAkwesi";
const password = "Laurine123";

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${username}:${password}@Struktr.u3qze.mongodb.net/bachelorproef?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let collection;

client.connect(err => {
    collection = client.db("bachelorproef").collection("userinfo");
    // perform actions on the collection object
    console.log('We are connected bitches');
    runProgram();
});


let runProgram = () => {
    /*collection.insertOne({
        "userId": Math.round(Math.random() * 100),
        "username": "laurineAK",
        "name": "laurine",
        "lastname": "akwesi",
        "email": "email"
    }), function (err, result) {
        assert.equal(err, null);
        console.log(err)
        console.log("inserted");
        console.log(result)
    }*/

    app.post('/api/newUser', (req, res) => {
        if (req.body.password != req.body.passwordCheck) {
            console.log("password is not correct")
        } else {
            let username = req.body.username;
            let name = req.body.name;
            let lastname = req.body.lastname;
            let password = req.body.password;
            let email = req.body.email;

                collection.insertOne({
                    "userId": Math.round(Math.random() * 100),
                    "username": username,
                    "name": name,
                    "lastname": lastname,
                    "password": password,
                    "email": email,
                    "savedObjects": [],
                    "ownTeam": []
                }, function (err, result) {
                    assert.equal(err, null);
                    console.log(err)
                    console.log("inserted");
                    console.log(result)
                })
        }
    })

    app.post('/api/video', (req, res) => {
            let username = req.body.username;
            let videoId = req.body.videoId;
            let comment = req.body.comment

            collection.insertOne({
                "commentId": Math.round(Math.random() * 100),
                "videoId": [{
                    "videoId": videoId,
                    "username": username,
                    "comment": comment
                }]
            }, function (err, result) {
                assert.equal(err, null);
                console.log(err)
                console.log("inserted");
                console.log(result)
            })
    })

    app.post('/api/login', function (req, data) {
        let username = req.body.username;
        let passwordLogin = req.body.password;
        console.log(passwordLogin)
        let mongoPass;
        console.log(mongoPass)

        //})
    })

    app.get('/api/getUserData/:id', (req, res) => {
        let userid = req.params.id
        //console.log(parseInt(userid)
        collection.find({
            userId: parseInt(userid)
        }).toArray(function (err, docs) {
            //console.log(docs)
            res.send(docs);
        });
    })


    app.get('/', (req, res) => {
        res.send('Hello Bitch!')
    });
};



app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

