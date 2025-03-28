interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Spooky Friend Rescue',
    description: `Your friend has been captured by ghosts in a haunted house! You must navigate through the house, find items, and solve challenges to rescue them. Defeat Ghosts: Answer math questions to make ghosts disappear. Solve Puzzles: Find the answer to the sphinx's riddle and collect the skeleton key. Collect Candy: Find Halloween candy throughout the house for extra points.`,
    imgSrc: '/static/images/spooky-friend-rescue.png',
    href: 'https://spooky-friend-rescue.lovable.app/',
  },
]

export default projectsData
