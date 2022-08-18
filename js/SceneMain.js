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
  
    this.chunkSize   = 4
    this.tileSize    = 16
    this.cameraSpeed = 20

    this.cameras.main.setZoom(0.5)
    let mainCam = this.cameras.main.worldView

    this.followPoint = new Phaser.Math.Vector2(
      mainCam.x + (mainCam.width * 0.5),
      mainCam.y + (mainCam.height * 0.5)
    )

    this.chunks = {}
    
    let inputKeeb  = this.input.keyboard
    let phaKeyCode = Phaser.Input.Keyboard.KeyCodes
    
    this.keyW  = inputKeeb.addKey(phaKeyCode.W)
    this.keyA  = inputKeeb.addKey(phaKeyCode.A)
    this.keyS  = inputKeeb.addKey(phaKeyCode.S)
    this.keyD  = inputKeeb.addKey(phaKeyCode.D)
  }

  getChunk(x, y) {
    return this.chunks[`chunk_${x}_${y}`] || null
  }

  move() {
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
      for (let y = snappedChunkY - radius; y < snappedChunkY + radius; y++) {
        let existingChunk = this.getChunk(x,y)
        if(!existingChunk) {

          let newChunk = new Chunk(this, x, y)
          this.chunks[`newChunk_${x}_${y}`] = newChunk

          // console.log(`generated [${newChunk.x}, ${newChunk.y}]`)
        }
      }
    }

    // load unload chunks
    for (let chunk of Object.values(this.chunks)) {

      let distance = Phaser.Math.Distance.Between(
        snappedChunkX,
        snappedChunkY,
        chunk.x,
        chunk.y
      )

      distance < radius && chunk.load()
      distance >= radius && chunk.unload()
    }

    return follow
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
      for (let y = snappedChunkY - radius; y < snappedChunkY + radius; y++) {
        let existingChunk = this.getChunk(x,y)
        if(!existingChunk) {

          let newChunk = new Chunk(this, x, y)
          this.chunks[`newChunk_${x}_${y}`] = newChunk

          // console.log(`generated [${newChunk.x}, ${newChunk.y}]`)
        }
      }
    }

    // load unload chunks
    for (let chunk of Object.values(this.chunks)) {

      let distance = Phaser.Math.Distance.Between(
        snappedChunkX,
        snappedChunkY,
        chunk.x,
        chunk.y
      )

      distance < radius && chunk.load()
      distance >= radius && chunk.unload()
    }

    // camera movement

    if (this.keyW.isDown) { follow.y -= this.cameraSpeed }
    if (this.keyA.isDown) { follow.x -= this.cameraSpeed }
    if (this.keyS.isDown) { follow.y += this.cameraSpeed }
    if (this.keyD.isDown) { follow.x += this.cameraSpeed }

    !!follow && this.cameras.main.centerOn(follow.x, follow.y)
  }
}