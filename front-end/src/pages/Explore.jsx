import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import './Explore.css'
import projects from '../../../back-end/data/projects.js'

function Explore() {
    const [projects, setProjects] = useState([])
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('newest')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        setError('')

        const params = new URLSearchParams({
            search,
            sort,
        })

        fetch(`/api/projects/public?search=${params.toString()}`)
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Failed to load projects (waiting for MongoDB connection).')
                }

                return response.json()
            })
            .then((data) => {
                setProjects(data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [search, sort])

    return (
        <div className="explore-page">
            <Header />
            <main className="explore-main">
                <Link className="explore-back" onClick={() => navigate(-1)}>‹ Back</Link>
                
                <div className="explore-heading">
                    <h1>Explore</h1>
                    <p>Explore public projects by other developers.</p>
                </div>

                <div className="explore-controls">
                    <input
                        type="search"
                        className="explore-search"
                        placeholder="Search for a game or developer"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <label className="explore-sort">
                        <select value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>
                    </label>
                </div>

                <div className="explore-results">
                    {loading && <p className="explore-message">Loading projects...</p>}
                    
                    {error && <p className="explore-error">{error}</p>}

                    {!loading && !error && projects.length === 0 && (
                        <div className="explore-empty">
                            <h2>No projects found.</h2>
                        </div>
                    )}

                    {!loading && !error && (
                        <p className="explore-count">
                            {projects.length}{''} 
                            {projects.length === 1 ? 'project' : 'projects'} found
                        </p>
                    )}

                    {!loading && !error && projects.length > 0 && (
                        <ul className="explore-project-list">
                            {projects.map((project) => (
                                <li key={project.id} className="explore-project-card">
                                    <div className="explore-project-image">
                                        {project.image ? (
                                            <img src={project.image} alt={`${project.name} icon`} />
                                        ) : (
                                            <div className="explore-project-image-placeholder">
                                                👾
                                            </div>
                                        )}
                                    </div>
                                    <div className="explore-project-info">
                                        <h2>{project.name}</h2>
                                        <p className="explore-developer">by {project.developer}</p>
                                        <p className="explore-submitted">submitted {project.submitted}</p>
                                        <Link className="explore-view-project" to={`/projects/${project.id}/feedback`}>View Project</Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
            <BottomNav />
        </div>
    )
}

export default Explore