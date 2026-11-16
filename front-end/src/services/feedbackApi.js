const storageKey = 'playtest-demo-feedback'

export async function getGame(id) {
    const response = await fetch(`/api/projects/${encodeURIComponent(id)}`)
    if (response.status === 404) throw new Error('Game not found. Check your playtest link.')
    if (!response.ok) throw new Error('Unable to load game information.')
    return response.json()
}

export function getFeedbackHistory() {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(saved) ? saved : []
}

// Sends the feedback to the project on the back-end.
export async function submitFeedback(data) {
    const response = await fetch(`/api/projects/${encodeURIComponent(data.gameId)}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            category: data.category,
            feedback: data.feedback,
            anonymous: data.anonymous,
            imageUrls: data.imageUrls,
        }),
    })
    const body = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(body.error || 'Could not send your feedback. Please try again.')

    // Also keep a copy in this browser so the Feedback History page works until accounts exist.
    const submission = { ...data, id: body.id, createdAt: new Date().toISOString() }
    try {
        localStorage.setItem(storageKey, JSON.stringify([submission, ...getFeedbackHistory()]))
    } catch {
        // The feedback was already sent, so a full or blocked browser storage is not an error.
    }
    return submission
}
