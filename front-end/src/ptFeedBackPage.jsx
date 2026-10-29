import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import { getGame, submitFeedback } from './services/feedbackApi.js'
import './ptFeedBackPage.css'

function FeedBackPage() {
    const [params] = useSearchParams()
    const gameId = params.get('game') || 'demo'
    const [game, setGame] = useState(null)
    const [error, setError] = useState('')
    const [files, setFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [urls, setUrls] = useState([])
    const [url, setUrl] = useState('')
    const [busy, setBusy] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        let active = true
        setGame(null)
        setError('')
        getGame(gameId).then(data => {
            if (active) setGame(data)
        }).catch(err => {
            if (active) setError(err.message)
        })
        return () => { active = false }
    }, [gameId])

    useEffect(() => {
        const items = files.map(file => ({ name: file.name, url: URL.createObjectURL(file) }))
        setPreviews(items)
        return () => items.forEach(item => URL.revokeObjectURL(item.url))
    }, [files])

    function addUrl() {
        try {
            const parsed = new URL(url)
            if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error()
            setUrls(previous => [...previous, parsed.href])
            setUrl('')
            setError('')
        } catch {
            setError('Enter a valid http or https image link.')
        }
    }

    async function handleSubmit(event) {
        event.preventDefault()
        if (busy || !game) return
        const values = new FormData(event.currentTarget)
        const feedback = values.get('feedback').trim()
        if (!feedback) { setError('Please write your feedback.'); return }
        if (url.trim()) { setError('Add or clear the image link before submitting.'); return }
        setBusy(true)
        setError('')
        try {
            await submitFeedback({
                gameId: game.id,
                gameName: game.name,
                developer: game.developer,
                category: values.get('category'),
                feedback,
                anonymous: values.get('anonymous') === 'on',
                imageNames: files.map(file => file.name),
                imageUrls: urls,
            })
            navigate('/feedback/success')
        } catch {
            setError('Could not save this demo in your browser. Please try again.')
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="feedback-shell">
            <Header />
            <main className="feedback-page">
                <Link to="/scan">‹ Back</Link>
                <header className="feedback-game">
                    <p className="feedback-game-label">Playtest Feedback for</p>
                    <h1 className="feedback-game-title">{game?.name || 'Loading game…'}</h1>
                    <p className="feedback-game-developer">{game && `by ${game.developer}`}</p>
                </header>
                <p className="feedback-demo-note">Demo: submissions stay in this browser. Images are previewed only; their filenames are saved.</p>
                {error && <p role="alert">{error}</p>}
                <form className="feedback-form" onSubmit={handleSubmit}>
                    <div className="feedback-field">
                        <label className="feedback-label" htmlFor="category">Feedback Category*</label>
                        <select className="feedback-select" id="category" name="category" required defaultValue="">
                            <option value="" disabled>Please select a category</option>
                            <option value="bugs">Bugs</option>
                            <option value="gameplay">Gameplay</option>
                            <option value="art">Art</option>
                            <option value="audio">Audio</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="feedback-field">
                        <label className="feedback-label" htmlFor="feedback">Feedback*</label>
                        <textarea className="feedback-textarea" id="feedback" name="feedback" required rows={5} placeholder="Write your feedback here…" />
                    </div>
                    <div className="feedback-field">
                        <label className="feedback-label" htmlFor="images">Add images (optional)</label>
                        <input id="images" type="file" accept="image/*" multiple onChange={event => {
                            const selected = Array.from(event.target.files)
                            if (selected.some(file => !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024)) {
                                setError('Choose images smaller than 5 MB each.')
                                event.target.value = ''
                                return
                            }
                            setFiles(selected)
                            setError('')
                        }} />
                        {previews.map((item, index) => (
                            <div className="feedback-image" key={item.url}>
                                <img src={item.url} alt={`Attachment: ${item.name}`} />
                                <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== index))}>Remove {item.name}</button>
                            </div>
                        ))}
                        <label htmlFor="image-url">Image URL</label>
                        <input className="feedback-select" id="image-url" type="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="https://…" />
                        <button className="feedback-button" type="button" onClick={addUrl}>Add URL</button>
                        {urls.map((item, index) => (
                            <div className="feedback-url" key={`${item}-${index}`}>
                                <a href={item} target="_blank" rel="noreferrer">{item}</a>
                                <button type="button" onClick={() => setUrls(urls.filter((_, i) => i !== index))}>Remove link</button>
                            </div>
                        ))}
                    </div>
                    <label className="feedback-anonymous">
                        <input type="checkbox" name="anonymous" />
                        Check this box if you would like your feedback to be sent anonymously.
                    </label>
                    <button className="feedback-button" type="submit" disabled={busy || !game}>{busy ? 'Submitting…' : 'Submit'}</button>
                </form>
            </main>
            <BottomNav />
        </div>
    )
}

export default FeedBackPage
