const widthGame = 1920
const heightGame = 1080

// configurações iniciais do phaser como resolução, gravidade, cenas, etc
const config = {
  type: Phaser.AUTO,
  width: widthGame,
  height: heightGame,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 700 }, // isso aqui define a gravidade no eixo y
      debug: true // isso aqui mostra a caixinha de colisão dos objetos
    }
  },
  // isso adiciona as cenas que serão usadas
  scene: [MenuScene, OptionsScene, PlataformScene, LevelSelectorScene, TemplateScene],
};

// cria a instância do jogo
const game = new Phaser.Game(config);
