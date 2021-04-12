const express = require('express')
const router = express.Router()

const Note = require('../models/Note')

router.get('/notes/add',(req, res) => {
    res.render('notes/new-notes')
})

router.post('/notes/new-notes', async (req, res) => {
    const {title, descripcion} = req.body
    const errors = []
    if (!title){
        errors.push({text: 'Por favor, inserte un titulo.'})
    }
    if (!descripcion){
        errors.push({text: 'Por favor, inserte una descripcion.'})
    }
    if(errors.length > 0 ){
        res.render('notes/new-notes',{
            errors,
            title,
            descripcion
        })
    }else{
        const newNote = new Note({title, descripcion});
        await newNote.save()
        req.flash('success_msg','La nota se ha creado con éxito')
        res.redirect('/notes')
    }
})

router.get('/notes', async (req, res) => {
    const notes = await Note.find().sort({date:'desc'})
            res.render('notes/all-notes', { notes })
})

router.get('/notes/edit/:id',  async (req, res) => {
    const note = await Note.findById(req.params.id)
        res.render('notes/edit-note', {note})
})

router.put('/notes/edit-note/:id', async(req, res) => {
    const {title,descripcion }=req.body
    await Note.findByIdAndUpdate(req.params.id,{title,descripcion})
    req.flash('success_msg','La nota se ha editado con éxito')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id',async (req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg','La nota se ha eliminado con éxito')
    res.redirect('/notes')
})

module.exports = router