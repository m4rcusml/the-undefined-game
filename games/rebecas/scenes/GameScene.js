class GameScene1 extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScene1' }) // Define a chave para esta cena
	}

	preload() {
		// Carregar imagens e spritesheets
		this.load.image('bg', 'assets/bg-fundomar.jpg');
		this.load.image('plataforma', 'assets/plat.png');
		this.load.image('plataforma2', 'assets/plat.png');
		this.load.image('concha', 'assets/concha1.png');
		this.load.spritesheet('peixe', 'assets/sprite-peixe.png',  { frameWidth: 256, frameHeight: 256 });
	}

	create() {
		// Adicionar imagem de fundo
		this.add.image(widthGame/2, heightGame/2, 'bg').setScale(3);

		// Adicionar plataformas
		this.plataforma = this.physics.add.staticImage(700, 800, 'plataforma').setScale(1);
		this.plataforma2 = this.physics.add.staticImage(widthGame/2, 1230, 'plataforma2').setScale(3.5);
		this.plataforma2.body.setSize(5000, 630);

		// Adicionar sprite do jogador e configurar física
		this.player = this.physics.add.sprite(300, 500, 'peixe').setScale(0.7);
		this.player.body.setSize(230, 150);
		this.player.body.setCollideWorldBounds(true);

		// Criar animação do jogador
		this.anims.create({
			key: 'nadar',
			frames: this.anims.generateFrameNumbers('peixe', { start: 0, end: 5 }),
			frameRate: 8,
			repeat: -1
		});
		this.player.anims.play('nadar', true);

		// Criar teclas de cursor para movimento do jogador
		this.cursors = this.input.keyboard.createCursorKeys();

		// Adicionar colisão entre jogador e plataformas
		this.physics.add.collider(this.player, this.plataforma);
		this.physics.add.collider(this.player, this.plataforma2);

		// Definir limites do mundo
		this.physics.world.setBounds(0, 0, widthGame, heightGame);

		// Criar grupo para conchas
		this.conchas = this.physics.add.group();

		// Adicionar conchas iniciais
		this.adicionarConchas(3);

		// Inicializar pontuação e exibi-la
		this.pontuacao = 3;
		this.placar = this.add.text(50, 80, 'Conchas:' + this.pontuacao, { fontSize: '45px', fill: '#495613' });

		// Adicionar detecção de sobreposição entre jogador e conchas
		this.physics.add.overlap(this.player, this.conchas, this.coletarConcha, null, this);
	}

	adicionarConchas(qtd) {
		// Adicionar número especificado de conchas
		for (let i = 0; i < qtd; i++) {
			let posicaoX = Phaser.Math.RND.between(50, widthGame - 50);
			let posicaoY = Phaser.Math.RND.between(50, heightGame - 50);
			let novaConcha = this.conchas.create(posicaoX, posicaoY, 'concha').setScale(0.2);

			// Configurar física para concha
			novaConcha.setCollideWorldBounds(true);
			novaConcha.setBounce(0.7);
			this.physics.add.collider(novaConcha, this.plataforma);
			this.physics.add.collider(novaConcha, this.plataforma2, (concha) => {
				concha.destroy(); // Remover concha ao colidir com plataforma2
				if (this.pontuacao > 0) {
					this.pontuacao--;
				}
				this.placar.setText('Conchas: ' + this.pontuacao);
			});
		}
	}

	coletarConcha(player, concha) {
		concha.destroy(); // Remover concha coletada

		// Atualizar pontuação
		this.pontuacao++;
		this.placar.setText('Conchas: ' + this.pontuacao);

		// Adicionar 2 novas conchas
		this.adicionarConchas(2);
	}

	update() {
		// Controlar movimento do jogador
		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-500);
			this.player.anims.play('nadar', true);
			this.player.setFlipX(true);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(500);
			this.player.anims.play('nadar', true);
			this.player.setFlipX(false);
		} else {
			this.player.setVelocityX(0);
			this.player.anims.play('nadar', true);
		}

		if (this.cursors.up.isDown) {
			this.player.setVelocityY(-500);
			this.player.anims.play('nadar', true);
		} else if (this.cursors.down.isDown) {
			this.player.setVelocityY(500);
			this.player.anims.play('nadar', true);
		} else {
			this.player.anims.play('nadar', true);
		}

		// Verificar condição de fim de jogo
		if (this.pontuacao == 0) {
			this.scene.stop('GameScene1');
			this.scene.start('EndGame');
		}
	}
}
