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
  const [pending, setPending] = useState(false)
  const [signedOut, setSignedOut] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (pending) return
    if (name.trim() === '' || developer.trim() === '') {
      setError('Game Name and Developer are required.')
      return
    }
    setPending(true)
    setSignedOut(false)
    setError('')
    const iconSeed = encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, '-'))
    try {
      const response = await fetch('/api/projects', {
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
      if (!response.ok) {
        setSignedOut(response.status === 401)
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Could not add project.')
      }
      navigate('/projects')
    } catch (error) {
      setError(error.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="add-page">
      <Header />
      <main className="add-main">
        <Link className="add-back" onClick={() => navigate(-1)}>‹ Back</Link>
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
              <option value="private">Private (link only)</option>
            </select>
          </label>
          {error && <p className="add-error" role="alert">{error} {signedOut && <Link to="/signin">Sign in</Link>}</p>}
          <button type="submit" className="add-submit" disabled={pending}>{pending ? 'Adding…' : 'Add'}</button>
        </form>
      </main>
      <BottomNav />
    </div>
  )
}

export default AddProject
