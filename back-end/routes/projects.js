import { randomUUID } from 'node:crypto'
import express from 'express'
import projects from '../data/projects.js'
import { requireUser } from './auth.js'

const router = express.Router()

export function projectResponse({ ownerId, ...project }) {
    return project
}

router.get('/projects', requireUser, (req, res) => {
    res.json(projects.filter((project) => project.ownerId === req.user.id).map(projectResponse))
})

router.get('/projects/public',(req,res) => {
    const { search = '', sort = 'newest' } = req.query

    let publicProjects = projects.filter(
        (project) => project.visibility !== 'private'
    )

    if (typeof search === 'string' && search.trim()) {
        const searchTerm = search.trim().toLowerCase()

        publicProjects = publicProjects.filter((project) =>
            project.name.toLowerCase().includes(searchTerm) ||
            project.developer.toLowerCase().includes(searchTerm)
        )
    }

    if (sort === 'alphabetical') {
        publicProjects.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'oldest') {
        publicProjects.sort((a, b) => new Date(a.submitted) - new Date(b.submitted))
    } else {
        publicProjects.sort((a, b) => new Date(b.submitted) - new Date(a.submitted))
    }

    res.json(publicProjects.map(projectResponse))
})

router.post('/projects', requireUser, (req, res) => {
    const {name, developer, description = '', image = '', visibility = 'public'} = req.body ?? {}
    if(typeof name != 'string' ||!name.trim()){
        return res.status(400).json({error: 'Game name is required'})
    }
    if(typeof developer != 'string' ||!developer.trim()){
        return res.status(400).json({error: 'Developer name is required'})
    }
    if (typeof description != 'string'){
        return res.status(400).json({error: 'Description must be a string'})
    }
    if(!['public', 'private'].includes(visibility)){
        return res.status(400).json({error: 'Visibility must be either public or private'})
    }

    const project = {
        id: randomUUID(),
        ownerId: req.user.id,
        name: name.trim(),
        developer: developer.trim(),
        description: description.trim(),
        submitted: new Date().toLocaleDateString('en-US'),
        image,
        visibility,
    }
    projects.push(project)
    res.status(201).json(projectResponse(project))
})

export default router
