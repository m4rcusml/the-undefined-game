// variavel global para guardar a quantidade de cristais coletados
var playerCoins = {
  blue: 0,
  // abre a possibilidade de ter outros tipos de moeda
}

// variavel global para guardar os itens da loja, seus preços e se eles já foram comprados
var shop = {
  ring: {
    price: 10,
    isBought: false
  },
  map: {
    price: 20,
    isBought: false
  },
  necklace: {
    price: 15,
    isBought: false
  },
  book: {
    price: 30,
    isBought: false
  },
  scrolls: {
    price: 50,
    isBought: false
  },
  potion: {
    price: 40,
    isBought: false
  }
}

// configurações gerais do jogo
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 630 },
      debug: false
    }
  },
  scene: [Menu, Game, Shop, PauseScene] // todas as cenas do jogo
};

const game = new Phaser.Game(config);
