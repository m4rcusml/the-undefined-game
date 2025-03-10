class Shop extends Phaser.Scene {
  constructor() {
    // O construtor da cena é chamado apenas uma vez, quando a cena é criada.
    super({ key: 'shop' })
  }

  preload() {
    // Carrega a imagem de fundo da loja.
    this.load.image('bgShop', 'assets/bg/merchantShop.jpg')
  }

  create() {
    // Cria a imagem de fundo da loja e define sua posição e tamanho.
    this.bgShop = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'bgShop')
    this.title = this.add.text(
      this.game.config.width / 2,
      this.game.config.height * 3,
      'Shop',
      { fontSize: '48px', fill: '#ffffff', backgroundColor: '#00000077', padding: 10 }
    ).setOrigin(0.5)

    // Cria um texto com as instruções.
    this.subtitle = this.add.text(
      this.game.config.width / 2,
      this.game.config.height * 2,
      'Seu objetivo é comprar todos os itens',
      { fontSize: '24px', fill: '#ffffff', backgroundColor: '#00000077', padding: 10 }
    ).setOrigin(0.5)

    // Define um zoom para a câmera
    this.cameras.main.setZoom(1.5)

    this.cameras.main.setBounds(0, 0, this.game.config.width, this.game.config.height)
    this.physics.world.setBounds(0, 0, this.bgShop.width, this.bgShop.height)

    // Cria as áreas selecionáveis.
    this.createSelectableArea(0.12, 0.4, 250, 250, 'potion', 'Poção')
    this.createSelectableArea(0.34, 0.56, 250, 250, 'map', 'Mapa')
    this.createSelectableArea(0.5, 0.58, 180, 250, 'ring', 'Anel')
    this.createSelectableArea(0.61, 0.58, 180, 250, 'necklace', 'Colar')
    this.createSelectableArea(0.78, 0.5, 200, 250, 'book', 'Livro')
    this.createSelectableArea(0.94, 0.45, 250, 250, 'scrolls', 'Pergaminhos')

    // Adiciona o botão de Sair
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
      // Volta para a cena de menu.
      this.scene.start('menu');
    });

    // Adicionando a quantidade de cristais
    this.crystalsText = this.add.text(
      this.game.config.width / 2,
      this.game.config.height * 2,
      'Cristais: ' + playerCoins.blue,
      { fontSize: '32px', fill: '#ffffff', backgroundColor: '#00000077', padding: 10 }
    ).setOrigin(0.5)
  }

  update() {
    // atualiza o botão de sair no canto superior esquerdo
    this.exitButton.x = this.cameras.main.worldView.x + this.cameras.main.worldView.width - 115;
    this.exitButton.y = this.cameras.main.worldView.y + 15;

    // atualiza o texto no canto superior esquerdo
    this.crystalsText.x = this.cameras.main.worldView.x + 130;
    this.crystalsText.y = this.cameras.main.worldView.y + 45;

    // atualiza o titulo e subtitulo no canto superior central
    this.title.x = this.cameras.main.worldView.x + this.cameras.main.worldView.width / 2;
    this.title.y = this.cameras.main.worldView.y + 35;
    this.subtitle.x = this.cameras.main.worldView.x + this.cameras.main.worldView.width / 2;
    this.subtitle.y = this.cameras.main.worldView.y + 95;

    // Obtém o cursor ativo e converte suas coordenadas de tela para coordenadas do mundo
    const pointer = this.input.activePointer
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y)

    // Posição atual (centro) da câmera
    const cam = this.cameras.main
    const currentX = cam.midPoint.x
    const currentY = cam.midPoint.y

    // Posição alvo: a posição do cursor no mundo
    const targetX = worldPoint.x
    const targetY = worldPoint.y

    // Fator de interpolação (quanto menor, mais lento o movimento)
    const lerpFactor = 0.03

    // Calcula a nova posição central da câmera interpolando entre a posição atual e a posição alvo
    const newCenterX = Phaser.Math.Linear(currentX, targetX, lerpFactor)
    const newCenterY = Phaser.Math.Linear(currentY, targetY, lerpFactor)

    // Atualiza a câmera para seguir a posição do cursor
    cam.centerOn(newCenterX, newCenterY)
  }

  // função para criar uma área selecionável para comprar os itens
  createSelectableArea(xPercent, yPercent, width, height, objectEntry, objectName) {
    // adiciona e posiciona um container com base no tamanho da imagem de fundo da loja
    let selectableArea = this.add.rectangle(this.bgShop.width * xPercent, this.bgShop.height * yPercent, width, height, 0x000000).setAlpha(0.7)
    // adiciona textos dentro do container como nome do item e preço
    this.add.text(selectableArea.x, selectableArea.y - 70, objectName, { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5)
    this.add.text(selectableArea.x, selectableArea.y, 'Preço: ' + shop[objectEntry].price, { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5)

    if (shop[objectEntry].isBought) { // verifica se o item ja foi comprado
      // se sim, adiciona um botão inativo com o texto "Comprado"
      this.add.text(selectableArea.x, selectableArea.y + 70, 'Comprado', { fontSize: '24px', fill: '#ffffff', backgroundColor: '#808080', padding: 20 }).setOrigin(0.5)
    } else {
      // senão adiciona um botão ativo com o texto "Comprar"
      const buyButton = this.add.text(
        selectableArea.x,
        selectableArea.y + 70,
        'Comprar',
        { fontSize: '24px', fill: '#ffffff', backgroundColor: '#00ff00', padding: 20 }
      ).setOrigin(0.5)

      buyButton.setInteractive()
      buyButton.on('pointerdown', () => {
        // verifica se o player possui cristais suficientes para comprar
        if (playerCoins.blue >= shop[objectEntry].price) {
          playerCoins.blue -= shop[objectEntry].price
          shop[objectEntry].isBought = true
          this.scene.restart('shop')
        }
        else {
          const noCoinsText = this.add.text(
            this.cameras.main.worldView.x + this.cameras.main.worldView.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.worldView.height / 2,
            'Você não possui cristais suficientes',
            { fontSize: '24px', fill: '#ffffff', backgroundColor: '#ff0000', padding: 10 }
          ).setOrigin(0.5)

          this.time.delayedCall(2000, () => {
            noCoinsText.destroy()
          })
        }
      })
    }
  }
}
