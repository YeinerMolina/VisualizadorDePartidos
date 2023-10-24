const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');

const app = express();
app.set('views', path.join(__dirname, 'views'))
app.engine('html',  require('ejs').renderFile);
app.set('view engine', 'html');
dotenv.config({path:'./env/.env'});
const server = http.createServer(app);

//routes 
app.use(require('./routes/routes.js'));

//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')))

//Inicial servidor 
const PORT = 3000; 
server.listen(PORT, ()=>{
    console.log('Server on http://localhost:'+PORT);
})

