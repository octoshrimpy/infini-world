class Chunk {
  constructor(scene, x, y) {
    this.scene = scene
    this.x = x
    this.y = y
    this.perlinZoom = 250

    this.tiles = this.scene.add.group()
    this.isLoaded = false
  }

  unload() {
    if (this.isLoaded) {
      this.tiles.clear(true, true)
      this.isLoaded = false
    }
  }

  load() {
    if (!this.isLoaded) {
      let chunkS = this.scene.chunkSize
      let tileS  = this.scene.tileSize

      for (let x in [...Array(chunkS)]) {
        for (let y in [...Array(chunkS)]) {

          let tileX = (this.x * (chunkS * tileS)) + (x * tileS)
          let tileY = (this.y * (chunkS * tileS)) + (y * tileS)
          
          let perlinVal = noise.perlin2(tileX / this.perlinZoom, tileY / this.perlinZoom)

          let key     = ""
          // let animKey = ""

          if (perlinVal < 0.01) {
            key = "water"
            // animKey = "water"
          } else
          if (perlinVal >= 0.01 && perlinVal < 0.15) {
            key = "water_shallow"
          } else
          if (perlinVal >= 0.15 && perlinVal < 0.25) {
            key = "sand"
          } else
          if (perlinVal >= 0.25 && perlinVal < 0.50) {
            key = "grass"
          } else
          if (perlinVal >= 0.50) {
            key = "forest"
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
  }
}

class Tile extends Phaser.GameObjects.Sprite {
  constructor(scene, x ,y, key) {
    super(scene, x, y, key)

    this.scene = scene
    this.scene.add.existing(this)
    this.setOrigin(0)
  }
}