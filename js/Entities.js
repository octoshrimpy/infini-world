class Chunk {
  constructor(scene, x, y) {
    this.scene = scene
    this.x = x
    this.y = y
    this.perlinZoom = 1000

    this.tiles = this.scene.add.group()
    this.isLoaded = false
    
  }

  unload() {
    if (!this.isLoaded) { return }
    
    this.tiles.clear(true, true)
    this.isLoaded = false

  }

  async load() {
    if (this.isLoaded) { return }
    
    let chunkS = this.scene.chunkSize
    let tileS  = this.scene.tileSize

    for (let x = 0; x < chunkS; x++) {
      for (let y = 0; y < chunkS; y++) {

        let tileX = (this.x * (chunkS * tileS)) + (x * tileS)
        let tileY = (this.y * (chunkS * tileS)) + (y * tileS)
        
        let perlinVal = noise.perlin2(tileX / this.perlinZoom, tileY / this.perlinZoom)

        // let animKey = ""
        let key = "water"

        if (perlinVal > 0.01) {
          key = "water_shallow"
        } 
        if (perlinVal > 0.10) {
          key = "sand"
        } 
        if (perlinVal > 0.20) {
          key = "grass"
        } 
        if (perlinVal > 0.30) {
          key = "forest"
        }

        let tile = new Tile(this.scene, tileX, tileY, key)

        /*
        !!animationKey && tile.play(animationKey)
        */
        
        this.tiles.add(tile)

        // await this.sleep(1)
      }
    }

    this.isLoaded = true
    
  }

  async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    })
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