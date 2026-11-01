const feedback = [
  {
    id: '1',
    projectId: '1',
    category: 'Bugs',
    author: 'Sam Rivera',
    submitted: '01/02/2001',
    status: 'Complete',
    text: 'The boat clips through the dock on the second island if you sail in at full speed. I got stuck inside it once and had to restart the level.',
    images: ['https://picsum.photos/seed/fb-1a/300/340', 'https://picsum.photos/seed/fb-1b/300/340'],
  },
  {
    id: '2',
    projectId: '1',
    category: 'Gameplay',
    author: 'Priya Shah',
    submitted: '01/03/2001',
    status: 'Incomplete',
    text: 'The storm section felt too hard compared to everything before it. Maybe add a checkpoint halfway through or slow the waves down a little.',
    images: [],
  },
  {
    id: '3',
    projectId: '1',
    category: 'Art',
    author: 'Anonymous',
    submitted: '01/05/2001',
    status: 'Complete',
    text: 'Loved the harbor at sunset. The fog in the night levels makes it hard to see the buoys though.',
    images: ['https://picsum.photos/seed/fb-3a/300/340', 'https://picsum.photos/seed/fb-3b/300/340', 'https://picsum.photos/seed/fb-3c/300/340'],
  },
  {
    id: '4',
    projectId: '1',
    category: 'Audio',
    author: 'Jordan Lee',
    submitted: '01/06/2001',
    status: 'WIP',
    text: 'The seagull sound effect loops every few seconds and gets repetitive. The music is great, but it cuts out abruptly when you enter the shop.',
    images: [],
  },
  {
    id: '5',
    projectId: '1',
    category: 'Gameplay',
    author: 'Elena Ruiz',
    submitted: '01/08/2001',
    status: 'Complete',
    text: 'Fishing mini-game is really fun. I would play a whole mode of just that.',
    images: ['https://picsum.photos/seed/fb-5a/300/340'],
  },
  {
    id: '6',
    projectId: '1',
    category: 'Other',
    author: 'Anonymous',
    submitted: '01/09/2001',
    status: 'Incomplete',
    text: 'The settings menu does not remember my volume choice after closing the game.',
    images: [],
  },
  {
    id: '7',
    projectId: '2',
    category: 'Bugs',
    author: 'Chris Okafor',
    submitted: '02/15/2001',
    status: 'WIP',
    text: 'Folding the planet twice in a row makes the camera spin forever. Pausing and unpausing fixes it.',
    images: ['https://picsum.photos/seed/fb-7a/300/340'],
  },
  {
    id: '8',
    projectId: '2',
    category: 'Art',
    author: 'Maya Patel',
    submitted: '02/16/2001',
    status: 'Resolved',
    text: 'The paper texture is beautiful. Some of the text on the crumpled signs is hard to read.',
    images: ['https://picsum.photos/seed/fb-8a/300/340', 'https://picsum.photos/seed/fb-8b/300/340'],
  },
  {
    id: '9',
    projectId: '2',
    category: 'Gameplay',
    author: 'Anonymous',
    submitted: '02/18/2001',
    status: 'Assigned',
    text: 'I did not understand that I could unfold the map until the third level. A short hint at the start would help.',
    images: [],
  },
  {
    id: '10',
    projectId: '3',
    category: 'Audio',
    author: 'Theo Grant',
    submitted: '03/04/2001',
    status: 'Incomplete',
    text: 'The crowd noise in the market drowns out the vendor dialogue. Lowering the background a bit would help.',
    images: [],
  },
  {
    id: '11',
    projectId: '3',
    category: 'Bugs',
    author: 'Riley Kim',
    submitted: '03/06/2001',
    status: 'Complete',
    text: 'Buying two lanterns at once charged me three times.',
    images: ['https://picsum.photos/seed/fb-11a/300/340'],
  },
  {
    id: '12',
    projectId: '1',
    category: 'Bugs',
    author: 'Ava Brooks',
    submitted: '01/10/2001',
    status: 'WIP',
    text: 'The anchor button stops working after you open the map. I had to reload my save to use it again.',
    images: ['https://picsum.photos/seed/fb-12a/300/340', 'https://picsum.photos/seed/fb-12b/300/340', 'https://picsum.photos/seed/fb-12c/300/340'],
  },
  {
    id: '13',
    projectId: '1',
    category: 'Art',
    author: 'Anonymous',
    submitted: '01/11/2001',
    status: 'Resolved',
    text: 'The new lighthouse model looks much better than the old one.',
    images: [],
  },
  {
    id: '14',
    projectId: '1',
    category: 'Gameplay',
    author: 'Marcus Hill',
    submitted: '01/12/2001',
    status: 'Assigned',
    text: 'Trading routes pay out too little early on. I spent most of my first hour just grinding coins.',
    images: [],
  },
]

export function getProjectFeedback(projectId) {
  return Promise.resolve(feedback.filter((item) => item.projectId === projectId))
}

export function getAllFeedback() {
  const newestFirst = [...feedback].sort((a, b) => new Date(b.submitted) - new Date(a.submitted))
  return Promise.resolve(newestFirst)
}

export function getFeedback(id) {
  const item = feedback.find((entry) => entry.id === id) || null
  return Promise.resolve(item)
}

export function updateFeedbackStatus(id, status) {
  const item = feedback.find((entry) => entry.id === id)
  item.status = status
  return Promise.resolve({ ...item })
}
