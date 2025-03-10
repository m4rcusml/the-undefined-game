class EndGame extends Phaser.Scene {
	constructor(){
		super({ key: 'EndGame' }) // Define a chave para esta cena
	}

	preload() {
		// Carregar imagem de fundo
		this.load.image('bg', 'assets/bg-fundomar.jpg');
	}

	create() {
		// Adicionar imagem de fundo
		this.add.image(widthGame/2, heightGame/2, 'bg').setScale(3);

		// Adicionar texto de "Game Over"
		this.add.text(780, heightGame/2, 'Game Over', { fontSize: '70px', fill: '#0f0', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
		this.add.text(800, 600, 'Clique para reiniciar', { fontSize: '70px', fill: '#0f0', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

		// Reiniciar o jogo ao clicar na tela
		this.input.on('pointerdown', () => {
			this.scene.stop('EndScene');
			this.scene.start('StartScene');
		});
	}

	update() {
		// Função de atualização vazia
	}
}