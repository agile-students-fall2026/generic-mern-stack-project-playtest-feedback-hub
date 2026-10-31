import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import { getProjects } from '../mocks/projects.js'
import './MyProjects.css'

function MyProjects() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getProjects().then(setProjects)
  }, [])

  return (
    <div className="projects-page">
      <Header />
      <main className="projects-main">
        <Link className="projects-back" to="/developer">‹ Back</Link>
        <h1>My Projects</h1>
        <ul className="project-list">
          {projects.map((project) => (
           <li className="project-card" key={project.id}>
           <span className="project-icon" aria-hidden="true">
             <svg viewBox="0 0 100 100">
               <rect x="4" y="4" width="92" height="92" rx="16" fill="none" stroke="currentColor" strokeWidth="3" />
               <path d="M18 18 L82 82 M82 18 L18 82" fill="none" stroke="currentColor" strokeWidth="3" />
             </svg>
           </span>
           <div>
             <h2>Game Name</h2>
             <p>by Developer</p>
             <p>submitted 01/01/2001</p>
           </div>
           <Link className="project-qr" to={`/projects/${project.id}/qr`}>
             <svg viewBox="0 0 100 100" aria-hidden="true">
               <rect x="8" y="8" width="84" height="84" rx="14" fill="none" stroke="currentColor" strokeWidth="4" />
               <path d="M22 22 L78 78 M78 22 L22 78" fill="none" stroke="currentColor" strokeWidth="4" />
             </svg>
             QR Code
           </Link>
         </li>
          ))}
        </ul>
        <Link className="add-project" to="/projects/new">Add Project</Link>
      </main>
      <BottomNav />
    </div>
  )
}

export default MyProjects