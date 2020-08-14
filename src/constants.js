import trashFullPng from './assets/trash-full.png'
import deleteFilePng from './assets/delete-file.png'
import errorPng from './assets/error.png'
import installPng from './assets/install.png'
import drivePng from './assets/drive.png'
import computerPng from './assets/computer.png'
import faker from 'faker'
import txtPng from './assets/txt.png'
import exePng from './assets/exe.png'
import notePng from './assets/note.png'
import jpgPng from './assets/bmp.png'
import bmpPng from './assets/bmp2.png'
import wavPng from './assets/wav.png'
import batPng from './assets/bat.png'
import unknownPng from './assets/unknown.png'
import iniPng from './assets/ini.png'
import imgGen from 'js-image-generator'
import { Base64 } from 'js-base64'
import { sample } from 'lodash'
import rant from 'rantjs'

export const WIN_PROMPT = {
  type: 'prompt',
  image: trashFullPng,
  title: 'Success',
  label: 'You win!',
}

export const ERROR_PROMPT = {
  type: 'prompt',
  image: errorPng,
  title: 'Error',
  label: 'Windows has encountered an error.',
}

export const ALREADY_INSTALLED_ERROR = {
  type: 'prompt',
  image: errorPng,
  title: 'Error',
  label: 'Already have this upgrade',
}

export const NOT_ENOUGH_SPACE_ERROR = {
  type: 'prompt',
  image: errorPng,
  title: 'Error',
  label: "You don't have enough free space",
}

export const PERMISSIONS_ERROR = {
  type: 'prompt',
  image: errorPng,
  title: 'Administrator',
  label: 'Unauthorized. You do not currently have permission to delete this.',
}

export const PERMISSIONS_VIEW_ERROR = {
  type: 'prompt',
  image: errorPng,
  title: 'Administrator',
  label: 'Unauthorized. You do not currently have permission to open this.',
}

export const DELETE_PROMPT = {
  type: 'delete-prompt',
  title: 'Deleting...',
  image: deleteFilePng,
  width: 300,
  allowClose: true,
}

export const DELETE_CONFIRM_PROMPT = {
  type: 'prompt',
  title: 'Confirm File Delete',
  label: 'Are you sure you want to send this to the Recycle Bin?',
  image: deleteFilePng,
}

export const DRIVE_PROPERTIES_MENU = {
  type: 'drive-properties',
  title: 'Drive Properties',
}

export const ADD_PROGRAMS_MENU = {
  type: 'add-programs',
  title: 'Install Programs',
}
export const UPGRADES = [
  {
    key: 'delete-speed',
    name: 'Delete boost',
    costs: [512, 2048, 8000, 20000, 50000, 100000],
    description: 'Reduce the time it takes to delete a file',
  },
  {
    key: 'max-delete-prompt',
    name: 'More deletes',
    costs: [3200, 8000, 20000, 30000, 60000],
    description: 'Allows simultaneous deletion of more files.',
  },
  {
    key: 'permissions',
    name: 'File Access Level',
    costs: [3200, 8000, 20000, 30000, 60000],
    description: 'Allows navigation and deletion of protected files',
  },
  {
    key: 'autodeleter',
    name: 'Auto deleter count',
    costs: [3200, 8000, 20000, 30000, 60000],
    description:
      'Auto deletes the smallest file in the active window every 8 seconds. Each upgrade increases the amount you can have open.',
  },
  {
    key: 'autodeleter-speed',
    name: 'Auto deleter speed',
    costs: [3200, 8000, 20000, 30000, 60000],
    description:
      'Auto deletes the smallest file in the active window every 8 seconds. Each upgrade subtracts 2 seconds from the duration.',
  },
  {
    key: 'delete-express',
    name: 'Delete express',
    costs: [3200, 8000, 20000, 30000, 60000],
    description: 'Extremely reduce the time it takes to delete a file',
  },
  {
    key: 'select-box',
    name: 'Select box',
    costs: [102400],
    cost: 102400,
    description: 'Allow selection of multiple files via box',
  },
  // max number of simultaneous deletes?
  // hotkeys?
  // show file size?
  // order by filesize?
]

export const RESIZEABLE_SIDES = {
  top: false,
  right: true,
  bottom: true,
  left: false,
  topRight: false,
  bottomRight: true,
  bottomLeft: false,
  topLeft: false,
}

export const DESKTOP_ICONS = [
  // TODO: icon for auto deleter
  {
    type: 'folder',
    name: 'My Computer',
    image: computerPng,
    isFolder: true,
    path: '/',
  },
  {
    type: 'folder',
    name: 'Install Programs',
    image: installPng,
    onDoubleClick: () => ADD_PROGRAMS_MENU,
  },
  {
    type: 'folder',
    name: 'Drive Properties',
    image: drivePng,
    onDoubleClick: () => DRIVE_PROPERTIES_MENU,
  },
]

export const HELP_PROMPT = {
  type: 'prompt',
  image: errorPng,
  title: 'Windows has encountered an error',
  label:
    'Disk Cleanup Utility not found.  Please remove all files from this computer manually by clicking on them and pressing delete.',
}

export const INITIAL_DIRECTORIES = {
  '/C:': {
    number: 7,
    extensions: ['dll', 'ini'],
    accessLevel: 0,
  },
  '/C:/My Documents': {
    number: 3,
    extensions: ['bmp'],
    accessLevel: 0,
  },
  '/C:/My Documents/Notes': {
    number: 40,
    extensions: ['txt'],
    accessLevel: 0,
  },

  // 1

  '/C:/My Documents/Journals': {
    number: 30,
    extensions: ['doc'],
    accessLevel: 1,
  },
  '/C:/My Documents/Pictures': {
    number: 45,
    extensions: ['gif'],
    accessLevel: 1,
  },

  // 2

  '/C:/My Documents/Photos': {
    number: 35,
    extensions: ['jpg'],
    accessLevel: 2,
  },
  '/C:/My Documents/Paintings': {
    number: 15,
    extensions: ['bmp'],
    accessLevel: 2,
  },
  '/C:/Downloads': {
    number: 10,
    extensions: ['jpg', 'gif', 'bmp', 'exe'],
    accessLevel: 2,
  },

  // 3

  '/C:/Downloads/Music': {
    number: 25,
    extensions: ['wav'],
    accessLevel: 3,
  },

  // 4
  '/C:/Downloads/Games': {
    number: 2,
    extensions: ['exe'],
    accessLevel: 4,
  },
  '/C:/Downloads/Games/Action': {
    number: 10,
    extensions: ['exe'],
    accessLevel: 4,
  },
  '/C:/Downloads/Games/RPG': {
    number: 10,
    extensions: ['exe'],
    accessLevel: 4,
  },

  // 5
  // TODO: should have more nested folders
  '/C:/Research': {
    number: 2,
    extensions: ['jpg', 'bmp', 'doc', 'txt'],
    accessLevel: 5,
  },
  '/C:/Research/Subject1': {
    number: 2,
    extensions: ['jpg', 'bmp'],
    accessLevel: 5,
  },
  '/C:/Research/Subject2': {
    number: 1,
    extensions: ['jpg', 'bmp'],
    accessLevel: 5,
  },
  '/C:/Research/Results1': {
    number: 1,
    extensions: ['jpg', 'bmp', 'doc', 'txt'],
    accessLevel: 5,
  },
  '/C:/Research/Results2': {
    number: 6,
    extensions: ['jpg', 'bmp', 'doc', 'txt'],
    accessLevel: 5,
  },
  '/C:/Research/Results2/Secrets': {
    number: 4,
    extensions: ['jpg', 'bmp', 'doc', 'txt'],
    accessLevel: 5,
  },
  '/C:/Research/Results2/Secrets/Are': {
    number: 4,
    extensions: ['jpg', 'bmp', 'doc', 'txt'],
    accessLevel: 5,
  },
  '/C:/Research/Results2/Secrets/Are/Always': {
    number: 4,
    extensions: ['jpg', 'bmp', 'doc', 'txt'],
    accessLevel: 5,
  },
  '/C:/Research/Results2/Secrets/Are/Always/Best': {
    number: 4,
    extensions: ['jpg', 'bmp', 'doc', 'txt'],
    accessLevel: 5,
  },
  '/C:/Research/Results2/Secrets/Are/Always/Best/Hidden': {
    number: 4,
    extensions: ['jpg', 'bmp', 'doc', 'txt'],
    accessLevel: 5,
  },
  '/C:/Research/Results2/Secrets/Are/Always/Best/Hidden/In': {
    number: 4,
    extensions: ['jpg', 'bmp', 'doc', 'txt'],
    accessLevel: 5,
  },
  '/C:/Research/Results2/Secrets/Are/Always/Best/Hidden/In/Plain': {
    number: 4,
    extensions: ['jpg', 'bmp', 'doc', 'txt'],
    accessLevel: 5,
  },
  '/C:/Research/Results2/Secrets/Are/Always/Best/Hidden/In/Plain/Sight': {
    number: 50,
    extensions: ['jpg', 'doc', 'txt'],
    accessLevel: 5,
  },

  '/C:/Research/Favorites': {
    number: 5,
    extensions: ['jpg', 'bmp'],
    accessLevel: 5,
  },
  '/C:/Research/Favorites/Other': {
    number: 2,
    extensions: ['doc', 'txt'],
    accessLevel: 5,
  },

  // 6
  '/C:/Windows': {
    number: 20,
    extensions: ['dll', 'ini', 'exe'],
    accessLevel: 6,
  },
  '/C:/Windows/System32': {
    number: 20,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 6,
  },
  '/C:/Windows/System32/abc': {
    number: 10,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 6,
  },
  '/C:/Windows/System32/def': {
    number: 10,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 6,
  },
  '/C:/Windows/System32/ghi': {
    number: 10,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 6,
  },
  '/C:/Windows/System32/jkl': {
    number: 10,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 6,
  },
  '/C:/Windows/System32/mno': {
    number: 10,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 6,
  },
  '/C:/Windows/System32/pqr': {
    number: 10,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 6,
  },
  '/C:/Windows/System32/stu': {
    number: 10,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 6,
  },
  '/C:/Windows/System32/vwx': {
    number: 10,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 6,
  },
  '/C:/Windows/System32/yz': {
    number: 10,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 6,
  },
}

export const EXTENSION_IMAGES = {
  exe: exePng,
  txt: txtPng,
  doc: notePng,
  dll: batPng,
  bat: batPng,
  bmp: bmpPng,
  jpg: jpgPng,
  gif: jpgPng,
  ini: iniPng,
  cfg: unknownPng,
  wav: wavPng,
}

export const EXTENSION_CONTENT = {
  exe: (cb) => cb(faker.lorem.paragraph(1200)),
  txt: (cb) => cb(rant(sample(RANTS))),
  doc: (cb) => cb(rant(sample(BIG_RANTS))),
  bat: (cb) => cb(faker.lorem.paragraph(50)),
  ini: (cb) => cb(faker.lorem.paragraph(5)),
  cfg: (cb) => cb(faker.lorem.paragraph(50)),
  dll: (cb) => cb(faker.lorem.paragraph(300)),
  wav: (cb) => cb(faker.lorem.paragraph(300)),
  gif: (cb) => {
    imgGen.generateImage(10, 10, 80, function (err, content) {
      cb(Base64.fromUint8Array(content.data))
    })
  },
  jpg: (cb) => {
    imgGen.generateImage(50, 50, 80, function (err, content) {
      cb(Base64.fromUint8Array(content.data))
    })
  },
  bmp: (cb) => {
    imgGen.generateImage(100, 100, 80, function (err, content) {
      cb(Base64.fromUint8Array(content.data))
    })
  },
}

function randomName(wordCount) {
  let strings = []
  while (wordCount-- > 0) {
    strings.push(faker.system.fileExt())
  }
  return strings.join('-')
}
const get98Date = () =>
  new Date(883630765256 + Math.floor(Math.random() * 31536000000))
    .toISOString()
    .split('T')[0]

export const SPECIAL_FILE_NAMES = {
  txt: () => {
    const type = sample(['Book Report', 'Recipe', 'Work Notes'])
    return type + '_' + get98Date()
  },
  doc: () => {
    const type = sample(['Journal', 'Lovers', 'Receipts'])
    return type + '_' + get98Date()
  },
  jpg: () => {
    const type = sample([
      'Research Photo',
      `${faker.name.lastName()} School Photo`,
      `${faker.name.lastName()} Family Photo`,
    ])
    return type + '_' + get98Date()
  },

  bmp: () => {
    const type = sample([
      'drawing of Mom',
      'family portrait',
      'first day',
      'big text',
      'mspaint-is-fun',
    ])
    return type + faker.random.word()
  },
  gif: () => {
    const type = sample([
      'funny',
      'animated cool',
      'under-construction',
      'spider-man',
      'dancing-baby',
      'all-your-base',
      'godwins-law',
    ])
    return type + faker.random.word()
  },
  wav: () => sample(MUSIC),
  ini: () => randomName(2),
  cfg: () => randomName(2),
  dll: () => randomName(2),
  bat: () => randomName(2),
  exe: () => {
    return sample(GAMES)
  },
}

const GAMES = [
  'Doom',
  'Space Cadet 3D Pinball',
  'Need for Speed',
  'Descent',
  'Death Rally',
  'Monster Truck Madness',
  'Solitaire',
  'Minesweeper',
  'HOVER!',
  'Unreal',
  'The Incredible Machine',
  'Unreal Tournament',
  'Hearts',
  'Freecell',
  'Golf',
  'Starcraft',
  'X-Com',
  'Star Control',
  'Star Control 2',
  'Jazz Jackrabbit',
  'Heart of Darkness',
  'Duke Nukem',
  'Wolfenstein 3D',
  'Half Life',
  'Command and Conquer',
  'Thief',
  'Tomb Raider',
  'Buldars Gate',
  'Chess',
]

const MUSIC = [
  'Too Close (Next)',
  'The Boy Is Mine (Brandy and Monica)',
  "You're Still the One (Shania Twain)",
  'Truly Madly Deeply (Savage Garden)',
  'How Do I Live (LeAnn Rimes)',
  'Together Again (Janet)',
  'All My Life (K-Ci & JoJo)',
  'Candle in the Wind 1997 (Elton John)',
  'Nice & Slow (Usher)',
  "I Don't Want to Wait (Paula Cole)",
  "How's It Going to Be (Third Eye Blind)",
  "No, No, No (Destiny's Child)",
  'My Heart Will Go On (Celine Dion)',
  "Gettin' Jiggy wit It (Will Smith)",
  'You Make Me Wanna... (Usher)',
  'My Way (Usher)',
  'My All (Mariah Carey)',
  'The First Night (Monica)',
  'Been Around the World',
  'Adia (Sarah McLachlan)',
  'Crush (Jennifer Paige)',
  "Everybody (Backstreet's Back)",
  "I Don't Want to Miss a Thing (Aerosmith)",
  "Body Bumpin' (Yippie-Yi-Yo)",
  'This Kiss (Faith Hill)',
  "I Don't Ever Want to See You Again (Uncle Sam)",
  "Let's Ride",
  'Sex and Candy (Marcy Playground)',
  'Show Me Love (Robyn)',
  'A Song for Mama (Boyz II Men)',
  'What You Want (Mase featuring Total)',
  'Frozen (Madonna)',
  'Gone till November (Wyclef Jean)',
  'My Body (LSG)',
  'Tubthumping (Chumbawamba)',
  'Deja Vu (Uptown Baby)',
  "I Want You Back ('N Sync)",
  'When the Lights Go Out (Five)',
  "They Don't Know (Jon B.)",
  "Make 'Em Say Uhh!",
  'Make It Hot (Nicole)',
  'Never Ever (All Saints)',
  'I Get Lonely (Janet Jackson featuring Blackstreet)',
  'Feel So Good (Mase featuring Kelly Price)',
  'Say It (Voices of Theory)',
  'Kiss the Rain (Billie Myers)',
  'Come with Me (Puff Daddy featuring Jimmy Page)',
  'Romeo and Juliet (Sylk-E. Fyne featuring Chill)',
  "It's All About Me (Mýa and Sisqo)",
  'I Will Come to You (Hanson)',
  'One Week (Barenaked Ladies)',
  'Swing My Way (K. P. & Envyi)',
  'The Arms of the One Who Loves You (Xscape)',
  'My Love Is the Shhh!',
  "Daydreamin' (Tatyana Ali)",
  "We're Not Making Love No More (Dru Hill)",
  'Semi-Charmed Life (Third Eye Blind)',
  'I Do (Lisa Loeb)',
  "Lookin' at Me (Mase featuring Puff Daddy)",
  'Looking Through Your Eyes (LeAnn Rimes)',
  'Lately (Divine)',
  'Quit Playing Games (With My Heart) (Backstreet Boys)',
  'I Still Love You (Next)',
  'Time After Time (INOJ)',
  'Are You Jimmy Ray? (Jimmy Ray)',
  'Cruel Summer (Ace of Base)',
  'I Got the Hook Up (Master P featuring Sons of Funk)',
  'Victory',
  'Too Much (Spice Girls)',
  'Ghetto Supastar (That Is What You Are) ',
  'How Deep Is Your Love (Dru Hill featuring Redman)',
  'Friend of Mine (Kelly Price)',
  'Turn It Up (Remix)/Fire It Up (Busta Rhymes)',
  "I'll Be (Edwin McCain)",
  'Ray of Light (Madonna)',
  'All for You (Sister Hazel)',
  'Touch It (Monifah)',
  'Money, Power & Respect',
  'Bitter Sweet Symphony (The Verve)',
  'Dangerous (Busta Rhymes)',
  'Spice Up Your Life (Spice Girls)',
  'Because of You (98 Degrees)',
  "The Mummers' Dance (Loreena McKennitt)",
  'All Cried Out (Allure featuring 112)',
  'Still Not a Player (Big Pun featuring Joe)',
  'The One I Gave My Heart To (Aaliyah)',
  'Foolish Games' / 'You Were Meant for Me (Jewel)',
  'Love You Down (INOJ)',
  'Do for Love (2Pac featuring Eric Williams)',
  'Raise the Roof (Luke)',
  'Heaven (Nu Flavor)',
  'The Party Continues',
  'Sock It 2 Me (Missy Elliott featuring Da Brat)',
  'Butta Love (Next)',
  'A Rose Is Still a Rose (Aretha Franklin)',
  '4 Seasons of Loneliness (Boyz II Men)',
  'Father (LL Cool J)',
  "Thinkin' Bout It (Gerald Levert)",
  "Nobody's Supposed to Be Here (Deborah Cox)",
  'Westside (TQ)',
]

const RANTS = [
  "The <noun tool> in the <place building> made a noisy <sound>. You sigh <adv emotion> and get up to check it out. As you peer into the dimly lit enclosure, you <adv emotion> wonder what made the noise. You don't see anything, and conclude that it was probably just a <noun animal> scurrying about. You find that a couple of <noun tool plural> has been upended, so you set them straight. You turn around and start <verb walk ing> out, but freeze as you hear something <sound> behind you. What can it be?",
  'Let me <verb> you a bit of my <noun>. I used to (and still) <verb> a lot of <noun plural> ranging from <noun> to <noun>. I saw how those <noun plural> get <adj> <noun> from the audience. Sometimes I felt, “Hey, I already knew this” or “I can <verb> better than this guy” and I jumped in and made my first <noun>!',
  'At that time I wanted a place to put up my <noun plural> and <noun plural>. I guess there are lots of <noun plural> like me, who became <noun plural> by chance. And if you are one of them, I suggest that you get your self a <adj> <noun> rather than a <adj> one. Let me list out some <noun plural>.',
  'People don’t become <noun plural> overnight, its something you become with time. A <adj> <noun> needs an <noun> to write for it. For instance, you cannot <verb> about making <noun> without actually making it or you cannot write about <noun> without a <noun> in <verb>. A newbie <noun> is usually a jack of a couple of trades but not a master.',
]

const BIG_RANTS = [
  `When you have a <noun> you can <verb> about anything under the sky. You do not have to limit its <noun> within a closed shell. With a niche <noun> you will be <verb>ing about the same thing over and over.

Suppose you have a <noun> about <noun> and suddenly a striking idea that has nothing to do with <noun> comes up. Where do you put it? You cannot write a <noun> on <noun> on a <noun> that reads <noun>all, can you? <noun> give you that freedom.

People don’t become <noun plural> overnight, its something you become with time. A <adj> <noun> needs an <noun> to write for it. For instance, you cannot <verb> about making <noun> without actually making it or you cannot write about <noun> without a <noun> in <verb>. A newbie <noun> is usually a jack of a couple of trades but not a master.`,
]
