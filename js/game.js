var config = {
  type: Phaser.WEBGL,
  // width: 640,
  // height: 640,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      Gravity: {x: 0, y: 0}
    }
  },
  scene: [
    SceneMain
  ],
  pixelArt: true,
  roundPixels: true
}

//@todo move lib to its own file
class Lib {
  // Returns a random value from an array
  static sample = (arr) => {
    return arr[this.rand(arr.length)]
  }

  // Returns a random value.
  // If no args are given, returns a random float between 0,1
  // If one arg is given, returns an integer between 0,arg inclusive
  // If two args are given, returns an integer between min,max inclusive
  static rand = (min, max) => {
    if (!min && !max) { return Math.random() }
    if (!max) {
      max = min
      min = 0
    } else {
      max += 1
    }

    return Math.floor(this.rand() * (max - min) + min)
  }
}

let noise1   = new Perlin(Math.random())
let noise10  = new Perlin(Math.random())
let noise100 = new Perlin(Math.random())

//@todo figure out better octaves
// go watch sebastian's video
function getOctaveNoise(x, y) {

  let n1_freq    = 1
  let n10_freq   = 2
  let n100_freq  = 4
  let n1000_freq = 8


  //@todo figure this out when you're not asleep
  let n1_amp    = 1 / n1_freq
  let n10_amp   = 1 / n10_freq
  let n100_amp  = 1 / n100_freq
  let n1000_amp = 1 / n1000_freq

  let n1    = noise1.perlin2(x, y)
  let n10   = noise1.perlin2(x, y)
  let n100  = noise1.perlin2(x, y)
  let n1000 = noise1.perlin2(x, y)

  let octaved = n1 + n10 + n100
  // let octaved = n1
  console.log('\n\n')
  console.log(n1, n10, n100)
  console.log(octaved + '\n\n')
  return octaved
}

let game = new Phaser.Game(config)