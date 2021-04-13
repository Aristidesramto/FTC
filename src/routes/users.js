const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')

router.get('/users/signin',(req,res)=>{
    res.render('users/signin')
})

router.post('/users/signin',passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.get('/users/signup',(req, res) => {
    res.render('users/signup')
})

router.post('/users/signup', async (req, res) => {
    const { name,email, password, confirm_password } = req.body
    const errors = []
    if (password !== confirm_password){
        errors.push({text: 'Las contraseñas no coinciden'})
    }
    if (password.length < 4){
        errors.push({text: 'La contraseña debe ser mayor a 4 caracteres'})
    }
    if(errors.length > 0){
        res.render('users/signup',{errors,name,email,password,confirm_password})
    } else {
        const emailUser = await User.findOne({email:email})
        if(emailUser){
            req.flash('error_msg','El email introducido ya esta registrado')
            res.redirect('/users/signup')
        }
        const newUser = new User({name,email,password})
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg','Se ha registrado con éxito')
        res.redirect('/users/signin')
    }
})

module.exports = router