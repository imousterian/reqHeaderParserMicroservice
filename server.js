const express = require('express');
const port = process.env.PORT || 8080;
const threadRouter = express.Router();
const path = require('path');

class Server {
    constructor() {
        this.app = express();
        this.port = port;

        this.app.use((req, res, next) => {
            const regExp = /\(([^)]+)\)/;
            req.software = regExp.exec(req.headers['user-agent'])[1];
            req.language = req.headers['accept-language'].split(",")[0];
            req.ipaddress = req.ip.split(':')[3];
            next();
        });

        this.app.get('/', (req,res) => {
            res.sendFile(path.join(__dirname + '/index.html'));
        });
        
        this.app.get('/api/whoami', (req,res) => {
            res.send({
                ipaddress: req.ipaddress,
                language: req.language,
                software: req.software
            });
        });

        this.app.get('*', (req, res) => {
            res.redirect('/api/whoami');
        })

        this.app.use(function(req, res){
            res.send(404);
        });

        this.app.listen(this.port, () => {
            console.log("Server listening at localhost:" + this.port);
        });
    }
}

const server = new Server();
