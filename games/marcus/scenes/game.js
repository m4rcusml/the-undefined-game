class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'game' })
    // variaveis globais
    this.velocity = 280
    this.jumpForce = 750
    this.coyoteTime = 140
    this.jumpBufferTime = 100
    this.lastGroundedTime = 0
    this.lastJumpPressTime = 0
    this.isJumping = false
  }

  preload() {
    // Carrega as imagens de fundo para o jogo
    this.load.image('ground', 'assets/ground.png')
    this.load.image('bgSky', 'assets/bg/clouds2/1.png')
    this.load.image('bgClouds', 'assets/bg/clouds2/3.png')
    this.load.image('platform', 'assets/grassPlatform.png')
    this.load.image('crystal', 'assets/crystals/Blue/blue_crystal_0000.png')
    this.load.spritesheet('player', 'assets/playerSpritesheet.png', { frameWidth: 140, frameHeight: 140 })
  }

  create() {
    this.physics.world.setBounds(0, 0, 1920, 7680);
    this.cursors = this.input.keyboard.addKeys({ // adicionando as telcas permitidas
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      upArrow: Phaser.Input.Keyboard.KeyCodes.UP,
    })

    // background
    this.add.image(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, 'bgSky').setDisplaySize(1920, 7680)
    this.add.image(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, 'bgClouds').setDisplaySize(1920, 1080)

    let ground = this.physics.add.staticImage(this.physics.world.bounds.width / 2, this.physics.world.bounds.height * 0.98, 'ground').setScale(1.05, 0.3).refreshBody()
    ground.body.setSize(ground.width * 1.1, ground.height * 0.25)

    // inicio criando plataformas e cristais
    this.platforms = this.physics.add.staticGroup()
    this.crystals = this.physics.add.staticGroup()
    this.platforms.add(ground)

    // array com posicoes das plataformas, tamanho de seus colisores e se devem ter cristais ou não
    const platformPositions = [
      // Level 1 – Altitude: 300px  (y = 1 – 300/7680 ≃ 0.9609)
      { x: 0.5, y: 0.9609, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 2 – Altitude: 700px  (y = 1 – 700/7680 ≃ 0.909)
      { x: 0.4, y: 0.909, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },
      { x: 0.6, y: 0.909, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 3 – Altitude: 1100px  (y ≃ 1 – 1100/7680 ≃ 0.8568)
      { x: 0.3, y: 0.8568, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },
      { x: 0.7, y: 0.8568, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },

      // Level 4 – Altitude: 1500px  (y ≃ 0.8047)
      { x: 0.5, y: 0.8047, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },
      { x: 0.8, y: 0.8047, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 5 – Altitude: 1900px  (y ≃ 0.7526)
      { x: 0.3, y: 0.7526, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },
      { x: 0.7, y: 0.7526, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 6 – Altitude: 2300px  (y ≃ 0.7005)
      { x: 0.4, y: 0.7005, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },
      { x: 0.8, y: 0.7005, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },

      // Level 7 – Altitude: 2700px  (y ≃ 0.6484)
      { x: 0.5, y: 0.6484, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },
      { x: 0.6, y: 0.6484, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 8 – Altitude: 3100px  (y ≃ 0.5964)
      { x: 0.3, y: 0.5964, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },
      { x: 0.7, y: 0.5964, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },

      // Level 9 – Altitude: 3500px  (y ≃ 0.5443)
      { x: 0.4, y: 0.5443, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },
      { x: 0.8, y: 0.5443, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 10 – Altitude: 3900px  (y ≃ 0.4922)
      { x: 0.5, y: 0.4922, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },
      { x: 0.7, y: 0.4922, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },

      // Level 11 – Altitude: 4300px  (y ≃ 0.44)
      { x: 0.6, y: 0.44, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },
      { x: 0.3, y: 0.44, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 12 – Altitude: 4700px  (y ≃ 0.3880)
      { x: 0.8, y: 0.3880, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },
      { x: 0.4, y: 0.3880, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },

      // Level 13 – Altitude: 5100px  (y ≃ 0.3360)
      { x: 0.5, y: 0.3360, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },
      { x: 0.7, y: 0.3360, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 14 – Altitude: 5500px  (y ≃ 0.2838)
      { x: 0.6, y: 0.2838, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },
      { x: 0.3, y: 0.2838, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },

      // Level 15 – Altitude: 5900px  (y ≃ 0.2318)
      { x: 0.4, y: 0.2318, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },
      { x: 0.8, y: 0.2318, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 16 – Altitude: 6300px  (y ≃ 0.1797)
      { x: 0.5, y: 0.1797, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },
      { x: 0.7, y: 0.1797, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 17 – Altitude: 6700px  (y ≃ 0.1276)
      { x: 0.6, y: 0.1276, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },
      { x: 0.3, y: 0.1276, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },

      // Level 18 – Altitude: 7100px  (y ≃ 0.0755)
      { x: 0.4, y: 0.0755, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4 },
      { x: 0.8, y: 0.0755, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, hasCrystal: true },

      // Level 19 – Plataforma final – Altitude: 7500px
      { x: 0.5, y: 0.0234, scaleX: 0.6, scaleY: 0.5, sizeX: 0.55, sizeY: 0.4, isEnd: true },
    ];

    for (let i = 0; i < platformPositions.length; i++) {
      let platform = this.physics.add.staticImage(
        this.physics.world.bounds.width * platformPositions[i].x,
        this.physics.world.bounds.height * platformPositions[i].y,
        'platform'
      ).setScale(platformPositions[i].scaleX, platformPositions[i].scaleY).refreshBody();

      platform.body.setSize(platform.width * platformPositions[i].sizeX, platform.height * platformPositions[i].sizeY);
      this.platforms.add(platform);

      if (platformPositions[i].hasCrystal) {
        let crystal = this.physics.add.staticImage(
          this.physics.world.bounds.width * platformPositions[i].x,
          this.physics.world.bounds.height * platformPositions[i].y - 80,
          'crystal'
        ).refreshBody();
        crystal.body.setSize(crystal.width * 0.5, crystal.height * 0.8);
        this.crystals.add(crystal);
      }

      if (platformPositions[i].isEnd) {
        this.physics.add.staticImage(this.physics.world.bounds.width * platformPositions[i].x, this.physics.world.bounds.height * platformPositions[i].y, 'platform')
          .setScale(platformPositions[i].scaleX, platformPositions[i].scaleY)
          .refreshBody();
      }
    }
    // finalizando criação de plataformas

    // criação do personagem
    this.player = this.physics.add.sprite(this.physics.world.bounds.width / 4, this.physics.world.bounds.height * 0.96, 'player')
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(80, 90)

    // criacao de animacoes
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 17 }),
      frameRate: 24,
      repeat: -1
    })

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', { start: 18, end: 35 }),
      frameRate: 14,
      repeat: -1
    })

    this.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers('player', { start: 36, end: 47 }),
      frameRate: 14,
      repeat: -1
    })

    this.anims.create({
      key: 'attack',
      frames: this.anims.generateFrameNumbers('player', { start: 54, end: 65 }),
      frameRate: 14,
      repeat: -1
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', { start: 72, end: 83 }),
      frameRate: 14,
      repeat: -1
    })
    // fim da criação de animacoes

    this.physics.add.collider(this.player, this.platforms, (player, platform) => {
      const lastPlatform = this.platforms.getChildren().slice(-1)[0];
      if (platform.y === lastPlatform.y) {
        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;

        this.add.rectangle(centerX, centerY, centerX, centerY, 0x000000)
          .setAlpha(0.5)
          .setInteractive()
          .on('pointerdown', () => this.scene.start('shop'));

        this.add.text(centerX, centerY, 'Você alcançou o topo!\nClique aqui para continuar', {
          fontSize: '48px',
          align: 'center',
          fill: '#ffffff',
          backgroundColor: '#00000077',
          padding: 10,
        }).setOrigin(0.5);
      }
    })

    this.physics.add.overlap(this.player, this.crystals, (player, crystal) => {
      this.crystals.remove(crystal, true)
      playerCoins.blue += 1
    })

    // configura a camera (zoom, limites e quem ela deve seguir)
    this.cameras.main.setZoom(1.3)
    this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height)
    this.cameras.main.startFollow(this.player)

    // Cria o grupo HUD (sem física)
    this.hud = this.add.group();

    // Cria o texto no canto superior esquerdo com a quantidade de cristais
    this.crystalText = this.add.text(
      this.cameras.main.worldView.x + 10,
      this.cameras.main.worldView.y + 10,
      "Cristais: " + playerCoins.blue, {
      fontSize: '32px',
      fill: '#fff'
    });

    // Adicionando botões de Sair e Pausar
    this.exitButton = this.add.text(
      this.cameras.main.worldView.x + this.cameras.main.worldView.width - 15,
      this.cameras.main.worldView.y + 15,
      'Sair', {
      fontSize: '32px',
      fill: '#ffffff',
      backgroundColor: '#ff4d4d',
      padding: { x: 10, y: 5 }
    }).setInteractive();

    this.exitButton.on('pointerdown', () => {
      this.scene.start('menu');
    });

    this.pauseButton = this.add.text(
      this.cameras.main.worldView.x + this.cameras.main.worldView.width - 315,
      this.cameras.main.worldView.y + 10,
      'Pausar', {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#4d79ff',
      padding: { x: 10, y: 5 }
    }).setInteractive();

    this.pauseButton.on('pointerdown', () => {
      this.scene.launch('pause'); // Inicia a cena de pausa
      this.scene.pause();              // Pausa a cena atual
    });

    // Adiciona os botões e placar ao grupo HUD
    this.hud.add(this.crystalText);
    this.hud.add(this.exitButton);
    this.hud.add(this.pauseButton);
  }

  update(time) {
    // atualiza o texto no canto superior esquerdo
    this.crystalText.x = this.cameras.main.worldView.x + 15;
    this.crystalText.y = this.cameras.main.worldView.y + 15;

    // atualiza o botão de sair no canto superior esquerdo
    this.exitButton.x = this.cameras.main.worldView.x + this.cameras.main.worldView.width - 115;
    this.exitButton.y = this.cameras.main.worldView.y + 15;

    // atualiza o botão de pausar no canto superior esquerdo
    this.pauseButton.x = this.cameras.main.worldView.x + this.cameras.main.worldView.width - 315;
    this.pauseButton.y = this.cameras.main.worldView.y + 15;

    // verifica se o personagem esta no chao
    let isGrounded = this.player.body.touching.down || this.player.body.blocked.down

    this.crystalText.setText("Cristais: " + playerCoins.blue);

    // movimentação horizontal
    if (this.cursors.a.isDown || this.cursors.leftArrow.isDown) {
      this.player.body.setVelocityX(-this.velocity)
      this.player.setFlipX(true)
    } else if (this.cursors.d.isDown || this.cursors.rightArrow.isDown) {
      this.player.body.setVelocityX(this.velocity)
      this.player.setFlipX(false)
    } else {
      this.player.body.setVelocityX(0)
    }

    // lógica de pulo e coyoteTime
    if (Phaser.Input.Keyboard.JustDown(this.cursors.w) || Phaser.Input.Keyboard.JustDown(this.cursors.upArrow)) {
      this.lastJumpPressTime = time
    }

    const withinCoyoteTime = time - this.lastGroundedTime < this.coyoteTime
    const withinJumpBuffer = time - this.lastJumpPressTime < this.jumpBufferTime

    if ((isGrounded || withinCoyoteTime) && withinJumpBuffer) {
      this.player.setVelocityY(-this.jumpForce)
      this.isJumping = true
      this.lastGroundedTime = 0
      this.lastJumpPressTime = 0
    }
    // fim da lógica de pulo e coyoteTime

    if (isGrounded) { // verifica se o usuario está no chão
      this.lastGroundedTime = time
      this.isJumping = false
      this.velocity = 280
    } else { // caso ele não esteja no chão (está pulando), altera a velocidade horizontal 
      this.velocity = 220
      this.isJumping = true
    }

    // animação do personagem
    if (this.isJumping) {
      this.player.anims.play('jump', true)
    } else if (this.cursors.a.isDown || this.cursors.d.isDown || this.cursors.leftArrow.isDown || this.cursors.rightArrow.isDown) {
      this.player.anims.play('run', true)
    } else {
      this.player.anims.play('idle', true)
    }
  }
}

