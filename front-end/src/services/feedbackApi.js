const storageKey = 'playtest-demo-feedback'

export async function getGame(id = 'demo') {
    const response = await fetch('/mock/games.json')
    if (!response.ok) throw new Error('Unable to load game information.')
    const games = await response.json()
    const game = games.find(item => item.id === id)
    if (!game) throw new Error('Game not found. Check your playtest link.')
    return game
}

export function getFeedbackHistory() {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(saved) ? saved : []
}

// Sprint 1 demo adapter. Replace with a POST request during Sprint 2.
export async function submitFeedback(data) {
    const submission = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    const history = getFeedbackHistory()
    localStorage.setItem(storageKey, JSON.stringify([submission, ...history]))
    return submission
}
