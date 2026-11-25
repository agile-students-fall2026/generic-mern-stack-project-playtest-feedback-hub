export async function getGame(id) {
    const response = await fetch(`/api/projects/${encodeURIComponent(id)}`)
    if (response.status === 404) throw new Error('Game not found. Check your playtest link.')
    if (!response.ok) throw new Error('Unable to load game information.')
    return response.json()
}

export async function getFeedbackHistory(signal) {
    const response = await fetch('/api/feedback/mine', { signal })
    if (!response.ok) {
        const error = new Error('Could not load your feedback history.')
        error.status = response.status
        throw error
    }
    return response.json()
}

// Sends the feedback to the project on the back-end.
export async function submitFeedback(data) {
    const { images = [], ...details } = data
    const form = new FormData()
    form.append('category', details.category)
    form.append('feedback', details.feedback)
    form.append('anonymous', String(details.anonymous))
    form.append('imageUrls', JSON.stringify(details.imageUrls ?? []))
    images.forEach(file => form.append('images', file))

    const response = await fetch(`/api/projects/${encodeURIComponent(details.gameId)}/feedback`, {
        method: 'POST',
        body: form,
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body.error || 'Could not send your feedback. Please try again.')

    return body
}
