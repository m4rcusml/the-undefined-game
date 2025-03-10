class StartScene extends Phaser.Scene {
	constructor(){
		super({ key: 'StartScene' }) // Define a chave para esta cena
	}

	preload() {
		// Carregar imagem de fundo
		this.load.image('bg', 'assets/bg-fundomar.jpg');
	}

	create() {
		// Adicionar imagem de fundo
		this.add.image(widthGame/2, heightGame/2, 'bg').setScale(3);

		// Adicionar texto de "Clique para começar"
		this.add.text(650, 200, 'Clique para começar', { fontSize: '60px', fill: '#31E981', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'  });
		this.add.text(200, 300, 'Use as setas para mover o peixe para ', { fontSize: '60px', fill: '#0f0', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'  });
		this.add.text(200, 350, 'cima, baixo, direita e esquerda', { fontSize: '60px', fill: '#0f0', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'  });
		this.add.text(200, 450, 'Colete as conchas e não deixe ', { fontSize: '60px', fill: '#0f0', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'  });
		this.add.text(200, 500, 'a pontuação chegar a 0!', { fontSize: '60px', fill: '#0f0', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'  });
		this.add.text(200, 600, 'Você terá, de início, 3 pontos, ganhe mais pontos ', { fontSize: '60px', fill: '#0f0', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'  });
		this.add.text(200, 650, 'coletando as conchas antes delas cairem no chão', { fontSize: '60px', fill: '#0f0' , fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

		// Iniciar o jogo ao clicar na tela
		this.input.on('pointerdown', () => {
			this.scene.stop('StartScene');
			this.scene.start('GameScene1');
		});
	}

	update() {
		// Função de atualização vazia
	}
}