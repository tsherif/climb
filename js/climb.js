/*
* Climb
*
* Copyright (C) 2014 Tarek Sherif
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function() {
  "use strict";

  var canvas = document.getElementById("canvas");

  var WORLD_WIDTH = 800;
  var WORLD_HEIGHT = 600;

  var GRAVITY = 1.4;
  var FRICTION = 0.7;
  var TERMINAL_VX = 7;
  var JUMP = -25; 
  var MS_TO_FRAMES = 40 / 1000;

  var LEVEL_WIDTH = 650;
  var FLOOR_HEIGHT = 75;
  var PLATFORM_DIM = 60;
  var PLATFORM_RANGE = 200;
  var PLATFORM_DOUBLE_RANGE = PLATFORM_RANGE * 2;
  var PLATFORM_SPAWN = 0.5;

  var PLAYER_COLOR = "#FF0000";
  var PLATFORM_COLOR = "#0000FF";
  var WALL_COLOR = "#101010";

  var player, world, border_width;
  var height, height_message;
  var max_height, max_height_message;
  var title_message, start_message, game_over_message, score_message, hi_score_message, restart_message;

  var camera_movement = 0;

  tgame.clear_color = "#000000";

  tgame.entities = {
    player: [],
    platforms: [],
    walls: [],
    messages: []
  };

  function calculateProjection() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var canvas_scale = canvas.width / WORLD_WIDTH;

    if (canvas_scale * WORLD_HEIGHT > canvas.height) {
      canvas_scale = canvas.height / WORLD_HEIGHT;
    }

    var canvas_offset_x = (canvas.width - canvas_scale * WORLD_WIDTH) * 0.5;
    var canvas_offset_y = (canvas.height - canvas_scale * WORLD_HEIGHT) * 0.5;

    tgame.setProjectionOffset(canvas_offset_x, canvas_offset_y);
    tgame.setProjectionScale(canvas_scale);
  }

  calculateProjection();

  window.addEventListener("resize", calculateProjection);

  tgame.setRenderOrder(["walls", "platforms", "player", "messages"]);

  tgame.addKeyControl(tgame.keyboard.LEFT, function() {
    player.move_left = true;
  }, function() {
    player.move_left = false;
  });

  tgame.addKeyControl(tgame.keyboard.RIGHT, function() {
    player.move_right = true;
  }, function() {
    player.move_right = false;
  });

  tgame.addKeyControl(tgame.keyboard.SPACE, function() {
    if (tgame.state === "PRESS_START") {
      tgame.state = 'TITLE';
      start_message.remove = true;

      tgame.sounds.music.currentTime = 0;
      tgame.sounds.music.loop = true;
      tgame.sounds.music.volume = 0.5;
      tgame.sounds.music.play();

      return;
    }

    if (!player.jumping && player.onplatform) {
      player.jump = true;
      player.jumping = true;
    }
  }, function() {
    player.jumping = false;
  });

  tgame.addKeyControl(tgame.keyboard.R, function(event) {
    if (event.ctrlKey) return false;

    game_over_message.hidden = true;
    score_message.hidden = true;
    hi_score_message.hidden = true;
    restart_message.hidden = true;
    tgame.state = "CLEAR_ROUND";
  });

  tgame.addSound("music", "audio/bellahmer-round1");
  tgame.addSound("jump", "audio/jump");

  tgame.setCanvas(canvas);

  function createLevel() {
    tgame.entities.walls.push(createPlatform({
      x: 0,
      y: 0,
      width: border_width,
      height: WORLD_HEIGHT,
      color: WALL_COLOR
    }));

    tgame.entities.walls.push(createPlatform({
      x: world.right,
      y: 0,
      width: border_width,
      height: WORLD_HEIGHT,
      color: WALL_COLOR
    }));

    tgame.entities.platforms.push(createPlatform({
      x: 0,
      y: WORLD_HEIGHT - FLOOR_HEIGHT,
      width: WORLD_WIDTH,
      height: FLOOR_HEIGHT,
      color: WALL_COLOR
    }));


    var num_platforms = Math.floor(Math.random() * 60 + 30);
    while (num_platforms--) {
      tgame.entities.platforms.push(spawnPlatform(
        Math.random() * (world.bottom - FLOOR_HEIGHT - PLATFORM_DIM + PLATFORM_DOUBLE_RANGE) - PLATFORM_DOUBLE_RANGE,
        world.left,
        world.right,
        world.bottom - FLOOR_HEIGHT
      )
      );
    }
  }

  tgame.STATES = {
    INIT: function() {
      border_width = (WORLD_WIDTH - LEVEL_WIDTH) / 2;

      world = {
        top: 0,
        left: border_width,
        bottom: WORLD_HEIGHT,
        right: WORLD_WIDTH - border_width,
        top_boundary: WORLD_HEIGHT * 0.25
      };

      title_message = createMessage({
        x: (world.left + world.right) * 0.5,
        y: (world.top + world.bottom) * 0.5 - FLOOR_HEIGHT * 0.5,
        color: "#FF0000",
        font: "normal 128px telegrama",
        baseline: "middle",
        text_align: "center",
        text: "Climb"
      });

      start_message = createMessage({
        x: title_message.x,
        y: title_message.y + 72,
        font: "normal 18px telegrama",
        baseline: "top",
        text_align: "center",
        text: "Press SPACE to Start"
      });

      tgame.entities.messages.push(title_message);
      tgame.entities.messages.push(start_message);

      createLevel();

      tgame.getCanvas().focus();

      tgame.state = "PRESS_START";
    },
    PRESS_START: function() {
      tgame.entities.platforms.forEach(function(platform) {
        platform.updatePosition(Date.now());
      });
    },
    TITLE: function() {
      var author_message, music_message;
      var controls_message, jump_message;

      author_message = createMessage({
        x: title_message.x,
        y: title_message.y + 72,
        font: "normal 18px telegrama",
        baseline: "top",
        text_align: "center",
        text: "by Tarek Sherif"
      });

      music_message = createMessage({
        x: title_message.x,
        y: title_message.y + 96,
        font: "normal 18px telegrama",
        baseline: "top",
        text_align: "center",
        text: "Music by Nadir Bellahmer"
      });

      controls_message = createMessage({
        x: world.left + 10,
        y: world.bottom - FLOOR_HEIGHT - 10,
        font: "normal 18px telegrama",
        baseline: "bottom",
        text_align: "left",
        hidden: true,
        text: "\u2190 \u2192 to Move"
      });

      jump_message = createMessage({
        x: world.right - 10,
        y: world.bottom - FLOOR_HEIGHT - 10,
        font: "normal 18px telegrama",
        baseline: "bottom",
        text_align: "right",
        hidden: true,
        text: "SPACE to Jump"
      });

      tgame.entities.messages.push(title_message);
      tgame.entities.messages.push(author_message);
      tgame.entities.messages.push(music_message);
      tgame.entities.messages.push(controls_message);
      tgame.entities.messages.push(jump_message);

      tgame.effects.fade({
        objects: [title_message, author_message, music_message],
        multiplier: 0.95,
        delay: 1000,
        remove: true,
        complete: function() {
          controls_message.hidden = false;
          controls_message.alpha = 0;
          jump_message.hidden = false;
          jump_message.alpha = 0;
          tgame.effects.fade({
            objects: [controls_message, jump_message],
            multiplier: 1.4,
            complete: function() {
              jump_message.hidden = false;
              tgame.effects.fade({
                objects: [controls_message, jump_message],
                multiplier: 0.95,
                delay: 3200,
                remove: true
              });
            }
          });
        }
      });


      tgame.sounds.jump.volume = 0.1;

      localStorage.high_score = localStorage.high_score || 0;

      tgame.state = "START_ROUND";
    },

    CLEAR_ROUND: function() {
      tgame.clearEntities();

      createLevel();

      tgame.state = "START_ROUND";
    },

    START_ROUND: function() {

      player = createPlayer({
        color: PLAYER_COLOR,
        x: WORLD_WIDTH / 2,
        y: WORLD_HEIGHT - FLOOR_HEIGHT - 30,
        width: 15,
        height: 30,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        onplatform: null,
        move_left: false,
        move_right: false,
        jump: false,
        jumping: false,
        last_x: 0,
        last_y: 0
      });

      tgame.entities.player.push(player);

      height = 0;
      height_message = createMessage({
        x: world.right - 10,
        y: world.top + 10,
        font: "normal 18px telegrama",
        text_align: "right",
        text: "Height: " + height
      });

      max_height = height;
      max_height_message = createMessage({
        x: world.right - 10,
        y: world.top + 34,
        font: "normal 18px telegrama",
        text_align: "right",
        text: "Max Height: " + max_height
      });

      game_over_message = createMessage({
        x: (world.left + world.right) * 0.5,
        y: (world.top + world.bottom) * 0.5 - FLOOR_HEIGHT * 0.5,
        font: "normal 64px telegrama",
        color: "#FF0000",
        baseline: "middle",
        text_align: "center",
        text: "GAME OVER",
        hidden: true
      });

      score_message = createMessage({
        x: game_over_message.x,
        y: game_over_message.y + 40,
        font: "normal 18px telegrama",
        baseline: "top",
        text: "Maximum Height This Round: ",
        text_align: "center",
        hidden: true
      });

      hi_score_message = createMessage({
        x: game_over_message.x,
        y: game_over_message.y + 64,
        font: "normal 18px telegrama",
        baseline: "top",
        text: "Maximum Height All Time: ",
        text_align: "center",
        hidden: true
      });

      restart_message = createMessage({
        x: game_over_message.x,
        y: game_over_message.y + 88,
        font: "normal 18px telegrama",
        baseline: "top",
        text: "Press 'R' to Restart",
        text_align: "center",
        hidden: true
      });

      tgame.entities.messages.push(height_message);
      tgame.entities.messages.push(max_height_message);
      tgame.entities.messages.push(game_over_message);
      tgame.entities.messages.push(score_message);
      tgame.entities.messages.push(hi_score_message);
      tgame.entities.messages.push(restart_message);

      tgame.state = "PLAY";
    },

    PLAY: function(dt) {
      var df = dt * MS_TO_FRAMES;
      var collisions = {};

      player.last_x = player.x;
      player.last_y = player.y;


      player.ax = 0;

      if (player.move_left && !player.move_right) {
        player.vx = Math.min(player.vx, 0);
        player.ax = -0.5;
      } else if (!player.move_left && player.move_right) {
        player.vx = Math.max(player.vx, 0);
        player.ax = 0.5;
      }

      if (player.jump) {
        player.vy = JUMP;
        player.onplatform = null;
        player.jump = false;

        tgame.sounds.jump.currentTime = 0;
        tgame.sounds.jump.play();
      }

      if (player.ax) {
        player.vx = Math.max(-TERMINAL_VX, Math.min(player.vx + player.ax * df, TERMINAL_VX));
      } else if (player.onplatform) {
        player.vx = 0;
      } else {
        player.vx *= FRICTION * df;
      }

      player.vy += GRAVITY * df;

      player.x += player.vx * df;
      player.y += player.vy * df;

      player.animate();

      if (player.x < world.left) {
        player.x = world.left;
        player.vx = 0;
      }
      if (player.x + player.width > world.right) {
        player.x = world.right - player.width;
      }

      player.y += camera_movement;

      if (camera_movement > 0 && Math.random() < PLATFORM_SPAWN * df) {
        tgame.entities.platforms.push(spawnPlatform(world.top - PLATFORM_DOUBLE_RANGE, world.left, world.right));
      }

      tgame.entities.platforms.forEach(function(platform) {

        platform.translate(0, camera_movement);

        if (platform.origin_y - platform.range_y > world.bottom) {
          platform.remove = true;
        }

        platform.updatePosition(Date.now());

        var collision = checkCollision(player, platform);
        var side = collision ? collision.side : null;

        if (collision) {

          if (side === "bottom") {
            if (!collisions.bottom || platform.y < collisions.bottom.y) {
              collisions.bottom = platform;
            }
          }
          if (side === "top") {
            if (!collisions.top || platform.y > collisions.top.y) {
              collisions.top = platform;
            }
          }
          if (side === "left") {
            if (!collisions.left || platform.x > collisions.left.x) {
              collisions.left = platform;
            }
          }
          if (side === "right") {
            if (!collisions.right || platform.x < collisions.right.x) {
              collisions.right = platform;
            }
          }
        }

      });

      resolveCollisions(player, collisions);

      if (player.onplatform) {
        player.x += player.onplatform.vx;
        player.y = player.onplatform.y - player.height;
        player.vy = 0;
        if (player.x + player.width < player.onplatform.x + Math.min(2 * player.vx, 0) ||
            player.x > player.onplatform.x + player.onplatform.width + Math.max(2 * player.vx, 0)) {
          player.onplatform = null;
        }
      }

      camera_movement = Math.max(0, world.top_boundary - player.y);

      height = Math.max(0, Math.round(height - player.y + player.last_y + camera_movement));
      height = height < 10 ? 0 : height;
      height_message.text = "Height: " + height;

      max_height = Math.max(max_height, height);
      max_height_message.text = "Max height: " + max_height;

      if (player.y > world.bottom + PLATFORM_DOUBLE_RANGE) {
        tgame.state = "OVER";
      }
    },

    OVER: function() {
      localStorage.high_score = Math.max(parseInt(localStorage.high_score, 10), max_height);

      game_over_message.hidden = false;
      score_message.text = "Maximum Height This Round: " + max_height;
      score_message.hidden = false;
      hi_score_message.text = "Maximum Height All Time: " + localStorage.high_score;
      hi_score_message.hidden = false;
      restart_message.hidden = false;
      tgame.state = "PLAY";
    }
  };

  tgame.state = "INIT";
  tgame.start();

  function spawnPlatform(y, left, right, bottom) {
    var box = createPlatform({
      x: Math.random() * (world.right - world.left - PLATFORM_DIM) + world.left,
      y: y,
      width: Math.random() * PLATFORM_DIM + 1,
      height: Math.random() * PLATFORM_DIM + 1,
      color: PLATFORM_COLOR,
      range_x: Math.random() < 0.1 ? Math.random() * PLATFORM_RANGE : 0,
      range_y: Math.random() < 0.1 ? Math.random() * PLATFORM_RANGE : 0
    });

    if (box.range_x) {
      if (box.origin_x - box.range_x < left) {
        box.range_x = (box.origin_x - left);
      } else if (box.origin_x + box.width + box.range_x > right) {
        box.range_x = (right - box.width - box.origin_x);
      }
    }

    if (box.range_y && typeof bottom === "number") {
      if (box.origin_y + box.height + box.range_y > bottom) {
        box.range_y = (bottom - box.height - box.origin_y);
      }
    }

    return box;
  }

  function checkCollision(player, platform) {
    var player_half_width = player.width * 0.5;
    var player_half_height = player.height * 0.5;
    var relative_vx = player.relativeVX(platform);
    var relative_vy = player.relativeVY(platform);

    var v = Math.sqrt(relative_vx * relative_vx + relative_vy * relative_vy) || 1;
    var nvx = relative_vx / v;
    var nvy = relative_vy / v;

    if (player.x + player.width < platform.x) return null;
    if (player.y + player.height < platform.y) return null;
    if (player.x > platform.x + platform.width) return null;
    if (player.y > platform.y + platform.height) return null;

    var min_dim = Math.min(player_half_width, player_half_height);
    var x_increment = min_dim * nvx;
    var y_increment = min_dim * nvy;

    var player_x = player.x;
    var player_y = player.y;
    var x = player.last_x;
    var y = player.last_y;
    var collision;

    var conditionX;
    var conditionY;

    if (x_increment < 0) {
      conditionX = function(x) {
        return x > player_x;
      };
    } else if (x_increment > 0){
      conditionX = function(x) {
        return x < player_x;
      };
    } else {
      conditionX = function() {
        return false;
      };
    }

    if (y_increment < 0) {
      conditionY = function(y) {
        return y > player_y;
      };
    } else if (y_increment > 0) {
      conditionY = function(y) {
        return y < player_y;
      };
    } else {
      conditionY = function() {
        return false;
      };
    }

    while (conditionX(x) || conditionY(y)) {
      player.x = x;
      player.y = y;

      collision = tgame.collision.rectangle(player, platform);

      if (collision) break;

      x += x_increment;
      y += y_increment;
    }

    player.x = player_x;
    player.y = player_y;

    collision = collision || tgame.collision.rectangle(player, platform);

    if (!collision) return null;

    var vx = Math.max(Math.abs(relative_vx), 1);
    var vy = Math.max(Math.abs(relative_vy), 1);

    var v_ratio = Math.max(0.5, Math.min(vx / vy, 1.5));
    var side;

    if (collision.overlap_y * v_ratio < collision.overlap_x) {
      side = collision.dy > 0 ? "bottom" : "top";
    } else {
      side = collision.dx > 0 ? "right" : "left";
    }
    collision.side = side;

    return collision;
  }

  function resolveCollisions(player, collisions) {
    var left = collisions.left;
    var right = collisions.right;
    var top = collisions.top;
    var bottom = collisions.bottom;

    if (bottom && !top) {
      player.y = bottom.y - player.height;
      player.onplatform = bottom;
      player.vy = 0;
    } else if (top && !bottom) {
      player.y = top.y + top.height;
      player.vy = Math.max(0, top.vy);
    } else if (top && bottom) {
      if (bottom.range_y && !top.range_y) {
        player.y = top.y + top.height;
        bottom.y = player.y + player.height + 0.1;
        bottom.top_limit = bottom.y;
        if (bottom.range_x) {
          if (bottom.vx < 0) {
            bottom.left_limit = bottom.x;
          } else {
            bottom.right_limit = bottom.x;
          }
        }
      } else if (!bottom.range_y && top.range_y) {
        player.y = bottom.y - player.height;
        top.y = player.y - top.height - 0.1;
        top.bottom_limit = top.y;
        if (top.range_x) {
          if (top.vx < 0) {
            top.left_limit = top.x;
          } else {
            top.right_limit = top.x;
          }
        }
      } else if (bottom.range_y && top.range_y) {
        bottom.y = player.y + player.height;
        bottom.top_limit = bottom.y;
        if (bottom.range_x) {
          if (bottom.vx < 0) {
            bottom.left_limit = bottom.x;
          } else {
            bottom.right_limit = bottom.x;
          }
        }
        top.y = player.y - top.height - 0.1;
        top.bottom_limit = top.y;
        if (top.range_x) {
          if (top.vx < 0) {
            top.left_limit = top.x;
          } else {
            top.right_limit = top.x;
          }
        }
      } else {
        player.y = bottom.y - player.height;
        top.y = player.y - top.height - 0.1;
        top.origin_y = top.y;
      }
      player.onplatform = bottom;
      player.vy = 0;
    }

    if (left && !tgame.collision.rectangle(player, left)) left = null;
    if (right && !tgame.collision.rectangle(player, right)) right = null;

    if (right && !left) {
      player.x = right.x - player.width;
      player.vx = Math.min(0, player.vx + right.vx);
    } else if (left && !right) {
      player.x = left.x + left.width;
      player.vx = Math.max(0, player.vx + left.vx);
    } else if (left && right) {
      if (right.range_x && !left.range_x) {
        player.x = left.x + left.width;
        right.x = player.x + player.width + 0.1;
        player.vx = Math.min(0, right.vx);
        right.left_limit = right.x;
        if (right.range_y) {
          if (right.vy < 0) {
            right.top_limit = right.y;
          } else {
            right.bottom_limit = right.y;
          }
        }
      } else if (!right.range_x && left.range_x){
        player.x = right.x - player.width;
        left.x = player.x - left.width - 0.1;
        player.vx = Math.max(0, left.vx);
        left.right_limit = left.x;
        if (left.range_y) {
          if (left.vy < 0) {
            left.top_limit = left.y;
          } else {
            left.bottom_limit = left.y;
          }
        }
      } else if (right.range_x && left.range_x) {
        right.x = player.x + player.width + 0.1;
        right.left_limit = right.x;
        if (right.range_y) {
          if (right.vy < 0) {
            right.top_limit = right.y;
          } else {
            right.bottom_limit = right.y;
          }
        }
        left.x = player.x - left.width - 0.1;
        left.right_limit = left.x;
        if (left.range_y) {
          if (left.vy < 0) {
            left.top_limit = left.y;
          } else {
            left.bottom_limit = left.y;
          }
        }
        player.vx = 0;
      } else {
        if (left.y < right.y) {
          player.x = left.x + left.width + 0.1;
          bottom = right;
        } else {
          player.x = right.x - player.width - 0.1;
          bottom = left;
        }
        player.y = bottom.y - player.height - 0.1;
        player.onplatform = bottom;
      }
    }

  }

})();
