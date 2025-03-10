class Dragao extends Phaser.Scene {

    // Define a cena
    constructor() {
        super({
            key: 'DragaoLevel1',
        });
    }

    init(data) {
        console.log("DragaoLevel1 inicializado");
        this.gameData = data;
    }

    //carrega as imagens, fundos, botões e personagens
    preload() {
        console.log("Preload na cena DragaoLevel1");
        this.load.image('floresta', 'assets/backgroundF.png');
        this.load.image('ground', 'assets/plataforma.png');
        this.load.image('galho', 'assets/galho.png');
        this.load.image('poderAgua', 'assets/agua.png');
        this.load.image('kripto', 'assets/kriptonita.png');
        this.load.image('vermelho', 'assets/poder.png');
        this.load.spritesheet('dragao', 
            'assets/dragao.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.image('telaVitoria', 'assets/telaVitoria.png');
        this.load.image('telaDerrota', 'assets/telaDerrota.png');
        this.load.image('botaoMenu', 'assets/botaoMenu.png');
        this.load.image('indicadorAgua', 'assets/agua.png');
        this.load.image('indicadorKripto', 'assets/kriptonita.png');
        this.load.image('indicadorVermelho', 'assets/poder.png');
    }

    create() {
        console.log("Inicia a cena Dragao"); 
        this.score = 0;
        this.gameOver = false;
        
        // Define a gravidade do mundo
        this.physics.world.gravity.y = 300;
        
        // Cria o cenário
        this.add.image(300, 300, 'floresta').setScale(0.7);

        // Adiciona as plataformas e galhos
        this.plataforma = this.physics.add.staticGroup();
        this.plataforma.create(400, 550, 'ground').setScale(2).refreshBody(); 
        this.plataforma.create(250, 380, 'ground'); 
        this.plataforma.create(50, 250, 'ground');
        this.plataforma.create(400, 100, 'ground');
        this.galho = this.physics.add.staticGroup();  
        this.galho.create(350, 240, 'galho').setScale(1.0).refreshBody();
        this.galho.create(200, 140, 'galho').setScale(1.0).refreshBody();
        this.galho.create(500, 300, 'galho').setScale(1.0).refreshBody();

        // Adiciona o jogador dragão
        this.player = this.physics.add.sprite(100, 450, 'dragao').setScale(1.5);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.1); 
        
        this.player.body.setSize(25, 40); // Ajusta a hitbox
        this.player.body.setOffset(4, 4); // Ajusta offset da hitbox

        // Adiciona a kriptonita  
        this.kripto = this.physics.add.staticGroup();
        this.kripto.create(50, 220, 'kripto').setScale(0.3).refreshBody();
        this.kripto.create(370, 210, 'kripto').setScale(0.3).refreshBody();

        // Adiciona a insignia vermelha
        this.vermelho = this.physics.add.staticGroup();
        this.vermelho.create(480, 260, 'vermelho').setScale(0.4);
        this.poder = this.physics.add.staticGroup();

        // adiciona colisões e overlaps
        this.physics.add.collider(this.kripto, this.plataforma);
        this.physics.add.collider(this.kripto, this.galho);
        this.physics.add.overlap(this.player, this.kripto, this.collectKripto, null, this);
        
        this.physics.add.collider(this.vermelho, this.plataforma);
        this.physics.add.collider(this.vermelho, this.galho);
        this.physics.add.overlap(this.player, this.vermelho, this.collectVermelho, null, this);
        
        this.physics.add.collider(this.galho, this.plataforma);
        this.playerCollider = this.physics.add.collider(this.player, this.plataforma);
        this.physics.add.collider(this.player, this.galho);

        // adiciona animações do personagem pela sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dragao', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dragao', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dragao', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // adiciona as insignias de água
        this.poderAgua = this.physics.add.group({
            allowGravity: false // Evitar que as insignias caiam
        });
        
        // define as posições das insignias de água
        const posicoes = [
            {x: 100, y: 100}, {x: 200, y: 50}, {x: 350, y: 70}, 
            {x: 450, y: 140}, {x: 150, y: 200}, {x: 300, y: 180},
            {x: 400, y: 250}, {x: 80, y: 330}, {x: 250, y: 300},
        ];
        
        // deixar as insignias de água no cenário
        posicoes.forEach(pos => {
            const poder = this.poderAgua.create(pos.x, pos.y, 'poderAgua');
            poder.setScale(0.3);
            poder.body.allowGravity = false;
        });
        //adiciona as fisicas de colisão e overlaps nas insignias
        this.physics.add.collider(this.poderAgua, this.plataforma);
        this.physics.add.collider(this.poderAgua, this.galho);
        this.physics.add.overlap(this.player, this.poderAgua, this.collectInsigniaA, null, this);
        
        // adiciona pontuação
        this.scoreText = this.add.text(
            this.cameras.main.width / 2, 
            16, 
            'Força: 0', 
            { 
                fontSize: '32px', 
                fill: '#0d260d',
                fontStyle: 'oblique'
            }
        );
        // Define posição da pontuação
        this.scoreText.setOrigin(0.5, 0);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.criarLegendaPontuacao();
    }

    // cria quadro de informação de pontuação
    criarLegendaPontuacao() {
        const legendaBackground = this.add.rectangle(
            70, 
            85, 
            120, 
            110, 
            0x000000, 
            0.5
        );

        this.add.text(
            70,
            40,
            'Pontuação',
            {
                fontSize: '14px',
                fill: '#ffffff',
                fontStyle: 'oblique'
            }
        ).setOrigin(0.5);

        // informação da insígnia azul
        const indicadorAgua = this.add.image(
            30,
            60,
            'indicadorAgua'
        ).setScale(0.15);
        
        this.add.text(
            50,
            60,
            '+10',
            {
                fontSize: '14px',
                fill: '#ffffff'
            }
        ).setOrigin(0, 0.5);

        // informação da kriptonita
        const indicadorKripto = this.add.image(
            30,
            85,
            'indicadorKripto'
        ).setScale(0.15);
        
        this.add.text(
            50,
            85,
            '-50',
            {
                fontSize: '14px',
                fill: '#ff0000'
            }
        ).setOrigin(0, 0.5);

        // informação do poder vermelho
        const indicadorVermelho = this.add.image(
            30,
            110,
            'indicadorVermelho'
        ).setScale(0.2);
        
        this.add.text(
            50,
            110,
            '+80',
            {
                fontSize: '14px',
                fill: '#00ff00'
            }
        ).setOrigin(0, 0.5);
    }

    // atualiza a cena
    update() {
        if (this.score >= 100) {
            // define pontuação de vitória e a executa
            if (!this.gameOver) {
                this.showVictoryScreen();
            }
            return;
        } else if (this.score <= -1) {
            // define pontuação de derrota e a executa
            if (!this.gameOver) {
                this.showDefeatScreen();
            }
            return;
        }
        
        if (this.gameOver) {
            return;
        }
        
        // controla os movimentos do jogador
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        
        // ajusta pulo do jogador
        const canJump = this.player.body.touching.down || 
                       this.player.body.blocked.down || 
                       this.player.body.onFloor();
        if (this.cursors.up.isDown && canJump) {
            this.player.setVelocityY(-350);
        }
    }

   //cria funçao para contar pontuação do poder de água coletado
    collectInsigniaA(player, poderAgua) {
        poderAgua.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Força: ' + this.score);
    }
    
    // faz o mesmo para a kriptonita
    collectKripto(player, kripto) {
        kripto.disableBody(true, true);

        this.score -= 50;
        this.scoreText.setText('Força: ' + this.score);
    }
    
    // Faz o mesmo para a insignia vermelha
    collectVermelho(player, vermelho) {
        vermelho.disableBody(true, true);

        this.score += 80;
        this.scoreText.setText('Força: ' + this.score);
    }
    
    // função que mostra tela de vitória
    showVictoryScreen() {
        this.gameOver = true;
        this.player.setVelocity(0, 0);
        
        const overlay = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.7
        );
        
        // Adiciona tela e texto de vitória
        const victory = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'telaVitoria'
        ).setScale(0.8);
        
        const victoryText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 50,
            'Parabéns! Você venceu!',
            {
                fontSize: '28px',
                fill: '#fff',
                fontStyle: 'oblique',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // Adiciona botão para voltar ao menu
        const menuButton = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 120,
            180,
            50,
            0x4a752c
        ).setInteractive();
        
        const menuText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 120,
            'Voltar ao Menu',
            {
                fontSize: '15px',
                fill: '#fff',
                fontStyle: 'oblique'
            }
        ).setOrigin(0.5);
        
       // cria evento para o botão de menu
        menuButton.on('pointerdown', () => {
            this.scene.start('bemVindo');
        });
    }
    
    // adiciona função de tela e texto de derrota
    showDefeatScreen() {
        this.gameOver = true;
        this.player.setVelocity(0, 0);
        
        const overlay = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.7
        );
        
        // adiciona tela e texto de derrota
        const defeat = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'telaDerrota'
        ).setScale(0.8);
        
        const defeatText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 50,
            'Você perdeu!',
            {
                fontSize: '28px',
                fill: '#fff',
                fontStyle: 'oblique',
                align: 'center'
            }
        ).setOrigin(0.5);
        
        // adicionar botão para tentar jogar novamente
        const retryButton = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 120,
            180,
            50,
            0x4a752c
        ).setInteractive();
        
        const retryText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 120,
            'Tentar Novamente',
            {
                fontSize: '15px',
                fill: '#fff',
                fontStyle: 'oblique'
            }
        ).setOrigin(0.5);
        
        // Adicionar evento ao botão de tentar novamente
        retryButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }
}