const express = require('express');
const app = new express();
require('dotenv').config();

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance() {
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2022-04-07',
        authenticator: new IamAuthenticator({
          apikey: process.env.API_KEY,
        }),
        serviceUrl: process.env.API_URL,
      });

    return naturalLanguageUnderstanding;
}


//The default endpoint for the webserver
app.get("/",(req,res)=>{
    res.render('index.html');
  });

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", (req,res) => {
    const urlToAnalyze = req.query.url
    const analyzeParams = 
        {
            "url": urlToAnalyze,
            "features": {
                "keywords": {
                                "emotion": true,
                                "limit": 1
                            }
            }
        };
     
     const naturalLanguageUnderstanding = getNLUInstance();
     
     naturalLanguageUnderstanding.analyze(analyzeParams)
     .then(analysisResults => {
        //Please refer to the image to see the order of retrieval
        return res.send(analysisResults.result.keywords[0].emotion,null,2);
     })
     .catch(err => {
     return res.send("Could not do desired operation "+err);
     });
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", (req,res) => {
    const urlToAnalyze = req.query.url;
    const analyzeParams = {
        "url": urlToAnalyze,
        "features": {
            "keywords": {
                "sentiment": true,
                "limit": 1
            }
        }
    };

    const naturalLanguageUnderstanding = getNLUInstance();
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => res.send(analysisResults.result.keywords[0].sentiment,null,2))
    .catch(err => res.send(`Could not do desired operation ${err}`));
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", (req,res) => {
    const textToAnalyze = req.query.text;
    const analyzeParams = {
        "text": textToAnalyze,
        "features": {
            "keywords": {
                "emotion": true,
                "limit": 1
            }
        }
    };

    const naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => res.send(analysisResults.result.keywords[0].emotion,null,2))
    .catch(err => res.send(`Could not do desired operation ${err}`))
    
});

app.get("/text/sentiment", (req,res) => {
    const textToAnalyze = req.query.text;
    const analyzeParams = {
        "text": textToAnalyze,
        "features": {
            "keywords": {
                "sentiment": true,
                "limit": 1
            }
        }
    };

    const naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => res.send(analysisResults.result.keywords[0].sentiment,null,2))
    .catch(err => res.send(`Could not perform desired operation ${err}`))
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

