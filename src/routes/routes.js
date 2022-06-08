const router = require('express').Router();

//Routes
router.get('/', (req,res) =>{
    res.render('index')
})

router.get('/Configuracion', (req,res) =>{
    res.render('Config');
})

router.get('/Partidos', (req,res) =>{
    res.render('Partidos');
})

router.get('/Programacion', (req,res) =>{
    res.render('Programacion');
})

router.post('/upload', (req,res) =>{

})

router.get('/Resultado/:IDGame', (req,res) =>{
    res.render('Resultado');
})

router.get('/Progreso/:IDGame', (req,res) =>{
    res.render('Progreso');
})

router.get('/Narrar/:IDGame', (req,res) =>{
    res.render('Narrar');
})

router.get('/Selected/Programacion/:IDGame', (req,res) =>{
    res.render('ProgramacionMod');
})


const connection = require('../../database/db.js');
module.exports = router;