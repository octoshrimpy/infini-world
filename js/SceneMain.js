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
    this.load.image("water_1", "assets/water_1.png")
    this.load.image("water_shallow_1", "assets/water_shallow_1.png")
    this.load.image("sand_1",  "assets/sand_1.png")
    this.load.image("grass_1",  "assets/grass_1.png")
    this.load.image("forest_1", "assets/forest_1.png")

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
    this.cameraSpeed = 10

    this.cameras.main.setZoom(1)
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

    this.updateMap()
  }


  getChunk(x, y) {
    var chunk = null;
    for (var i = 0; i < this.chunks.length; i++) {
      if (this.chunks[i].x == x && this.chunks[i].y == y) {
        chunk = this.chunks[i];
      }
    }
    return chunk;
  }

  updateMap() {

    let radius = 6

    let follow = this.followPoint

    var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(follow.x / (this.chunkSize * this.tileSize));
    var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(follow.y / (this.chunkSize * this.tileSize));

    snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
    snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

    for (var x = snappedChunkX - radius; x < snappedChunkX + radius; x++) {
      for (var y = snappedChunkY - radius; y < snappedChunkY + radius; y++) {
        var existingChunk = this.getChunk(x, y);

        if (existingChunk == null) {
          var newChunk = new Chunk(this, x, y);
          this.chunks.push(newChunk);
        }
      }
    }

    //@hack don't need to check every chunk, just ones
    // with coords within radius of player
    // can even be square radius
    for (var i = 0; i < this.chunks.length; i++) {
      var chunk = this.chunks[i];

      if (Phaser.Math.Distance.Between(
        snappedChunkX,
        snappedChunkY,
        chunk.x,
        chunk.y
      ) < radius) {
        if (chunk !== null) {
          chunk.load();
        }
      }
      else {
        if (chunk !== null) {
          chunk.unload();
        }
      }
    }

    return follow
  }

  update() {
    
    let updateMapKeys = [
      {key: this.keyW, move:[0,1]},
      {key: this.keyS, move:[0,-1]},
      {key: this.keyA, move:[-1,0]},
      {key: this.keyD, move:[1,0]},
    ]

    let downKeys = updateMapKeys.filter(key => key.key.isDown)
    let follow = !!downKeys && this.updateMap()

    //@think this whole bit needs to be re-thought
    if (this.keyW.isDown) {
      follow.y -= this.cameraSpeed;
    }
    if (this.keyS.isDown) {
      follow.y += this.cameraSpeed;
    }
    if (this.keyA.isDown) {
      follow.x -= this.cameraSpeed;
    }
    if (this.keyD.isDown) {
      follow.x += this.cameraSpeed;
    }

    this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
  }
}