// Cena do Menu
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    // Carregar imagens para o menu
    this.load.image('background', 'fotos/background.png');
    this.load.image('playButton', 'fotos/playButton.png');
    this.load.image('settingsButton', 'fotos/settingsButton.png');
  }

  create() {
    // Adicionando o fundo que vai preencher a tela
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);  // Definir a origem no canto superior esquerdo
    background.setDisplaySize(this.game.config.width, this.game.config.height);  // Ajusta o fundo para preencher a tela

    // Adicionando o botão de jogar e reduzindo o tamanho para 25%
    const playButton = this.add.image(400, 250, 'playButton').setInteractive();
    playButton.setScale(0.25); // Reduzindo o tamanho do botão de jogar para 25% do tamanho original
    playButton.on('pointerdown', () => {
      this.scene.start('GameScene'); // Transição para a cena do jogo
    });

    // Adicionando o botão de configurações (muito menor e no canto superior esquerdo)
    const settingsButton = this.add.image(50, 50, 'settingsButton').setInteractive();
    settingsButton.setScale(0.1); // Diminui o tamanho do botão de configurações para 10% do tamanho original
    settingsButton.on('pointerdown', () => {
      this.scene.start('SettingsScene'); // Transição para a cena de configurações
    });

    // Instruções na tela
    this.add.text(200, 60, 'Bem-vindo ao Jogo Steve In WOODS!', { font: '32px Arial', fill: '#fff' });
    this.add.text(200, 500, 'Clique para Jogar ou Configurações', { font: '24px Arial', fill: '#fff' });
  }
}

// Cena do Jogo
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Carregar imagens do jogo
    this.load.image('player', 'fotos/player.png');
    this.load.image('background', 'fotos/background.png');
    this.load.image('plataforma', 'fotos/plataforma_tijolo.png'); // Carregar a imagem da plataforma
  }

  create() {
    // Adicionando o fundo que vai preencher a tela
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);  // Definir a origem no canto superior esquerdo
    background.setDisplaySize(this.game.config.width, this.game.config.height);  // Ajusta o fundo para preencher a tela

    // Criando a primeira plataforma (objeto estático maior)
    this.plataforma1 = this.physics.add.staticGroup();
    this.plataforma1.create(400, 550, 'plataforma'); // Criar a plataforma no meio da tela
    this.plataforma1.children.iterate((plataforma) => {
      plataforma.setScale(2); // Aumentando a plataforma para 200% do tamanho original
    });

    // Criando a segunda plataforma
    this.plataforma2 = this.physics.add.staticGroup();
    this.plataforma2.create(200, 400, 'plataforma'); // Criar a segunda plataforma
    this.plataforma2.children.iterate((plataforma) => {
      plataforma.setScale(1.5); // Aumentando a plataforma para 150% do tamanho original
    });

    // Adicionar o jogador
    this.player = this.physics.add.sprite(400, 500, 'player'); // Ajustando a posição inicial do jogador para cima da plataforma
    this.player.setScale(0.5); // Ajustando o tamanho da imagem do jogador para 50% do tamanho original

    // Configurar colisões do jogador com os limites da tela e as plataformas
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.plataforma1); // Colisão com a primeira plataforma
    this.physics.add.collider(this.player, this.plataforma2); // Colisão com a segunda plataforma

    // Definir a velocidade do jogador
    this.playerSpeed = 200;

    // Adicionar texto para instruções ou status
    this.add.text(20, 20, 'Jogo em andamento...', { font: '24px Arial', fill: '#fff' });

    // Configurar o controle do teclado
    this.cursors = this.input.keyboard.createCursorKeys();

    // Variáveis de estado do jogo
    this.gameOverText = null;
    this.playAgainButton = null;
    this.gameOver = false;
  }

  update() {
    // Verifica se o jogo já acabou
    if (this.gameOver) return;

    // Lógica de movimento baseada nas teclas do teclado (setas ou WASD)
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);  // Move para a esquerda
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);   // Move para a direita
    } else {
      this.player.setVelocityX(0);  // Parar movimento horizontal
    }

    // Movimento para cima e para baixo
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.playerSpeed);  // Move para cima
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.playerSpeed);   // Move para baixo
    } else {
      this.player.setVelocityY(0);  // Parar movimento vertical
    }

    // Pulo
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-400);  // Faz o jogador pular
    }

    // Verificar colisão do jogador com as bordas ou as plataformas
    if (this.player.body.touching.down || this.player.x <= 0 || this.player.x >= this.game.config.width) {
      this.gameOverHandler();
    }
  }

  gameOverHandler() {
    // Exibir mensagem de Game Over
    if (!this.gameOver) {
      this.gameOver = true;
      this.gameOverText = this.add.text(300, 250, 'GAME OVER', { font: '64px Arial', fill: 'red' });
      this.gameOverText.setOrigin(0.5, 0.5); // Centraliza o texto

      // Criar o botão "Jogar novamente"
      this.playAgainButton = this.add.text(300, 350, 'Jogar novamente', { font: '32px Arial', fill: '#fff' })
        .setInteractive();
      this.playAgainButton.setOrigin(0.5, 0.5);
      this.playAgainButton.on('pointerdown', () => {
        this.scene.restart(); // Reinicia a cena do jogo
      });
    }
  }
}

// Cena de Configurações
class SettingsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SettingsScene' });
  }

  preload() {
    // Carregar imagem para o fundo de configurações
    this.load.image('settingsBackground', 'https://example.com/path/to/your/settings-background.png');
  }

  create() {
    // Adicionar o fundo da tela de configurações
    this.add.image(400, 300, 'settingsBackground');

    // Adicionando título "Configurações"
    this.add.text(300, 50, 'Configurações', { font: '32px Arial', fill: '#fff' });

    // Adicionando o botão para aumentar o volume
    const increaseVolumeButton = this.add.text(300, 150, 'Aumentar Volume', { font: '24px Arial', fill: '#fff' })
      .setInteractive();
    increaseVolumeButton.on('pointerdown', () => {
      console.log('Volume Aumentado');
      // Aqui você pode adicionar um controle de volume real, se desejar
    });

    // Adicionando o botão para diminuir o volume
    const decreaseVolumeButton = this.add.text(300, 200, 'Diminuir Volume', { font: '24px Arial', fill: '#fff' })
      .setInteractive();
    decreaseVolumeButton.on('pointerdown', () => {
      console.log('Volume Diminuído');
      // Aqui você pode adicionar um controle de volume real, se desejar
    });

    // Botão para voltar ao menu
    const backButton = this.add.text(300, 350, 'Voltar ao Menu', { font: '24px Arial', fill: '#fff' })
      .setInteractive();
    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene'); // Volta para o menu
    });

    // Novo botão para sair do jogo
    const exitButton = this.add.text(300, 450, 'Sair do Jogo', { font: '24px Arial', fill: '#ff0000' })  // Texto em vermelho
      .setInteractive();
    exitButton.on('pointerdown', () => {
      this.sys.game.destroy(true); // Sair do jogo
    });
  }
}

// Configuração do Jogo
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MenuScene, GameScene, SettingsScene], // Adicionando a cena do jogo
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 2500 },  // Definindo a gravidade
      debug: false           // Desativando o debug
    }
  }
};

// Inicializando o jogo com a configuração
const game = new Phaser.Game(config);
