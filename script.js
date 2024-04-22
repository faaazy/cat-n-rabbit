import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

kaboom({
  width: 1920,
  height: 920,
  letterbox: true,
});

loadSprite("bg", "./sprites/bg.jpeg");
loadSprite("cat", "./sprites/cat.png");
loadSprite("ghost", "./sprites/ghost.png");
loadSprite("grave", "./sprites/grave.png");
loadSprite("skulls", "./sprites/skulls.png");
loadSprite("pumpkin", "./sprites/pumpkin.png");
loadSprite("fence", "./sprites/fence.png");
loadSprite("fence-corner", "./sprites/fence-left_right.png");
loadSprite("fence-side", "./sprites/fence-side.png");
loadSprite("lose-game-bg", "./sprites/lose-game.png");
loadSprite("game2-bg", "./sprites/game2new-bg.jpg");
loadFont("Montserrat", "./fonts/Montserrat-Bold.ttf");
loadSprite("platform", "./sprites/platform-sand.png");
loadSprite("lava-sprite", "./sprites/lava-sprite.png");
loadSprite("bg-home", "./sprites/home_window.jpg");
loadSprite("game1-controls", "./sprites/game1-controls.png");
loadSprite("blue-jet", "./sprites/blue-jet.png");
loadSprite("red-jet", "./sprites/red-jet.png");
loadSprite("red-enemy", "./sprites/red-jet-enemy.png");
loadSprite("blue-enemy", "./sprites/blue-jet-enemy.png");
loadSprite("bg-3", "./sprites/bg-3.png");
loadSprite("floor", "./sprites/floor.png");
loadSprite("pedestal", "./sprites/pedestal.png");
loadSprite("game3-controls", "./sprites/game3-controls.png");

const SPEED = 300;
let ENEMY_SPEED = 180;
let boost = 0;
let scoreFirst = 0;
let scoreSecond = 0;
const BULLET_SPEED = 800;

loadSprite("cat", "./sprites/cat.png", {
  sliceX: 3,

  anims: {
    idle: {
      from: 0,
      to: 1,
      loop: true,
    },
    run: {
      from: 1,
      to: 2,
      loop: true,
    },
  },
});

loadSprite("rabbit", "./sprites/rabbit.png", {
  sliceX: 3,
  sliceY: 1,
  anims: {
    idle: {
      from: 0,
      to: 1,
      loop: true,
    },
    run: {
      from: 1,
      to: 2,
      loop: true,
    },
  },
});

scene("home", () => {
  add([sprite("bg-home"), fixed()]);
  onKeyPress("space", () => {
    wait(0.5, () => {
      go("game1-controls");
    });
  });
});

scene("game1-controls", () => {
  add([sprite("game1-controls")]);
  onKeyPress("space", () => {
    go("game");
  });
});

scene("game", () => {
  setGravity(0);
  add([sprite("bg"), fixed()]);
  const level = addLevel(
    [
      " >>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",
      "~       %           %      *  ~",
      "~         ^    *      *       ~",
      "~   &                 %       ~",
      "~           *    %            ~",
      "~*                       ^    ~",
      "~   %     *      %            ~",
      "~     ^                 **    ~",
      "~           ^       ^         ~",
      "~   *          %              ~",
      "~       ^             %       ~",
      "~             **              ~",
      "~  %   ^              ^    %  ~",
      "~             %               ~",
      "~                             ~",
      " >>>>>>>>>>>>>>>>>>>>>>>>>>>>> ",
    ],
    {
      tileWidth: 64,
      tileHeight: 64,
      tiles: {
        "~": () => [
          sprite("fence-side"),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          scale(4),
        ],
        ")": () => [
          sprite("fence-corner"),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          scale(4),
        ],
        ">": () => [
          sprite("fence"),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          scale(4),
          "fence",
        ],
        "@": () => [],
        "&": () => [],
        "=": () => [
          sprite("grass"),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          "grass",
        ],
        "*": () => [
          sprite("skulls"),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          scale(2),
          "skulls",
        ],
        "%": () => [
          sprite("pumpkin"),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          scale(2),
          "steel",
        ],
        "^": () => [
          sprite("grave"),
          area(),
          body({ isStatic: true }),
          anchor("center"),
          scale(2),
          "grave",
        ],
      },
    }
  );
  const player = add([
    sprite("cat"),
    scale(4),
    pos(80, 80),
    area(),
    body(),
    anchor("center"),
    "player",
  ]);

  const player2 = add([
    sprite("rabbit"),
    scale(4),
    pos(280, 80),
    area(),
    body(),
    anchor("center"),
    "player2",
  ]);

  const enemy = add([
    sprite("ghost"),
    pos(width() - 380, height() - 380),
    anchor("center"),
    area(),
    state("move", ["idle", "move"]),
  ]);
  const enemy2 = add([
    sprite("ghost"),
    pos(width() - 400, height() - 100),
    anchor("center"),
    area(),
    state("move", ["idle", "move"]),
  ]);
  player.onUpdate(() => {
    camScale(0.9);
    if (isKeyDown("left")) {
      player.flipX = true;
    } else {
      player.flipX = false;
    }
    if (!isKeyDown("left") && !isKeyDown("right")) {
      player.play("idle");
    } else {
      player.play("run");
    }
  });
  player2.onUpdate(() => {
    if (isKeyDown("a")) {
      player2.flipX = true;
    } else {
      player2.flipX = false;
    }
    if (!isKeyDown("a") && !isKeyDown("d")) {
      player2.play("idle");
    } else {
      player2.play("run");
    }
  });
  enemy.onStateEnter("idle", async () => {
    await wait(0.5);
    enemy.enterState("move");
    ENEMY_SPEED += 10;
  });
  enemy2.onStateEnter("idle", async () => {
    await wait(0.5);
    enemy2.enterState("move");
  });

  enemy.onCollide("player", () => {
    scoreSecond++;
    go("lose-game1");
  });
  enemy.onCollide("player2", () => {
    scoreFirst++;
    go("lose-game1");
  });

  enemy.onStateEnter("move", async () => {
    await wait(5);
    enemy.enterState("idle");
  });

  enemy2.onCollide("player2", () => {
    scoreFirst++;
    go("lose-game1");
  });
  enemy2.onCollide("player", () => {
    scoreSecond++;
    go("lose-game1");
  });

  enemy2.onStateEnter("move", async () => {
    await wait(5);
    enemy2.enterState("idle");
  });

  enemy.onStateUpdate("move", () => {
    if (!player.exists()) return;
    enemy.onUpdate(() => {});
    const dir = player.pos.sub(enemy.pos).unit();

    enemy.move(dir.scale(ENEMY_SPEED));
  });

  enemy2.onStateUpdate("move", () => {
    if (!player2.exists()) return;
    enemy2.onUpdate(() => {});
    const dir = player2.pos.sub(enemy2.pos).unit();

    enemy2.move(dir.scale(ENEMY_SPEED));
  });
  onKeyDown("left", () => {
    player.move(-SPEED, 0);
  });

  onKeyDown("right", () => {
    player.move(SPEED, 0);
  });

  onKeyDown("up", () => {
    player.move(0, -SPEED);
  });

  onKeyDown("down", () => {
    player.move(0, SPEED);
  });
  onKeyDown("a", () => {
    player2.move(-SPEED, 0);
  });

  onKeyDown("d", () => {
    player2.move(SPEED, 0);
  });

  onKeyDown("w", () => {
    player2.move(0, -SPEED);
  });

  onKeyDown("s", () => {
    player2.move(0, SPEED);
  });
});
scene("lose-game1", () => {
  add([sprite("lose-game-bg"), fixed()]);
  const labelText = add([
    text(scoreFirst, {
      font: "Montserrat",
    }),
    pos(width() / 2 - 250, height() / 2 + 150),
    scale(4),
  ]);
  const player = add([
    sprite("cat"),
    scale(10),
    pos(width() / 2 - 225, height() / 2 - 150),
    area(),
    body(),
    anchor("center"),
    "player",
  ]);
  const scoreAbout = add([
    text("Счет:", {
      font: "Montserrat",
    }),
    pos(width() / 2 - 325, height() / 2),
    scale(2),
  ]);

  const labelText2 = add([
    text(scoreSecond, {
      font: "Montserrat",
    }),
    pos(width() / 2 + 175, height() / 2 + 150),
    scale(4),
  ]);
  const player2 = add([
    sprite("rabbit"),
    scale(10),
    pos(width() / 2 + 225, height() / 2 - 150),
    area(),
    body(),
    anchor("center"),
    "player2",
  ]);
  const scoreAbout2 = add([
    text("Счет:", {
      font: "Montserrat",
    }),
    pos(width() / 2 + 100, height() / 2),
    scale(2),
  ]);
  wait(5, () => {
    go("game2-controls");
  });
});
scene("game2-controls", () => {
  loadSprite("game2-controls", "./sprites/game2-controls.png");
  add([sprite("game2-controls"), fixed()]);
  onKeyPress("space", () => {
    go("game2");
  });
});
scene("game2", () => {
  add([sprite("game2-bg"), fixed()]);
  setGravity(800);

  const lavaSpeed = 120;
  let timeRemain = 10;

  const player = add([
    sprite("cat"),
    scale(4),
    pos(80, 100),
    area(),
    body(),
    anchor("center"),
    "player",
  ]);

  const player2 = add([
    sprite("rabbit"),
    scale(4),
    pos(280, 80),
    area(),
    body(),
    anchor("center"),
    "player2",
  ]);

  player.onUpdate(() => {
    if (isKeyDown("left")) {
      player.flipX = true;
    } else {
      player.flipX = false;
    }
    if (!isKeyDown("left") && !isKeyDown("right")) {
      player.play("idle");
    } else {
      player.play("run");
    }
  });
  player2.onUpdate(() => {
    if (isKeyDown("a")) {
      player2.flipX = true;
    } else {
      player2.flipX = false;
    }
    if (!isKeyDown("a") && !isKeyDown("d")) {
      player2.play("idle");
    } else {
      player2.play("run");
    }
  });

  function spawnPlatform() {
    add([
      sprite("platform"),
      pos(rand(0, width() - 70), height()),
      color(197, 123, 87),
      outline(10),
      area(),
      body({ isStatic: true }),
      "platform",
    ]);
  }
  const floor = add([
    sprite("floor"),
    scale(2),
    pos(0, 150),
    color(197, 123, 87),
    z(100),
    body({ isStatic: true }),
    area(),
    "floor",
  ]);

  function spawnLava() {
    add([
      sprite("lava-sprite"),
      pos(0, height()),
      z(100),
      body({ isStatic: true }),
      area(),
      "lava",
    ]);
  }
  wait(10, () => {
    spawnLava();
  });

  loop(rand(0.5, 1), () => {
    spawnPlatform();
    wait(10, () => {
      destroy(floor);
    });
  });

  onUpdate("platform", (platform) => {
    platform.move(0, -90);
    if (platform.pos.y < -20) {
      destroy(platform);
    }
  });

  onUpdate("lava", (lava) => {
    lava.move(0, -lavaSpeed * dt());
    if (lava.pos.y < -20) {
      spawnLava();
    }
  });

  player.onCollide("lava", () => {
    scoreSecond++;
    go("lose-game2");
  });

  player2.onCollide("lava", () => {
    scoreFirst++;
    go("lose-game2");
  });

  player.onUpdate(() => {
    if (player.pos.x < 0) {
      player.pos.x = width();
    } else if (player.pos.x > width()) {
      player.pos.x = 0;
    }
  });

  player2.onUpdate(() => {
    if (player2.pos.x < 0) {
      player2.pos.x = width();
    } else if (player2.pos.x > width()) {
      player2.pos.x = 0;
    }
  });

  onKeyDown("left", () => {
    player.move(-SPEED, 0);
  });

  onKeyDown("right", () => {
    player.move(SPEED, 0);
  });

  onKeyPress("up", () => {
    if (player.isGrounded()) {
      player.jump(500);
    }
  });

  onKeyDown("a", () => {
    player2.move(-SPEED, 0);
  });

  onKeyDown("d", () => {
    player2.move(SPEED, 0);
  });

  onKeyPress("w", () => {
    if (player2.isGrounded()) {
      player2.jump(500);
    }
  });
});

scene("lose-game2", () => {
  setGravity(0);
  add([sprite("lose-game-bg"), fixed()]);
  const labelText = add([
    text(scoreFirst, {
      font: "Montserrat",
    }),
    pos(width() / 2 - 250, height() / 2 + 150),
    scale(4),
  ]);
  const player = add([
    sprite("cat"),
    scale(10),
    pos(width() / 2 - 225, height() / 2 - 150),
    area(),
    body(),
    anchor("center"),
    "player",
  ]);
  const scoreAbout = add([
    text("Счет:", {
      font: "Montserrat",
    }),
    pos(width() / 2 - 325, height() / 2),
    scale(2),
  ]);
  const labelText2 = add([
    text(scoreSecond, {
      font: "Montserrat",
    }),
    pos(width() / 2 + 175, height() / 2 + 150),
    scale(4),
  ]);
  const player2 = add([
    sprite("rabbit"),
    scale(10),
    pos(width() / 2 + 225, height() / 2 - 150),
    area(),
    body(),
    anchor("center"),
    "player2",
  ]);
  const scoreAbout2 = add([
    text("Счет:", {
      font: "Montserrat",
    }),
    pos(width() / 2 + 100, height() / 2),
    scale(2),
  ]);
  wait(5, () => {
    go("game3-controls");
  });
});

scene("game3-controls", () => {
  add([sprite("game3-controls"), fixed()]);
  onKeyPress("space", () => {
    go("game3");
  });
});

scene("game3", () => {
  const SHOOT_DELAY = 0.25;
  let blueLastShootTime = 0;
  let redLastShootTime = 0;

  loadSprite("bullet", "./sprites/fireball.png", {
    sliceX: 5,
    anims: {
      fly: {
        from: 0, 
        to: 4,
        loop: true,
      },
    },
  });
  loadSprite("blueBullet", "./sprites/blueFireball.png", {
    sliceX: 5,
    anims: {
      fly: {
        from: 0,
        to: 4,
        loop: true,
      },
    },
  });

  const bg = add([sprite("bg-3"), scale(1.05)]);
  const blueJet = add([
    sprite("blue-jet"),
    scale(3),
    pos(180, height() / 2 - 100),
    area(),
    z(100),
    anchor("center"),
    "bluejet",
  ]);
  const redJet = add([
    sprite("red-jet"),
    scale(3),
    pos(180, height() / 2 + 100),
    area(),
    z(100),
    anchor("center"),
    "redjet",
  ]);

  function createBlueEnemy() {
    wait(rand(1, 2), () => {
      createBlueEnemy();
    });
    const blueEnemy = add([
      health(5),
      sprite("blue-enemy"),
      scale(2),
      pos(width(), rand(50, height())),
      area(),
      offscreen({ destroy: true }),
      anchor("center"),
      "blue-enemy",
    ]);
    onUpdate(() => {
      blueEnemy.move(-SPEED - 100, 0);
    });
    blueEnemy.on("hurt", () => {
      blueEnemy.health -= 1;
      blueEnemy.color = rgb(0, 0, 255);
    });
    blueEnemy.on("death", () => {
      destroy(blueEnemy);
    });
    blueEnemy.onCollide("bullet1", () => {
      blueEnemy.hurt(1);
      decreaseBlueScore();
    });
    blueEnemy.onCollide("bullet2", () => {
      blueEnemy.hurt(1);
      addRedScore();
    });
  }

  createBlueEnemy();

  function createRedEnemy() {
    wait(rand(1, 2), () => {
      createRedEnemy();
    });
    const redEnemy = add([
      health(5),
      sprite("red-enemy"),
      scale(2),
      pos(width() + 100, rand(50, height())),
      area(),
      offscreen({ destroy: true }),
      anchor("center"),
      "red-enemy",
    ]);
    onUpdate(() => {
      redEnemy.move(-SPEED - 100, 0);
    });
    redEnemy.on("hurt", () => {
      redEnemy.health -= 1;
      redEnemy.color = rgb(255, 0, 0);
    });
    redEnemy.on("death", () => {
      destroy(redEnemy);
    });
    redEnemy.onCollide("bullet2", () => {
      redEnemy.hurt(1);
      decreaseRedScore();
    });
    redEnemy.onCollide("bullet1", () => {
      redEnemy.hurt(1);
      addBlueScore();
    });
  }
  createRedEnemy();

  onKeyDown("left", () => {
    blueJet.move(-SPEED, 0);
  });

  onKeyDown("right", () => {
    blueJet.move(SPEED, 0);
  });

  onKeyDown("up", () => {
    blueJet.move(0, -SPEED);
  });

  onKeyDown("down", () => {
    blueJet.move(0, SPEED);
  });

  onKeyDown("a", () => {
    redJet.move(-SPEED, 0);
  });

  onKeyDown("d", () => {
    redJet.move(SPEED, 0);
  });

  onKeyDown("w", () => {
    redJet.move(0, -SPEED);
  });

  onKeyDown("s", () => {
    redJet.move(0, SPEED);
  });
  
  onUpdate(() => {
    if (blueJet.pos.x > width() - 100) {
      blueJet.move(-SPEED, 0);
    }
    if (blueJet.pos.x < 50) {
      blueJet.move(SPEED, 0);
    }
    if (blueJet.pos.y < 30) {
      blueJet.move(0, SPEED);
    }
    if (blueJet.pos.y > height() - 30) {
      blueJet.move(0, -SPEED);
    }

    if (redJet.pos.x > width() - 100) {
      redJet.move(-SPEED, 0);
    }
    if (redJet.pos.x < 50) {
      redJet.move(SPEED, 0);
    }
    if (redJet.pos.y < 30) {
      redJet.move(0, SPEED);
    }
    if (redJet.pos.y > height() - 30) {
      redJet.move(0, -SPEED);
    }
  });

  function blueShoot() {
    if (time() - blueLastShootTime >= SHOOT_DELAY) {
      const blueBullet = add([
        sprite("blueBullet"),
        pos(blueJet.pos),
        area(),
        anchor("center"),
        "bullet1",
      ]);
      blueBullet.play("fly");
      blueLastShootTime = time();
      onUpdate(() => {
        blueBullet.move(BULLET_SPEED, 0);
      });
      wait(2.5, () => {
        destroy(blueBullet);
      });
      return blueBullet;
    }
  }

  blueJet.onUpdate(() => {
    blueShoot();
  });

  function redShoot() {
    if (time() - redLastShootTime >= SHOOT_DELAY) {
      const redBullet = add([
        sprite("bullet"),
        pos(redJet.pos),
        area(),
        anchor("center"),
        "bullet2",
      ]);
      redBullet.play("fly");
      redLastShootTime = time();
      onUpdate(() => {
        redBullet.move(BULLET_SPEED, 0);
      });
      wait(2.5, () => {
        destroy(redBullet);
      });
    }
  }

  redJet.onUpdate(() => {
    redShoot();
  });

  let redScore = 0;
  let blueScore = 0;

  const redScoreLabel = add([
    text("Счет Красных:" + redScore),
    pos(width() / 2 + 50, height() - 75),
  ]);
  const blueScoreLabel = add([
    text("Счет Синих:" + blueScore),
    pos(width() / 2 - 350, height() - 75),
  ]);

  function addBlueScore() {
    blueScore++;
    blueScoreLabel.text = "Счет Синих:" + blueScore;
  }
  function addRedScore() {
    redScore++;
    redScoreLabel.text = "Счет Красных:" + redScore;
  }
  function decreaseBlueScore() {
    blueScore--;
    blueScoreLabel.text = "Счет Синих:" + blueScore;
  }
  function decreaseRedScore() {
    redScore--;
    redScoreLabel.text = "Счет Красных:" + redScore;
  }
  let timer = 5;
  const timerLabel = add([
    text("Времени осталось" + timer),
    pos(width() / 2 - 200, 20),
  ]);

  function updateTime() {
    timer--;
    timerLabel.text = "Времени осталось: " + timer.toString();
    if (timer == 0) {
      if (blueScore > redScore) {
        scoreFirst++;
      } else {
        scoreSecond++;
      }
      timer = 0;
      clearInterval(timerInterval);
      go("lose-game3");
    }
  }

  const timerInterval = setInterval(updateTime, 1000);
});

scene("lose-game3", (blueScore, redScore) => {
  add([sprite("lose-game-bg"), fixed()]);
  const labelText = add([
    text(scoreFirst, {
      font: "Montserrat",
    }),
    pos(width() / 2 - 250, height() / 2 + 150),
    scale(4),
  ]);
  const player = add([
    sprite("cat"),
    scale(10),
    pos(width() / 2 - 225, height() / 2 - 150),
    area(),
    body(),
    anchor("center"),
    "player",
  ]);
  const scoreAbout = add([
    text("Счет:", {
      font: "Montserrat",
    }),
    pos(width() / 2 - 325, height() / 2),
    scale(2),
  ]);
  const labelText2 = add([
    text(scoreSecond, {
      font: "Montserrat",
    }),
    pos(width() / 2 + 175, height() / 2 + 150),
    scale(4),
  ]);
  const player2 = add([
    sprite("rabbit"),
    scale(10),
    pos(width() / 2 + 225, height() / 2 - 150),
    area(),
    body(),
    anchor("center"),
    "player2",
  ]);
  const scoreAbout2 = add([
    text("Счет:", {
      font: "Montserrat",
    }),
    pos(width() / 2 + 100, height() / 2),
    scale(2),
  ]);
  wait(5, () => {
    go("game-over");
  });
});

scene("game-over", () => {
  setGravity(600);
  add([sprite("pedestal")]);
  if (scoreFirst > scoreSecond) {
    const player = add([
      sprite("cat"),
      scale(15),
      pos(width() / 2 + 25, height() / 2),
      area(),
      body(),
      z(100),
      anchor("center"),
      "player",
    ]);
    player.onUpdate(() => {
      if (isKeyDown("left")) {
        player.flipX = true;
      } else {
        player.flipX = false;
      }
      if (!isKeyDown("left") && !isKeyDown("right")) {
        player.play("idle");
      } else {
        player.play("run");
      }
    });
    onKeyPress("up", () => {
      if (player.isGrounded()) {
        player.jump(500);
      }
    });
    const floor = add([
      sprite("floor"),
      scale(2),
      pos(0, height() / 2 + 175),
      color(197, 123, 87),
      z(-1),
      body({ isStatic: true }),
      area(),
      "floor",
    ]);
    wait(10, () => {
      go("home");
    });
  }
  if (scoreFirst < scoreSecond) {
    const player2 = add([
      sprite("rabbit"),
      scale(15),
      pos(width() / 2 + 25, height() / 2),
      area(),
      body(),
      z(100),
      anchor("center"),
      "player2",
    ]);
    player2.onUpdate(() => {
      if (isKeyDown("a")) {
        player2.flipX = true;
      } else {
        player2.flipX = false;
      }
      if (!isKeyDown("a") && !isKeyDown("d")) {
        player2.play("idle");
      } else {
        player2.play("run");
      }
    });
    onKeyPress("w", () => {
      if (player2.isGrounded()) {
        player2.jump(500);
      }
    });
    const floor = add([
      sprite("floor"),
      scale(2),
      pos(0, height() / 2 + 175),
      color(197, 123, 87),
      z(-1),
      body({ isStatic: true }),
      area(),
      "floor",
    ]);
    wait(10, () => {
      go("home");
      scoreFirst = 0;
      scoreSecond = 0;
    });
  }
});

go("home");
