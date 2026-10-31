const projects = [
    {
      id: '1',
      name: 'Harbor Quest',
      developer: 'Avery Lin',
      submitted: '01/01/2001',
      image: 'https://picsum.photos/seed/harbor-quest/88/88',
    },
    {
      id: '2',
      name: 'Paper Planet',
      developer: 'Noah Park',
      submitted: '02/14/2001',
      image: 'https://picsum.photos/seed/paper-planet/88/88',
    },
    {
      id: '3',
      name: 'Night Market',
      developer: 'Mina Cho',
      submitted: '03/03/2001',
      image: 'https://picsum.photos/seed/night-market/88/88',
    },
    {
      id: '4',
      name: 'Glass Garden',
      developer: 'Leo Chen',
      submitted: '04/20/2001',
      image: 'https://picsum.photos/seed/glass-garden/88/88',
    },
  ]
  
  export function getProjects() {
    return Promise.resolve(projects)
  }
  export function addProject(project) {
    projects.push({
      id: String(Date.now()),
      name: project.name,
      developer: project.developer,
      description: project.description,
      submitted: new Date().toLocaleDateString('en-US'),
      image: project.image,
    })
    return Promise.resolve()
  }
  export function getProject(id) {
    const project = projects.find((item) => item.id === id) || null
    return Promise.resolve(project)
  }