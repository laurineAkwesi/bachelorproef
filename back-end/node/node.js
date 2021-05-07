const express = require('express');
const app = express();
const port = 63342;
const assert = require('assert');

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
};


app.get('/', (req, res) => {
    res.send('Hello Bitch!')
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

