import express from 'express'
import projects from '../data/projects.js'

const router = express.Router()

router.get('/projects',(req,res)=>{
    res.json(projects)
})

router.post('/projects',(req,res)=>{
    const {name, developer, description = '', image = '', visibility = 'public'} = req.body ?? {}
    if(typeof name != 'string' ||!name.trim()){
        return res.status(400).json({errror: 'Game name is required'})
    }
    if(typeof developer != 'string' ||!developer.trim()){
        return res.status(400).json({errror: 'Developer name is required'})
    }
    if (typeof description != 'string'){
        return res.status(400).json({error: 'Description must be a string'})
    }
    if(!['public', 'private'].includes(visibility)){
        return res.status(400).json({error: 'Visibility must be either public or private'})
    }

    const project = {
        id: String(Date.now()),
        name: name.trim(),
        developer: developer.trim(),
        description: description.trim(),
        submitted: new Date().toLocaleDateString('en-US'),
        image,
        visibility,
    }
    projects.push(project)
    res.status(201).json(project)
})

export default router