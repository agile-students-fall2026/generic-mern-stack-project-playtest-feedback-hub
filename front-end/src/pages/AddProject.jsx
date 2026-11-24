import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BottomNav from '../components/BottomNav.jsx'
import './AddProject.css'

function AddProject() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [developer, setDeveloper] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [visibility, setVisibility] = useState('public')

  function handleSubmit(event) 
  {
    event.preventDefault()
    if (name.trim() === '' || developer.trim() === '') {
      setError('Game Name and Developer are required.')
      return
    }
   const iconSeed = encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, '-'))
   fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.trim(),
      developer: developer.trim(),
      description: description.trim(),
      visibility,
      image: `https://picsum.photos/seed/${iconSeed}/88/88`,
    }),
  })
  .then(async (response) => {
    const body = await response.json()
    if (!response.ok) throw new Error(body.error || 'Could not add project.')
    navigate('/projects')
  })
  .catch((err) => setError(err.message))
  }

  return (
    <div className="add-page">
      <Header />
      <main className="add-main">
        <form onSubmit={handleSubmit}>
        <button type="button" className="change-icon">
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <rect x="4" y="4" width="92" height="92" rx="16" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M18 18 L82 82 M82 18 L18 82" fill="none" stroke="currentColor" strokeWidth="3" />
  </svg>
  Change Icon
</button>
          <label>
            Game Name*
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="What is your project called?"
            />
          </label>
          <label>
            Developer*
            <input
              value={developer}
              onChange={(event) => setDeveloper(event.target.value)}
              placeholder="Who made this game?"
            />
          </label>
          <label>
            Description (optional)
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write a short description about your game..."
            />
          </label>
          <label>
            Visibility
            <select value={visibility} onChange={(event) => setVisibility(event.target.value)}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>
          {error !== '' && <p className="add-error">{error}</p>}
          <button type="submit" className="add-submit">Add</button>
        </form>
      </main>
    </div>
  )
}

export default AddProject