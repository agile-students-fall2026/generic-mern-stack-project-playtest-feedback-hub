import express from 'express'
import projects from '../data/projects.js'

const router = express.Router()

router.get('/projects',(req,res)=>{
    res.json(projects)
})

router.post('/projects',(req,res)=>{
    const {name, developer, description = '', image = ''} = req.body ?? {}
    if(typeof name != 'string' ||!name.trim()){
        return res.status(400).json({errror: 'Game name is required'})
    }
    if(typeof developer != 'string' ||!developer.trim()){
        return res.status(400).json({errror: 'Developer name is required'})
    }

    const project = {
        id: String(Data.now()),
        name: name.trim(),
        developer: developer.trim(),
        description: description.trim(),
        submitted: new Data().toLocaleDateString('en-US'),
        image,
    }
    projects.push(project)
    res.status(201).json(project)
})

export default router