import { team, produce, randomName } from '.'

export const prods = ['Brochure', 'Poster', 'Flyer', 'Ticket', 'Envelope', 'Book', 'Invitation', 'Backdrop', 'Banner', '3D Booth', 'Namecard', 'Other']

export const randomNo = (count, start) => Math.floor(Math.random() * count) + start || 0
export const randomTeam = () => team[randomNo(5, 0)]
export const randomProd = () => prods[randomNo(12, 0)]
export const randomManufactureType = () => produce[randomNo(5, 0)]

export const randomNewProdFilm = construct => ({ ...construct, ...{ name: randomProd(), type: randomManufactureType(), endAt: randomDate(5) } })

export const randomNewOrderFilm = (construct, toString) => {
  const endTime = randomDate()
  const endAt = randomDate(1, endTime, toString)
  const foreignTitle = randomName()
  const _id = foreignTitle.to_id()
  return {
    ...construct,
    ...{ _id, foreignTitle, vietnameseTitle: randomName(), team: randomTeam(), premiereDate: randomDate(3, endTime, toString), endAt },
  }
}

export const randomDate = (days, start, toString) => {
  const dayToMilis = 24 * 3600 * 1000
  const now = start ? start.getTime() : Date.now()
  const extend = randomNo(15, 11)
  const extendMilis = extend * dayToMilis
  const randExpand = randomNo(3, days || 0)
  const expand = randExpand * dayToMilis
  const time = now + extendMilis + expand
  if (toString) return new Date(time).toLocaleDateString('vi')
  return new Date(time)
}

export const randomSentence = () => {
  let verbs, nouns, adjectives, adverbs, preposition
  nouns = ['bird', 'clock', 'boy', 'plastic', 'duck', 'teacher', 'old lady', 'professor', 'hamster', 'dog']
  verbs = ['kicked', 'ran', 'flew', 'dodged', 'sliced', 'rolled', 'died', 'breathed', 'slept', 'killed']
  adjectives = ['beautiful', 'lazy', 'professional', 'lovely', 'dumb', 'rough', 'soft', 'hot', 'vibrating', 'slimy']
  adverbs = ['slowly', 'elegantly', 'precisely', 'quickly', 'sadly', 'humbly', 'proudly', 'shockingly', 'calmly', 'passionately']
  preposition = ['down', 'into', 'up', 'on', 'upon', 'below', 'above', 'through', 'across', 'towards']
  const rand1 = Math.floor(Math.random() * 10)
  const rand2 = Math.floor(Math.random() * 10)
  const rand3 = Math.floor(Math.random() * 10)
  const rand4 = Math.floor(Math.random() * 10)
  const rand5 = Math.floor(Math.random() * 10)
  const rand6 = Math.floor(Math.random() * 10)
  const content =
    'The ' +
    adjectives[rand1] +
    ' ' +
    nouns[rand2] +
    ' ' +
    adverbs[rand3] +
    ' ' +
    verbs[rand4] +
    ' because some ' +
    nouns[rand1] +
    ' ' +
    adverbs[rand1] +
    ' ' +
    verbs[rand1] +
    ' ' +
    preposition[rand1] +
    ' a ' +
    adjectives[rand2] +
    ' ' +
    nouns[rand5] +
    ' which, became a ' +
    adjectives[rand3] +
    ', ' +
    adjectives[rand4] +
    ' ' +
    nouns[rand6] +
    '.'
  return content
}
