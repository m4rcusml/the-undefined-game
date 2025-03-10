// Cena de boas-vindas usando a biblioteca Phaser
class Welcome extends Phaser.Scene {
    constructor() {
        super({ key: 'bemVindo' });
    }

    // pré-carrega imagens, fundos, botões e formulários
    preload() {
        this.load.html("form", "form/form.html");
        this.load.image("play", "assets/play.png");
        this.load.image("tutorial", "assets/tutorial.png"); 
        this.load.image("background", "assets/backgroundBemVindo.png");
        this.load.image("docTutorial", "assets/docTutorial.png");
    }

    // Cria elementos visuais e configura a cena
    create() {
        // Configuração do fundo com efeito de movimento
        this.bgLayer = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background')
            .setOrigin(0, 0);
        
        this.add.rectangle(
            this.game.config.width / 2,
            this.game.config.height / 2,
            this.game.config.width,
            this.game.config.height,
            0x000000,
            0.6
        );
        
        // Define estilos de texto para uso em toda a cena
        const textStyle = { color: "#ffffff", fontSize: 20 };
        const titleStyle = {
            color: "#ffffff", 
            fontSize: 30, 
            fontStyle: "oblique",
            stroke: "#0d260d",
            strokeThickness: 6
        };
        
        // Adiciona o título do jogo com efeito de borda
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 5,
            "AS INSÍGNIAS DO DRAGÃO",
            titleStyle
        ).setOrigin(0.5);

        // mostra o texto de boas-vindas solicitando o nome do dragão
        this.message = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 - 100,
            "Bem vindo(a), dê um nome ao seu dragão:", 
            textStyle
        ).setOrigin(0.5);

        // adiciona formulário para entrada do nome do dragão
        this.inputName = this.add.dom(
            this.game.config.width / 2,
            this.game.config.height / 2 - 30
        ).createFromCache('form').setOrigin(0.5, 0.5);

        // cria botão de confirmação do nome
        const buttonBg = this.add.rectangle(
            this.game.config.width / 2 + 140,
            this.game.config.height / 2 - 30, 
            50, 45, 0x4aa5dc, 1
        ).setOrigin(0.5).setInteractive();
        
        // adiciona texto ao botão de confirmação
        this.add.text(
            this.game.config.width / 2 + 140,
            this.game.config.height / 2 - 30,
            "Ir", 
            { fontSize: 30, color: "#ffffff" }
        ).setOrigin(0.5);
        
        // evento para o botão de confirmação
        buttonBg.on('pointerdown', () => this.updateName(this.inputName));

        // Adiciona tecla Enter como alternativa para confirmar o nome
        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.returnKey.on("down", () => this.updateName(this.inputName));
        // Variável para controlar se o nome foi preenchido
        this.nameFilled = false;
        
        // Cria o botão de jogar
        this.playBt = this.createButton(
            this.game.config.width / 2 - 80,
            this.game.config.height / 2 + 100,
            'play',
            "Jogar",
            () => {
                // Inicia o jogo apenas se o nome estiver preenchido
                if (this.nameFilled) {
                    this.game.highScore = 0;
                    this.scene.start('DragaoLevel1', this.game);
                }
            }
        );
        
        // Cria o botão de tutorial
        this.tutorialBt = this.createButton(
            this.game.config.width / 2 + 80,
            this.game.config.height / 2 + 100,
            'tutorial',
            "Tutorial",
            () => this.scene.start('Tutorial', this.game)
        );
        
        // Inicialmente esconde os botões até que o nome seja preenchido
        this.playBt.image.setVisible(false);
        this.playBt.text.setVisible(false);
        this.tutorialBt.image.setVisible(false);
        this.tutorialBt.text.setVisible(false);
    }
    
    // cria um botão com imagem e texto
    createButton(x, y, imageKey, text, callback) {
        const image = this.add.image(x, y, imageKey)
            .setScale(0.25)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', callback)
            .on('pointerover', function() { this.setScale(0.275); }) // Aumenta tamanho ao passar o mouse
            .on('pointerout', function() { this.setScale(0.25); });  // Restaura tamanho normal
            
        // Adiciona texto abaixo do botão
        const textObj = this.add.text(
            x, y + 50, text,
            { color: "#ffffff", fontSize: 20 }
        ).setOrigin(0.5);
        
        return { image, text: textObj };
    }

    // Atualiza o nome do dragão e exibe os botões principais
    updateName(inputNameElement) {
        let name = inputNameElement.getChildByName("name");
        if (name.value != "") {
            // atualiza o texto de mensagem com o nome do jogador
            this.message.setText("Olá, " + name.value + "! Pronto para a aventura?");
            
            // Mostra os botões de jogo e tutorial
            this.playBt.image.setVisible(true);
            this.playBt.text.setVisible(true);
            this.tutorialBt.image.setVisible(true);
            this.tutorialBt.text.setVisible(true);
            
            // marca que o nome foi preenchido e salva na variável global
            this.nameFilled = true;
            this.game.name = name.value;
        }
    }
    
    // atualiza a cena a cada frame
    update() {
        this.bgLayer.tilePositionX += 0.3;
    }
}

//utiliza cena tutorial
class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'Tutorial' });
    }
    
    // Carrega imagens
    preload() {
        this.load.image("docTutorial", "assets/docTutorial.png");
        this.load.image("background", "assets/backgroundBemVindo.png");
    }
    // cria elementos visuais
    create() {
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.game.config.width, this.game.config.height);
        
        this.add.image(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'docTutorial'
        ).setScale(0.8).setOrigin(0.5);
        
        // Adiciona botão para voltar à tela inicial
        const buttonBg = this.add.rectangle(
            this.game.config.width / 2,
            this.game.config.height - 50,
            100, 40, 0x4aa5dc, 1
        ).setOrigin(0.5).setInteractive();
        
        // texto do botão de voltar
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height - 50,
            "Voltar",
            { fontSize: 20, color: "#ffffff" }
        ).setOrigin(0.5);
        
        // cria evento para retornar à tela de boas-vindas
        buttonBg.on('pointerdown', () => this.scene.start('bemVindo'));
    }
}