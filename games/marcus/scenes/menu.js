class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'menu' }) // Define a chave da cena como 'menu'
  }

  preload() {
    // Carrega as imagens de fundo para o menu
    this.load.image('bg', 'assets/bg/clouds5/1.png')
    this.load.image('clouds', 'assets/bg/clouds5/5.png')
    this.load.image('minorClouds', 'assets/bg/clouds5/3.png')
    this.load.image('details', 'assets/details.png')
  }

  create() {
    // Adiciona o fundo da cena do menu
    this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'bg').setScale(3.5)
    this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'clouds').setScale(3.5)

    // adiciona os detalhes com os controles e o objetivo do jogo
    this.add.image(450, this.game.config.height - 150, 'details')
    
    // Adiciona o título do menu principal
    this.add.text(this.game.config.width / 2, this.game.config.height * 0.23, 'Crystal Grabber', {
      fontSize: '80px',
      fill: '#ffffff',
      backgroundColor: '#00000077',
      padding: 10,
    }).setOrigin(0.5)

    // Cria um container para os botões
    const buttons = this.add.container(this.game.config.width / 2, this.game.config.height * 0.5)

    // Adiciona o botão de "Play"
    const playButton = this.add.text(0, -40, 'Play', {
      fontSize: '48px',
      fill: '#ffffff',
      backgroundColor: '#00000077',
      padding: { left: 200, right: 200, top: 25, bottom: 25 },
      interactive: true,
    }).setOrigin(0.5).setInteractive()
    // Adiciona interatividade ao botão de "Play"
    .on('pointerdown', () => this.scene.start('game')) // Inicia a cena do jogo
    .on('pointerover', () => playButton.setStyle({ fill: '#ffff00' })) // Muda a cor ao passar o mouse
    .on('pointerout', () => playButton.setStyle({ fill: '#ffffff' })) // Restaura a cor original

    // Adiciona o botão de "Buy"
    const buyButton = this.add.text(0, 100, 'Buy', {
      fontSize: '48px',
      fill: '#ffffff',
      backgroundColor: '#00000077',
      padding: { left: 200, right: 200, top: 25, bottom: 25 },
      interactive: true,
    }).setOrigin(0.5).setInteractive()
    // Adiciona interatividade ao botão de "Buy"
    .on('pointerdown', () => this.scene.start('shop')) // Inicia a cena da loja
    .on('pointerover', () => buyButton.setStyle({ fill: '#ffff00' })) // Muda a cor ao passar o mouse
    .on('pointerout', () => buyButton.setStyle({ fill: '#ffffff' })) // Restaura a cor original

    // Adiciona os botões ao container
    buttons.add([playButton, buyButton])
  }
}
