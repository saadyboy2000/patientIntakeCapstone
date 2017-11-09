const express = require('express');
const morgan = require('morgan');
//require('dotenv').config(); should i have this***
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');

const {
    DATABASE_URL,
    PORT
} = require('./config');
const {
    Forms
} = require('./model');


const app = express();





app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

//retrieve all forms from the database
app.get('/forms', (req, res) => {
    Forms
        .find()
        .then(forms => {
            res.json(forms);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went wrong'
            });
        })
});

//retrieve form by id
app.get('/forms/:id', (req, res) => {
    Forms
        .findById(req.params.id)
        .then(forms => res.json(forms))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went wrong'
            });
        });
});

//post new form
app.post('/forms/new', (req, res) => {
    console.log(req.body);
    //const requiredFields = ['doctor', 'specialty', 'age', 'id', 'questions'];
    /*for (let i = 0; i < requiredFields.lenth; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    } */

Forms
        .create({
            doctor: req.body.doctor,
            specialty: req.body.specialty,
            age: req.body.age,
            id: req.body.id,
            questions: req.body.questions,
        })
        .then(forms => res.status(201).json(forms))
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Something went wrong'
            });
        });
});

//update a form

app.put('/forms/:id', jsonParser, (req, res) => {

    const updated = {};
    const updateableFields = ['doctor', 'specialty', 'age', 'id', questions];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Forms
        .findByIdAndUpdate(req.params.id, {
            $set: updated
        }, {
            new: true
        })
        .then(updatedForm => res.status(204).end())
        .catch(err => res.status(500).json({
            message: 'Something went wrong'
        }));
});

//delete a form

app.delete('/forms/:id', (req, res) => {
    Forms
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({
                message: 'success'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Something went wrong'
            });
        });
})

app.use('*', function (req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});



let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                console.log("server is closed");
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
};

module.exports = {
    runServer,
    app,
    closeServer
};