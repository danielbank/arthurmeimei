interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Proximity Sensor and LED',
    description: `We started learning robotics during the summer to prepare for the robotics electives I'm taking next year. We created a circuit where an LED activates once a proximity sensor detects nearby objects within 6 inches.`,
    imgSrc: '/static/images/proximity-sensor-and-led.jpg',
    href: '/blog/proximity-sensor-and-led',
  },
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
