const widthGame = 1920; // Largura do jogo
const heightGame = 1080; // Altura do jogo

// Configurações iniciais do Phaser como resolução, gravidade, cenas, etc.
const config = {
  type: Phaser.AUTO,
  width: widthGame,
  height: heightGame,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 200 }, // Define a gravidade no eixo y
      debug: false // Mostra a caixinha de colisão dos objetos
    }
  },
  // Adiciona as cenas que serão usadas
  scene: [StartScene, GameScene1, EndGame],
};

// Cria a instância do jogo
const game = new Phaser.Game(config);

/*var rect = new Phaser.Geom.Rectangle(widthGame/2, heightGame/2, widthGame, heightGame);*/

