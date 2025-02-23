// Start
const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;

const charmotions = express();

charmotions.use(bodyParser.urlencoded({
    extended: true
}));
charmotions.use(express.json());



// Variables
var usedIDs = [0];
var characters = [
    {
        id : "0",
        name : "Dummy",
        age : 0,

        emotions : {
            happy : 0.7,
            angry : 0.2,
            confused : 0.1,
            annoyed : 0.0
        },

        likings : {
            pizza : 1.0
        },

        keywords : {

            greeting : {
                happy : ["Hello, ", "Hi, "],
                angry : ["Hello, ", "Fuck you! "],
                confused : ["Hello, ", "Hi, "],
                annoyed : ["Hello, ", "Hi, "]
            },

            myName : {
                happy : ["my name is ", "I'm ", "I am "],
                angry : ["my name is ", "I'm ", "I am "],
                confused : ["my name is ", "I am "],
                annoyed : ["my name is "]
            },

            refuseContinue : {
                happy : [],
                angry : [],
                confused : [],
                annoyed : []
            },

            ILike : {
                happy : ["I like ", "I love "],
                angry : ["probably I like ", "should I like "],
                confused : ["I like "],
                annoyed : []
            }

        },

        messageStructure : {

            greeting : {
                happy : [
                    ["greeting", "myName", "characterName"]
                ],
                angry : [
                    ["greeting", "myName", "characterName"]
                ],
                confused : [
                    ["greeting", "myName", "characterName"]
                ],
                annoyed : [
                    ["greeting", "myName", "characterName"]
                ]
            },

            myName : {
                happy : [
                    ["myName", "characterName"]
                ],
                angry : [
                    ["myName", "characterName"]
                ],
                confused : [
                    ["myName", "characterName"]
                ],
                annoyed : [
                    ["myName", "characterName"]
                ]
            }

        }

    }
];


// Functions
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function getRandomWord(possibleWords) {
    return possibleWords[getRandomNumber(0, possibleWords.length)];
}

function getPossibleAnswer(possibleAnswer, message, characterFeeling, charId) {
    var genMessage = "";
    for (let i = 0; i < possibleAnswer.length; i++) {
        switch (possibleAnswer[i]) {
            case "greeting":
                genMessage = genMessage.concat(getRandomWord(characters[charId].keywords[message][characterFeeling]));
                break;
            case "myName":
                genMessage = genMessage.concat(getRandomWord(characters[charId].keywords.myName[characterFeeling]));
                break;
            case "characterName":
                genMessage = genMessage.concat(characters[charId].name);
                break;
        }
    }

    return genMessage;
}



// Requests
charmotions.get("/", (req, res) => {
    res.send("Welcome to Charmotions");
});

charmotions.post("/addCharacter", (req, res) => {
    const data = req.body;
    
    if (data.id && data.name && data.age) {
        if (usedIDs.includes(data.id)) {
            res.status(200).json({ message: "This ID is already in use", receivedData: data });
            return;
        }

        usedIDs.push(data.id);
        characters.push([data.id, data.name, data.age]);
        res.status(200).json({ message: 'Data received successfully', receivedData: data });
    } else {
        res.status(200).json({ message: "The data isn't complete", receivedData: data });
    }
});

charmotions.get("/characters", (req, res) => {
    if (characters.length == 0) {
        res.send({message: "The list of characters is empty, please send a request to localhost:3000/addCharacter"});
    } else {
        res.send(characters);
    }
});

charmotions.get("/sendMessage", (req, res) => {
    var body = req.body;
    var charId = body.id;
    var message = body.message;

    var characterFeeling = "happy";
    if (getRandomNumber(0, 100) < characters[charId].emotions.happy * 100) {
        characterFeeling = "happy";
    }
    else if (getRandomNumber(0, 100) < characters[charId].emotions.angry * 100) {
        characterFeeling = "angry";
    }
    else if (getRandomNumber(0, 100) < characters[charId].emotions.confused * 100) {
        characterFeeling = "confused";
    }
    else if (getRandomNumber(0, 100) < characters[charId].emotions.annoyed * 100) {
        characterFeeling = "annoyed";
    }

    var genMessage = "";
    var possibleAnswer = getRandomWord(characters[charId].messageStructure[message][characterFeeling]);
    genMessage = getPossibleAnswer(possibleAnswer, message, characterFeeling, charId);

    res.send(genMessage);
})


charmotions.listen(port, () => console.log("Charmotions running on port " + port));