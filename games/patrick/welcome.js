<body>
    <script>
        const larguraJogo = 700;
        const alturaJogo = 850;

        const config = {
            type: Phaser.AUTO,
            width: larguraJogo,
            height: alturaJogo,

            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: true 
                }
            },

            scene: {
                preload: preload,
                create: create,
                update: update
            }
        };

        const game = new Phaser.Game(config);

        var alien;
        var teclado;
        var fogo;
        var plataforma;
        var moeda;
        var pontuacao = 0;
        var placar;


        function preload() {
            this.load.image('background', 'assets/bg.png');
            this.load.image('player', 'assets/alienigena.png');
            this.load.image('turbo_nave', 'assets/turbo.png');
            this.load.image('plataforma_tijolo', 'assets/tijolos.png');
            this.load.image('moeda', 'assets/moeda.png');
        }

        function create() {
            this.add.image(larguraJogo/2, alturaJogo/2, 'background');
            
            fogo = this.add.sprite(0, 0, 'turbo_nave');
            fogo.setVisible(false);

            alien = this.physics.add.sprite(larguraJogo/2, 0, 'player');
            alien.setCollideWorldBounds(true);
            teclado = this.input.keyboard.createCursorKeys();

            plataforma = this.physics.add.staticImage(larguraJogo/2, alturaJogo/2, 'plataforma_tijolo');
            this.physics.add.collider(alien, plataforma);

            moeda = this.physics.add.sprite(larguraJogo/2, 0, 'moeda');
            moeda.setCollideWorldBounds(true);
            moeda.setBounce(0.7);
            this.physics.add.collider(moeda, plataforma);

            placar = this.add.text(50, 50, 'Moedas:'+ pontuacao, {fontSize:'45px', fill:'#495613'});

            this.physics.add.overlap(alien, moeda, function(){

                moeda.setVisible(false);
                var posicaoMoeda_Y = Phaser.Math.RND.between(50, 650);
                moeda.setPosition(posicaoMoeda_Y, 100);
                pontuacao +=1;
                placar.setText('Moedas:' + pontuacao); 
                moeda.setVisible(true); 
            });

        }


        function update() {

            if (teclado.left.isDown) {
                alien.setVelocityX(-400); } 
          
            else if (teclado.right.isDown) {
                alien.setVelocityX(400); } 

            else { alien.setVelocityX(0); }

            if (teclado.up.isDown) {
                alien.setVelocityY(-400);
                ativarTurbo();
            } 
            
            else { semTurbo(); }

            fogo.setPosition(alien.x, alien.y + alien.height/2);

        }


        function ativarTurbo() {
            fogo.setVisible(true);
        }

        function semTurbo() {
            fogo.setVisible(false);
        }


    </script>
</body>