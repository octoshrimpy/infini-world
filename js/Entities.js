/** @format */

class Chunk {
  constructor(scene, x, y) {
    this.scene = scene
    this.x = x
    this.y = y
    this.perlinZoom = 200

    this.tiles = this.scene.add.group()
    this.isLoaded = false
  }

  unload() {
    if (!this.isLoaded) {
      return
    }

    this.tiles.clear(true, true)
    this.isLoaded = false
  }

  load() {
    if (this.isLoaded) {
      return
    }

    let chunkS = this.scene.chunkSize
    let tileS = this.scene.tileSize

    for (let x = 0; x < chunkS; x++) {
      for (let y = 0; y < chunkS; y++) {
        let tileX = this.x * (chunkS * tileS) + x * tileS
        let tileY = this.y * (chunkS * tileS) + y * tileS

        let perlinVal =  getOctaveNoise(tileX / this.perlinZoom, tileY / this.perlinZoom)

        // let animKey = ""
        let key = ['water', 'water_1']

        if (perlinVal > 0.1) {
          key = ['water_shallow', 'water_shallow_1']
        }
        if (perlinVal > 2) {
          key = ['sand', 'sand_1']
        }
        if (perlinVal > 3) {
          key = ['grass', 'grass_1']
        }
        if (perlinVal > 5) {
          key = ['forest', 'forest_1']
        }

        if (Array.isArray(key)) {
          key = Lib.sample(key)
        }

        let tile = new Tile(this.scene, tileX, tileY, key)

        /*
        !!animationKey && tile.play(animationKey)
        */

        this.tiles.add(tile)
      }
    }

    this.isLoaded = true
  }

  async sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }
}

class Tile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key)

    this.scene = scene
    this.scene.add.existing(this)
    this.setOrigin(0)
  }
}
