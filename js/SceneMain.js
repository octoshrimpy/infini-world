class SceneMain extends Phaser.Scene {
  constructor() {
    super({key: "SceneMain"})
  }

  preload() {
    // this.load.spritesheet("water", "water.png", {frameHeight: 16, frameWidth: 16})
    this.load.image("water", "assets/water.png")
    this.load.image("water_shallow", "assets/water_shallow.png")
    this.load.image("sand",  "assets/sand.png")
    this.load.image("grass",  "assets/grass.png")
    this.load.image("forest", "assets/forest.png")

  }

  create() {
    /*
    this.anims.create({
      key: "water",
      frames: this.anims.generateFrameNumbers("water"),
      frameRate: 5,
      repeat: -1
    })
    */
  
    this.chunkSize   = 16
    this.tileSize    = 16
    this.cameraSpeed = 10

    this.cameras.main.setZoom(0.5)
    let mainCam = this.cameras.main.worldView

    this.followPoint = new Phaser.Math.Vector2(
      mainCam.x + (mainCam.width * 0.5),
      mainCam.y + (mainCam.height * 0.5)
    )

    this.chunks = []
    
    let inputKeeb  = this.input.keyboard
    let phaKeyCode = Phaser.Input.Keyboard.KeyCodes
    
    this.keyW  = inputKeeb.addKey(phaKeyCode.W)
    this.keyA  = inputKeeb.addKey(phaKeyCode.A)
    this.keyS  = inputKeeb.addKey(phaKeyCode.S)
    this.keyD  = inputKeeb.addKey(phaKeyCode.D)
  }
  getChunk(x, y) {
    let chunk = null

    for (let i in [...Array(this.chunks.length)]) {
      if (this.chunks[i].x == x && this.chunks[i].y == y) {
        chunk = this.chunks[i]
      }
    }

    return chunk
  }

  update() {
    let chunkS = this.chunkSize
    let tileS  = this.tileSize
    let chuleS = chunkS * tileS
    let follow = this.followPoint
    let radius = 3

    let snappedChunkX = chuleS * Math.round(follow.x / chuleS)
    let snappedChunkY = chuleS * Math.round(follow.y / chuleS)

    snappedChunkX = snappedChunkX / chunkS / tileS
    snappedChunkY = snappedChunkY / chunkS / tileS

    // generate vs load
    for (let x = snappedChunkX - radius; x < snappedChunkX + radius; x++) {
      for (let y = snappedChunkY - radius; x < snappedChunkY + radius; x++) {
        let existingChunk = this.getChunk(x,y)
        if(!existingChunk) {
          let newChunk = new Chunk(this, x, y)
          this.chunks.push(newChunk)
          console.log('generated!')
        }
      }
    }

    // load unload chunks
    for (let i in [...Array(this.chunks.length)]) {
      let chunk = this.chunks[i]

      let distance = Phaser.Math.Distance.Between(
        snappedChunkX,
        snappedChunkY,
        chunk.x,
        chunk.y
      )

        
      if (distance < radius + 2) {
        !!chunk && chunk.load()
      } else {
        !!chunk && chunk.unload()
      }
    }

    // camera movement

    if (this.keyW.isDown) { follow.y -= this.cameraSpeed }
    if (this.keyA.isDown) { follow.x -= this.cameraSpeed }
    if (this.keyS.isDown) { follow.y += this.cameraSpeed }
    if (this.keyD.isDown) { follow.x += this.cameraSpeed }

    this.cameras.main.centerOn(follow.x, follow.y)
  }
}