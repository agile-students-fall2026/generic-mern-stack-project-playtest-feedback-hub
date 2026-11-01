const feedback = [
  { id: '1', projectId: '1', category: 'Bugs', author: 'Sam Rivera', submitted: '01/02/2001', status: 'Complete' },
  { id: '2', projectId: '1', category: 'Gameplay', author: 'Priya Shah', submitted: '01/03/2001', status: 'Incomplete' },
  { id: '3', projectId: '1', category: 'Art', author: 'Anonymous', submitted: '01/05/2001', status: 'Complete' },
  { id: '4', projectId: '1', category: 'Audio', author: 'Jordan Lee', submitted: '01/06/2001', status: 'WIP' },
  { id: '5', projectId: '1', category: 'Gameplay', author: 'Elena Ruiz', submitted: '01/08/2001', status: 'Complete' },
  { id: '6', projectId: '1', category: 'Other', author: 'Anonymous', submitted: '01/09/2001', status: 'Incomplete' },
  { id: '7', projectId: '2', category: 'Bugs', author: 'Chris Okafor', submitted: '02/15/2001', status: 'WIP' },
  { id: '8', projectId: '2', category: 'Art', author: 'Maya Patel', submitted: '02/16/2001', status: 'Resolved' },
  { id: '9', projectId: '2', category: 'Gameplay', author: 'Anonymous', submitted: '02/18/2001', status: 'Assigned' },
  { id: '10', projectId: '3', category: 'Audio', author: 'Theo Grant', submitted: '03/04/2001', status: 'Incomplete' },
  { id: '11', projectId: '3', category: 'Bugs', author: 'Riley Kim', submitted: '03/06/2001', status: 'Complete' },
  { id: '12', projectId: '1', category: 'Bugs', author: 'Ava Brooks', submitted: '01/10/2001', status: 'WIP' },
  { id: '13', projectId: '1', category: 'Art', author: 'Anonymous', submitted: '01/11/2001', status: 'Resolved' },
  { id: '14', projectId: '1', category: 'Gameplay', author: 'Marcus Hill', submitted: '01/12/2001', status: 'Assigned' },
]

export function getProjectFeedback(projectId) {
  return Promise.resolve(feedback.filter((item) => item.projectId === projectId))
}

export function getAllFeedback() {
  const newestFirst = [...feedback].sort((a, b) => new Date(b.submitted) - new Date(a.submitted))
  return Promise.resolve(newestFirst)
}
