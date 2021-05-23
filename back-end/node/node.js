const express = require("express");
const app = express();
const path = require('path')
const bodyparser = require('body-parser')
const port = 63342;
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next();
});

app.use(bodyparser.urlencoded({
    extended: false
}));

app.use(bodyparser.json());

const username = "laurineAkwesi";
const password = "Laurine123";

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${username}:${password}@Struktr.u3qze.mongodb.net/bachelorproef?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let collection;
let videoCollection

client.connect(err => {
    collection = client.db("bachelorproef").collection("userinfo");
    videoCollection = client.db("bachelorproef").collection("video");
    // perform actions on the collection object
    console.log('We are connected bitches');
    runProgram();
});


let runProgram = () => {
    console.log("program is running")

    app.get('/', (req, res) => {
        res.send('Hello Bitch!')
        //res.sendFile(path.join(__dirname, 'html/home.html'))
        //console.log(__dirname)
    });
    app.get("/getUser/:id", (req, res) => {
        let userid = req.params.id
        //console.log(parseInt(userid)
        collection.find({
            userId: parseInt(userid)
        }).toArray(function (err, docs) {
            //console.log(docs)
            res.send(docs);
        });
    });

    app.put('/UpdateData/:userid', (req, res) => {
        //console.log(req.params.userid)
        let userid = req.params.userid
        //console.log('get update data')
        //console.log(req.body.name)
        collection.updateOne({
            userId: parseInt(userid)
        }, {
            $set: {
                "username": req.body.username,
                "name": req.body.name,
                "lastname": req.body.lastname,
                "email": req.body.email
            },
        }, function (err, result) {
            //console.log(err)
            res.send(result)
        })
    })


    app.post("/postNewUser", (req, res) => {
        if (req.body.password != req.body.passwordCheck) {
            console.log("password is not correct")
        } else {
            let username = req.body.username;
            let name = req.body.name;
            let lastname = req.body.lastname;
            let password = req.body.password;
            let email = req.body.email;

            bcrypt.hash(password, saltRounds, function (err, hash) {
                collection.insertOne({
                    "userId": Math.round(Math.random() * 100),
                    "username": username,
                    "name": name,
                    "lastname": lastname,
                    "password": hash,
                    //"password": password,
                    "email": email,
                    "dagboek": []
                }, function (err, result) {
                    assert.equal(err, null);
                    console.log(err)
                    console.log("inserted");
                    //console.log(result)
                })
            });
        }
    });
    app.post('/dagboek/:userid', (req, res) => {
        let id = req.params.id
        let verhaal = req.body.verhaal
        let titel = req.body.titel
        let userid = req.params.userid
        collection.findOneAndUpdate({
                userId: parseInt(userid)
            }, {
                $push: {
                    "dagboek": {
                        "verhaalId": Math.round(Math.random() * 100),
                        "titel": titel,
                        "verhaal": verhaal
                    }
                }
            },
            function (error, docs) {
                console.log("succes")
                res.send(docs);
            });
    });

    app.get("/userDagboek/:id", (req, res) => {
        let userid = req.params.id
        //console.log(parseInt(userid)
        collection.find({
            userId: parseInt(userid)
        }).toArray(function (err, docs) {
            //console.log(docs)
            res.send(docs);
        });
    });

    app.post('/login', function (req, data) {
        //console.log("login triggerds")
        let username = req.body.username;
        let passwordLogin = req.body.password;
        //console.log(passwordLogin)
        let mongoPass;
        //console.log(mongoPass)

        collection.find({
            "username": username
        }).toArray(function (err, result) {
            result.forEach(function (item) {
                mongoPass = item.password;
            })
            bcrypt.compare(passwordLogin, mongoPass, function (err, res) {
                //console.log(mongoPass)
                //console.log(res)
                if (res === true) {
                    //console.log("logged in")
                    data.send(result)
                    //data.send(true)
                } else {
                    //console.log("wrong password")
                    data.send(false)
                }
            })
        })
    })


    app.post('/postVideoComments/:videoid', (req, res) => {
        let username = req.body.username;
        let videoId = req.params.videoid;
        let comment = req.body.comment;
        let userId = req.body.userId;
        //console.log(username, videoId, comment, userId)
        videoCollection.findOneAndUpdate({
            frontendVideoId: parseInt(videoId)
            }, {
                $push: {
                    "comment": {
                        "username": username,
                        "userId": userId,
                        "commentId": Math.round(Math.random() * 100),
                        "comment": comment
                    }
                }
            },
            function (error, docs) {
                //console.log(error)
                res.send(docs);
            });
    })

    app.get('/videoComments/:videoid', (req, res) => {
        //new collection! video
        let videoId = req.params.videoid;
        //console.log(parseInt(videoId))
        videoCollection.find({
            frontendVideoId: parseInt(videoId)
        }).toArray(function (err, docs) {
            //console.log(docs)
            res.send(docs);
        });
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
};



app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});