const router = require('express').Router();

//Routes
router.get('/', (_req,res) =>{
    res.render('index')
})

router.get('/cotiza', (_req,res) =>{
    res.render('cotiza');
})

router.get('/iniciosesion', (_req,res) =>{
    res.render('iniciosesion');
})

router.get('/nosotros', (_req,res) =>{
    res.render('nosotros');
})

router.get('/plataforma', (_req,res) =>{
    res.render('plataforma');
})

router.get('/programarrecogida', (_req,res) =>{
    res.render('programarrecogida');
})

router.get('/registro', (_req,res) =>{
    res.render('registro');
})

module.exports = router;