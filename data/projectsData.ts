interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Spooky Friend Rescue',
    description: `Your friend has been captured by ghosts in a haunted house! You must navigate through the house, find items, and defeat ghosts by solving math problems in order to rescue them.`,
    imgSrc: '/static/images/spooky-friend-rescue.jpg',
    href: 'https://spooky-friend-rescue.lovable.app/',
  },
  {
    title: 'New Enemy Best Friend',
    description: `A book series by Adele about New Enemy Best Friend is about a dog and a cat and adventures they have (Ages 8 - 10).`,
    imgSrc: '/static/images/new-enemy-best-friend.jpg',
    href: '/blog/new-enemy-best-friend',
  },
]

export default projectsData
