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
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')

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
    //const iconSeed = encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, '-'))
    try {
      const body = new FormData()
      body.append('name', name.trim())
      body.append('developer', developer.trim())
      body.append('description', description.trim())
      body.append('visibility', visibility)
      if (file) body.append('image', file)
      const response = await fetch('/api/projects', {
        method: 'POST',
        body,
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
        <form onSubmit={handleSubmit}>
          <label className="change-icon">
            {preview ? (
              <img src={preview} alt="" />
            ) : (
              <div className="change-icon-placeholder"></div>
            )}
            Choose Image
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              onChange={(event) => {
                const picked = event.target.files?.[0]
                if (!picked) return
                setFile(picked)
                setPreview(URL.createObjectURL(picked))
              }}
            />
          </label>
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
    </div>
  )
}

export default AddProject
