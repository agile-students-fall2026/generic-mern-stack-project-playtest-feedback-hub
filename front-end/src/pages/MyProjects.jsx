import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
//import { getProjects } from '../mocks/projects.js'
import './MyProjects.css'

function MyProjects() {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/projects')
      .then((response) => response.json())
      .then(setProjects)
  }, [])

  return (
    <div className="projects-page">
      <Header />
      <main className="projects-main">
        
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
           <Link className="project-feedback-link" to={`/projects/${project.id}/feedback`}>
             <h2>{project.name}</h2>
             <p>by {project.developer}</p>
             <p>submitted {project.submitted}</p>
           </Link>
           <Link className="project-qr" to={`/projects/${project.id}/qr`}>
           <QRCodeSVG
           value={`${window.location.origin}/feedback?game=${project.id}`}
           size={64}
           />
           </Link>
         </li>
          ))}
        </ul>
        <Link className="add-project" to="/projects/new">Add Project</Link>
      </main>
      
    </div>
  )
}

export default MyProjects