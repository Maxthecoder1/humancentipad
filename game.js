window.onload = function() {

    // variables that will hold objects
    var head, pad, stick, tail, cursors, snake, apple, gameText, playerDirection;
    var directions = Object.freeze({up: 0, down: 1, right: 2, left: 3});
    
    // configuration variables and starting values
    var canvasWidth = 832, canvasHeight = 640; 
    var playerSize = 64;
    var x = 128, y = 0;
    var frameCounter = 0;
    var gameSpeed = 20;
    var score = 0;
    var imagename = 3;
    // basic phaser preload/create/update functions

    var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

    function preload() {
   
    	game.load.atlas('dpad', 'assets/dpad.png', 'assets/dpad.json');
    	game.load.image("background", "assets/hct.jpg");
        game.load.atlasJSONArray('tb', 'assets/tb.png', 'assets/tb.json');
        game.load.audio('sfx1', 'assets/check.ogg');
        game.load.audio('sfx2', 'assets/done.ogg');
   
    }

    function create() {
        gameText = game.add.text(canvasWidth, 0, "0", {
            font: "28px Arial",
            fill: "#fff"
        });
        gameText.anchor.setTo(1, 0);
        var background = game.add.tileSprite(0, 0, 832, 640, "background");
        game.world.sendToBack(background);
        
        pad = game.plugins.add(Phaser.VirtualJoystick);
        stick = pad.addDPad(0, 0, 200, 'dpad');
        stick.alignBottomRight(0);
    	fx1 = game.add.audio('sfx1');
    	fx2 = game.add.audio('sfx2');
    	fx1.volume= 0.5;
        initSnake();
        placeRandomApple();

        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
        gameText.text = score;
        updateDirection();
        frameCounter++;
        if (frameCounter == gameSpeed) {
            movePlayer();
            if (playerCollidesWithSelf()) {
            	fx2.play();
                alert("The game is over! Your score was: " + score);
                deleteSnake();
                imagename = 3;
                initSnake();
                score = 0;
                gameSpeed = 20;
                playerDirection = undefined;
                x = 128;
                y = 0;
                gameText.text = "";
            }
            if (appleCollidesWithSnake()) {
            	fx1.play();
                score++;
                apple.destroy();
                imagename++;
                placeRandomApple();
                gameSpeed--;
                if (gameSpeed <= 5) gameSpeed = 5;
            } else if (playerDirection != undefined) {
                removeTail();
            }
            frameCounter = 0;
        }
    }

    // helper functions

    function initSnake() {
        head = new Object();
        newHead(0, 0, 0);
        tail = head;
        newHead(64, 0, 1);
        newHead(128, 0, 2);

    }

    function deleteSnake() {
        while (tail != null) {
            tail.image.destroy();
            tail = tail.next;
        }
        head = null;
    }

    function placeRandomApple() {
        if (apple != undefined) apple.destroy();
        apple = game.add.image(0, 0, 'tb', imagename);// change texture
        do {
        	
            apple.position.x = Math.floor(Math.random() * 13) * 64;
            apple.position.y = Math.floor(Math.random() * 10) * 64;
        } while (appleCollidesWithSnake());
    }

    // linked list functions

    function newHead(x, y, imagen) {
    	//if (imagen === undefined){imagen= imagename;}
        var newHead = new Object();
        newHead.image = game.add.image(x, y, 'tb', imagen);
        newHead.next = null;
        head.next = newHead;
        head = newHead;
    }

    function removeTail(x, y) {
        tail.image.destroy();
        tail = tail.next;
    }

    // collision functions

    function appleCollidesWithSnake() {
        // traverse the linked list, starting at the tail
        var needle = tail;
        var collides = false;
        var numTimes = 0;
        while (needle != null) {
            numTimes++;
            if (apple.position.x == needle.image.position.x && 
                apple.position.y == needle.image.position.y) {
                collides = true;
                imagename++;
            	apple.loadTexture('tb', imagename);
            }
            needle = needle.next;
        }
        return collides;
    }

    function playerCollidesWithSelf() {
        // check if the head has collided with any other body part, starting at the tail
        var needle = tail;
        var collides = false;
        while (needle.next != head) {
            if (needle.image.position.x == head.image.position.x &&
                needle.image.position.y == head.image.position.y) {
                collides = true;
            }
            needle = needle.next;
        }
        return collides;
    }

    // movement functions

    function updateDirection() {
        if (cursors.right.isDown && playerDirection != directions.left) {
            playerDirection = directions.right;
        }
        if (cursors.left.isDown && playerDirection != directions.right) {
            playerDirection = directions.left;
        }
        if (cursors.up.isDown && playerDirection != directions.down) {
            playerDirection = directions.up;
        }
        if (cursors.down.isDown && playerDirection != directions.up) {
            playerDirection = directions.down;
        }
        if (stick.isDown)
        {
           

            if (stick.direction === Phaser.LEFT && playerDirection != directions.right)
            {
            	playerDirection = directions.left;
            }
            else if (stick.direction === Phaser.RIGHT && playerDirection != directions.left)
            {
            	playerDirection = directions.right;
            }
            else if (stick.direction === Phaser.UP && playerDirection != directions.down)
            {
            	 playerDirection = directions.up;
            }
            else if (stick.direction === Phaser.DOWN && playerDirection != directions.up)
            {
            	  playerDirection = directions.down;
            }
        }
        
        
    }

    function movePlayer() {
        if (playerDirection == directions.right) {
            x += playerSize;
        } else if (playerDirection == directions.left) {
            x -= playerSize;
        } else if (playerDirection == directions.up) {
            y -= playerSize;
        } else if (playerDirection == directions.down) {
            y += playerSize;
        }
        if (x <= 0 - playerSize) {
            x = canvasWidth - playerSize;
        } else if (x >= canvasWidth) {
            x = 0;
        } else if (y <= 0 - playerSize) {
            y = canvasHeight - playerSize;
        } else if (y >= canvasHeight) {
            y = 0;
        }
        if (playerDirection != undefined) {
            newHead(x, y);
        }
    }

};
