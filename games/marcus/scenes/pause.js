class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'pause' });
  }

  create() {
    // adiciona um "filtro escuro" para que seja possivel diferenciar o jogo pausado e despausado
    this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000).setAlpha(0.6).setOrigin(0);

    // adiciona um texto dizendo que o jogo está pausado
    this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 100, 'Jogo Pausado', { fontSize: '48px', color: '#fff' }).setOrigin(0.5);

    // adiciona o botão de despausar
    const resumeButton = this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 50, 'Retomar', { fontSize: '32px', color: '#fff' })
      .setOrigin(0.5)
      .setInteractive();

    resumeButton.on('pointerdown', () => {
      this.scene.stop(); // Para a cena de pausa
      this.scene.resume('game'); // Retoma o jogo
    });
  }
}