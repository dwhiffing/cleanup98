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
import bmpPng from './assets/bmp.png'
import batPng from './assets/bat.png'
import unknownPng from './assets/unknown.png'
import iniPng from './assets/ini.png'
import imgGen from 'js-image-generator'
import { Base64 } from 'js-base64'
import { sample } from 'lodash'

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
  type: 'progress-prompt',
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
    name: 'Delete speed',
    cost: 512,
    costFactor: 2,
    maxLevel: 10,
    description: 'Reduce the time it takes to delete a file',
  },
  {
    key: 'permissions',
    name: 'File Access Level',
    cost: 1024,
    costFactor: 20,
    maxLevel: 5,
    description: 'Allows navigation and deletion of protected files',
  },
  {
    key: 'autodeleter',
    name: 'Auto deleter',
    cost: 10240,
    costFactor: 2,
    maxLevel: 5,
    description:
      'Auto deletes the smallest file in the active window every 10 seconds',
  },
  {
    key: 'select-box',
    name: 'Select box',
    cost: 102400,
    maxLevel: 1,
    description: 'Allow selection of multiple files via box',
  },

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
    number: 50,
    extensions: ['txt'],
    accessLevel: 0,
  },

  // 1

  '/C:/My Documents/Journals': {
    number: 50,
    extensions: ['doc'],
    accessLevel: 1,
  },
  '/C:/My Documents/Pictures': {
    number: 50,
    extensions: ['gif'],
    accessLevel: 1,
  },

  // 2

  '/C:/My Documents/Photos': {
    number: 50,
    extensions: ['jpg'],
    accessLevel: 2,
  },
  '/C:/My Documents/Paintings': {
    number: 30,
    extensions: ['bmp'],
    accessLevel: 2,
  },
  '/C:/Downloads': {
    number: 10,
    extensions: ['jpg', 'gif', 'bmp', 'exe'],
    accessLevel: 2,
  },
  '/C:/Downloads/Games': {
    number: 2,
    extensions: ['exe'],
    accessLevel: 2,
  },
  '/C:/Downloads/Games/Action': {
    number: 10,
    extensions: ['exe'],
    accessLevel: 2,
  },
  '/C:/Downloads/Games/RPG': {
    number: 10,
    extensions: ['exe'],
    accessLevel: 2,
  },

  // 3

  '/C:/Downloads/Music': {
    number: 25,
    extensions: ['wav'],
    accessLevel: 3,
  },

  '/C:/Downloads/Music': {
    number: 25,
    extensions: ['wav'],
    accessLevel: 3,
  },

  '/C:/Downloads/Research': {
    number: 50,
    extensions: ['jpg', 'txt'],
    accessLevel: 3,
  },

  '/C:/Acrobat': {
    number: 50,
    extensions: ['exe', 'ini'],
    accessLevel: 2,
  },

  // 3
  '/C:/Windows': {
    number: 30,
    extensions: ['dll', 'ini'],
    accessLevel: 4,
  },
  '/C:/Windows/System32': {
    number: 30,
    extensions: ['bat', 'dll', 'ini'],
    accessLevel: 4,
  },
}

export const EXTENSION_IMAGES = {
  exe: exePng,
  txt: txtPng,
  doc: notePng,
  dll: batPng,
  bat: batPng,
  bmp: bmpPng,
  jpg: bmpPng,
  gif: bmpPng,
  ini: iniPng,
  cfg: unknownPng,
  wav: unknownPng,
}

export const EXTENSION_CONTENT = {
  exe: (cb) => cb(faker.lorem.paragraph(100)),
  txt: (cb) => cb(faker.hacker.phrase(1)),
  doc: (cb) => cb(faker.company.bs(5)),
  dll: (cb) => cb(faker.lorem.paragraph(500)),
  bat: (cb) => cb(faker.lorem.paragraph(50)),
  wav: (cb) => cb(faker.lorem.paragraph(500)),
  ini: (cb) => cb(faker.lorem.paragraph(5)),
  cfg: (cb) => cb(faker.lorem.paragraph(50)),
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

// PROGRESSION
//
// TODO
// first delete txt files in unprotected folders
// get some delete speed upgrades to speed up this process
// unlock basic permissions to access bigger files
// get auto deleter and start clearing out folders full of text
// unlock permissions level 2 and get enough space for auto deleter
// use auto deleter to purge permissions level 2 folders
// get upgrade that automatically focuses/opens a new window of no files are left
// use that data to unlock windows permissions
// delete all windows data
// delete all program data
// win the game

function randomName(wordCount) {
  let strings = []
  while (wordCount-- > 0) {
    strings.push(faker.system.fileExt())
  }
  return strings.join('-')
}

export const SPECIAL_FILE_NAMES = {
  txt: () => {
    const type = sample(['Book Report', 'Recipe', 'Work Notes'])
    const date = new Date(
      883630765256 + Math.floor(Math.random() * 31536000000),
    )
      .toISOString()
      .split('T')[0]
    return type + '_' + date
  },
  doc: () => randomName(2),
  dll: () => randomName(2),
  bat: () => randomName(2),
  bmp: () => randomName(2),
  jpg: () => randomName(2),
  gif: () => randomName(2),
  ini: () => randomName(2),
  cfg: () => randomName(2),
  wav: () => sample(MUSIC),
  exe: () => randomName(2),
}

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
  'Been Around the World (Puff Daddy featuring The Notorious B.I.G. and Mase)',
  'Adia (Sarah McLachlan)',
  'Crush (Jennifer Paige)',
  "Everybody (Backstreet's Back) (Backstreet Boys)",
  "I Don't Want to Miss a Thing (Aerosmith)",
  "Body Bumpin' (Yippie-Yi-Yo) (Public Announcement)",
  'This Kiss (Faith Hill)',
  "I Don't Ever Want to See You Again (Uncle Sam)",
  "Let's Ride (Montell Jordan featuring Master P and Silkk the Shocker)",
  'Sex and Candy (Marcy Playground)',
  'Show Me Love (Robyn)',
  'A Song for Mama (Boyz II Men)',
  'What You Want (Mase featuring Total)',
  'Frozen (Madonna)',
  'Gone till November (Wyclef Jean)',
  'My Body (LSG)',
  'Tubthumping (Chumbawamba)',
  'Deja Vu (Uptown Baby) (Lord Tariq and Peter Gunz)',
  "I Want You Back ('N Sync)",
  'When the Lights Go Out (Five)',
  "They Don't Know (Jon B.)",
  "Make 'Em Say Uhh! (Master P featuring Fiend, Silkk the Shocker, Mia X and Mystikal)",
  'Make It Hot (Nicole featuring Missy Elliott and Mocha)',
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
  "My Love Is the Shhh! (Somethin' for the People featuring Trina & Tamara)",
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
  'Victory (Puff Daddy featuring The Notorious B.I.G. and Busta Rhymes)',
  'Too Much (Spice Girls)',
  "Ghetto Supastar (That Is What You Are) (Pras Michel featuring Ol' Dirty Bastard and Mýa)",
  'How Deep Is Your Love (Dru Hill featuring Redman)',
  'Friend of Mine (Kelly Price featuring R. Kelly and Ron Isley)',
  'Turn It Up (Remix)/Fire It Up (Busta Rhymes)',
  "I'll Be (Edwin McCain)",
  'Ray of Light (Madonna)',
  'All for You (Sister Hazel)',
  'Touch It (Monifah)',
  "Money, Power & Respect (The LOX featuring DMX and Lil' Kim)",
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
  'Raise the Roof (Luke featuring No Good But So Good)',
  'Heaven (Nu Flavor)',
  'The Party Continues (Jermaine Dupri featuring Da Brat and Usher)',
  'Sock It 2 Me (Missy Elliott featuring Da Brat)',
  'Butta Love (Next)',
  'A Rose Is Still a Rose (Aretha Franklin)',
  '4 Seasons of Loneliness (Boyz II Men)',
  'Father (LL Cool J)',
  "Thinkin' Bout It (Gerald Levert)",
  "Nobody's Supposed to Be Here (Deborah Cox)",
  'Westside (TQ)',
]
