(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var Application, Game;

Game = require('coffee/game');

module.exports = Application = (function() {
  function Application() {}

  Application.init = function() {
    var canvas, game, height, width;
    height = window.innerHeight;
    width = window.innerWidth;
    canvas = document.getElementById("gameCanvas");
    canvas = canvas.getContext("2d");
    canvas.canvas.height = Math.floor(height / 96) * 96;
    canvas.canvas.width = Math.floor(width / 96) * 96;
    console.log("Initializing!");
    return game = new Game();
  };

  return Application;

})();
});

;require.register("coffee/character", function(exports, require, module) {
var Character,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Character = (function() {
  function Character(sprite) {
    this.checkCollisions = __bind(this.checkCollisions, this);
    this.init = __bind(this.init, this);
    this.playerBody = sprite;
  }

  Character.prototype.init = function(pos) {
    this.addChild(this.playerBody);
    this.x = pos.x;
    this.y = pos.y;
    this.width = this.playerBody.spriteSheet._frameWidth;
    return this.height = this.playerBody.spriteSheet._frameHeight;
  };

  Character.prototype.collide = function(them, vel) {
    var b, bottom, collision, l, left, meCenter, r, right, t, themCenter, top, v;
    top = this.y + this.height / 2;
    left = this.x;
    right = this.x + this.width;
    bottom = this.y + this.height;
    collision = {
      whore: false,
      green: false
    };
    r = them.right - left;
    l = them.left - right;
    t = them.top - bottom;
    b = them.bottom - top;
    themCenter = {
      x: them.left + (them.right - them.left) / 2,
      y: them.top + (them.bottom - them.top) / 2
    };
    meCenter = {
      x: left + (this.width / 2),
      y: bottom - (this.height / 4)
    };
    v = {
      x: themCenter.x - meCenter.x,
      y: themCenter.y - meCenter.y
    };
    if (Math.sqrt(v.x * v.x + v.y * v.y) <= this.diagonalHeight + them.diagonalHeight) {
      if (!(them.top <= top && them.bottom - this.MAX_VELOCITY <= top) && !(them.bottom >= bottom && them.top + this.MAX_VELOCITY >= bottom)) {
        if (v.x * vel.x > 0 && (r * vel.x < 0 || l * vel.x < 0)) {
          collision.whore = true;
        }
      }
      if (!(them.left <= left && them.right - this.MAX_VELOCITY <= left) && !(them.right >= right && them.left + this.MAX_VELOCITY >= right)) {
        if (v.y * vel.y > 0 && (t * vel.y < 0 || b * vel.y < 0)) {
          collision.green = true;
        }
      }
    }
    return collision;
  };

  Character.prototype.checkCollisions = function(child) {
    var dir, subchild, _i, _len, _ref;
    if (child instanceof createjs.Container && child.visible) {
      _ref = child.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subchild = _ref[_i];
        dir = this.checkCollision(subchild);
        if (dir.whore || dir.green) {
          return dir;
        }
      }
    } else {
      return this.checkCollision(child);
    }
    return {};
  };

  return Character;

})();
});

;require.register("coffee/collections", function(exports, require, module) {
var Quest, dialog, dialogs, quest, quests, _dialogs, _items, _quests;

Quest = require('coffee/models/quest');

_dialogs = require('coffee/data/dialogs');

_quests = require('coffee/data/quests');

_items = require('coffee/data/items');

quests = (function() {
  var _i, _len, _results;
  _results = [];
  for (_i = 0, _len = _quests.length; _i < _len; _i++) {
    quest = _quests[_i];
    _results.push(new Quest(quest));
  }
  return _results;
})();

dialogs = (function() {
  var _i, _len, _results;
  _results = [];
  for (_i = 0, _len = _dialogs.length; _i < _len; _i++) {
    dialog = _dialogs[_i];
    _results.push(dialog);
  }
  return _results;
})();

module.exports = {
  reset: function() {
    quests = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = _quests.length; _i < _len; _i++) {
        quest = _quests[_i];
        _results.push(new Quest(quest));
      }
      return _results;
    })();
    return dialogs = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = _dialogs.length; _i < _len; _i++) {
        dialog = _dialogs[_i];
        _results.push(dialog);
      }
      return _results;
    })();
  },
  findModel: function(id) {
    return _.find(dialogs.concat(quests).concat(_items), function(d) {
      return d.id === id;
    });
  }
};
});

;require.register("coffee/data/dialogs", function(exports, require, module) {
module.exports = [
  {
    id: 170,
    text: "A hole...",
    actions: [
      {
        type: "done",
        text: "I shouldn't"
      }, {
        type: "warp",
        text: "YEAH I SHOULD"
      }
    ]
  }, {
    id: 190,
    text: "Student Union Building.",
    actions: [
      {
        type: 'done',
        text: 'Cool'
      }
    ]
  }, {
    id: 191,
    text: "Clearihue - English and Klingon",
    actions: [
      {
        type: 'done',
        text: 'Cool'
      }
    ]
  }, {
    id: 192,
    text: "Cornett - So confusing it was turned into a literal maze. D:",
    actions: [
      {
        type: 'done',
        text: 'I bet there is something useful in here...'
      }
    ]
  }, {
    id: 193,
    text: "SSM - Math and Quantum Computing",
    actions: [
      {
        type: 'done',
        text: 'Cool'
      }
    ]
  }, {
    id: 194,
    text: "Elliot - Used to be physics, now its a prison",
    actions: [
      {
        type: 'done',
        text: 'Cool'
      }
    ]
  }, {
    id: 150,
    text: "What? Another Human??? If you want to survive the rabbit invasion go to SSM.",
    actions: [
      {
        type: 'queststart',
        text: 'What the hell..',
        value: {
          quest: 901
        }
      }
    ]
  }, {
    id: 151,
    text: "No new messages D:",
    actions: [
      {
        type: 'done',
        text: '...'
      }
    ]
  }, {
    id: 152,
    text: "I wonder if there is anything useful in this old barrel",
    actions: [
      {
        type: 'goto',
        text: 'Investigate',
        value: 153
      }, {
        type: 'done',
        text: 'Leave it'
      }
    ]
  }, {
    id: 153,
    text: "You find a sword!",
    actions: [
      {
        type: "questpart",
        text: "Those bunnies don't stand a chance.",
        value: {
          quest: 901,
          part: 850
        }
      }
    ]
  }, {
    id: 161,
    text: "Pssst ...",
    actions: [
      {
        type: "goto",
        text: "What the...",
        value: 162
      }, {
        type: "done",
        text: "Leave."
      }
    ]
  }, {
    id: 162,
    text: "Thank god you're here. My hip is out, I need your help!",
    actions: [
      {
        type: "goto",
        text: "What can I do?",
        value: 163
      }, {
        type: "gameover",
        text: "Kill the old man",
        value: "The old man was your only hope..."
      }
    ]
  }, {
    id: 163,
    text: "Oh, I see you found Turpin, the bunny killer. Instead you should look for the bunny remote.",
    actions: [
      {
        type: "goto",
        text: "What is the bunny remote?",
        value: 164
      }, {
        type: "done",
        text: "Nah, i <3 bloodshed"
      }
    ]
  }, {
    id: 164,
    text: "It’s a device to disconnect the bunnies from Dr. Antagonist’s control.",
    actions: [
      {
        type: "goto",
        text: "Where do I look",
        value: 165
      }
    ]
  }, {
    id: 165,
    text: "I’ve hidden pieces around campus so Dr. Antaggy doesn’t find it. First, get the deactivator. It’s near building 451.",
    actions: [
      {
        type: "queststart",
        text: "Word.",
        value: {
          quest: 911
        }
      }
    ]
  }, {
    id: 171,
    text: "Library Closed. Analog books no longer exist.",
    actions: [
      {
        type: "done",
        text: "Hmm...What an interesting critique of the future."
      }
    ]
  }, {
    id: 172,
    text: "The deactivator is hidden behind some grass below this note. It will serve you well. But, if you really want to defeat the bunnies, you must deactivate them all at once. ",
    actions: [
      {
        type: "goto",
        text: "Hmm....",
        value: 173
      }
    ]
  }, {
    id: 173,
    text: "To do so, you will need carrots as bait. Also, a trap and the signal amplifier. Go back to the old man after you get everything.",
    actions: [
      {
        type: 'questpart',
        text: "Time to erabbicate these bastards.",
        value: {
          quest: 911,
          part: 861
        }
      }
    ]
  }, {
    id: 174,
    text: "Oh, I see you found my note. Did you collect all of the items?",
    actions: [
      {
        type: 'questpart',
        text: "Yep!",
        value: {
          quest: 911,
          part: 862,
          fail: 176,
          success: 177
        }
      }, {
        type: 'goto',
        text: "What were they again?",
        value: 175
      }
    ]
  }, {
    id: 176,
    text: "You're just a hare shy of having all the items.",
    actions: [
      {
        type: 'done',
        text: '*cringe*'
      }
    ]
  }, {
    id: 175,
    text: "The bunny remote, the signal amplier, the trap, and some carrots",
    actions: [
      {
        type: 'done',
        text: "Oh, right. Brb"
      }
    ]
  }, {
    id: 177,
    text: "Dude, you rock! Here is the Bunny Deactivator. If you don't know what to do, check your inventory (hit I)",
    actions: [
      {
        type: 'done',
        text: "Yay"
      }
    ]
  }, {
    id: 178,
    text: "GMO'd Carrots. If you eat them you will most likely die",
    actions: [
      {
        type: 'done',
        text: "These might come in handy"
      }, {
        type: 'gameover',
        text: "#yolo",
        value: "lol"
      }
    ]
  }
];
});

;require.register("coffee/data/items", function(exports, require, module) {
module.exports = [
  {
    id: 301,
    name: "Default",
    description: "This is just a development placeholder. Delete it !!! "
  }, {
    id: 302,
    name: "Default2",
    description: "This is just aNOTHER development placeholder. Delete it !!! "
  }, {
    id: 300,
    name: "Sword",
    description: "A sword named Turpin, the Bunny Slayer. Nobody is sure of the origin of this name.."
  }, {
    id: 351,
    name: "Bunny Remote",
    type: "remote",
    description: "Not sure how to turn this thing on....Maybe I should find a power source"
  }, {
    id: 352,
    type: 'carrot',
    name: "GMO Carrots",
    description: "I feel stronger just holding these carrots"
  }, {
    id: 353,
    type: 'amplifier',
    name: 'Signal Amplifier',
    description: "Broadcast signals twice as far with this amplifier. Lifetime Guarentee!"
  }, {
    id: 354,
    type: 'trap',
    name: 'Trap',
    description: "A pretty un-futuristic trap."
  }, {
    id: 666,
    type: "deactivator",
    name: "Bunny Deactivator",
    description: "Deactivate all the bunnies at once. Press B to use"
  }
];
});

;require.register("coffee/data/manifest", function(exports, require, module) {
module.exports = [
  {
    src: "/rabbitwrath/images/runningRpg.png",
    id: "player"
  }, {
    src: "/rabbitwrath/images/bunny1.png",
    id: "monster"
  }, {
    src: "/rabbitwrath/images/bunny2.png",
    id: "monster2"
  }, {
    src: "/rabbitwrath/images/bunny3.png",
    id: "monster3"
  }, {
    src: "/rabbitwrath/images/bunny4.png",
    id: "monster4"
  }, {
    src: "/rabbitwrath/images/bunny5.png",
    id: "monster5"
  }, {
    src: "/rabbitwrath/images/bunny1red.png",
    id: "monsterred"
  }, {
    src: "/rabbitwrath/images/bunny2red.png",
    id: "monster2red"
  }, {
    src: "/rabbitwrath/images/bunny3red.png",
    id: "monster3red"
  }, {
    src: "/rabbitwrath/images/bunny4red.png",
    id: "monster4red"
  }, {
    src: "/rabbitwrath/images/bunny5red.png",
    id: "monster5red"
  }, {
    src: "/rabbitwrath/images/blood.png",
    id: "bloodPool"
  }, {
    src: "/rabbitwrath/images/questBouncing.png",
    id: "questGiver"
  }, {
    src: "/rabbitwrath/images/exclamation.png",
    id: "exclamation"
  }, {
    src: "/rabbitwrath/images/question.png",
    id: "question"
  }, {
    src: "/rabbitwrath/images/arrow.png",
    id: "arrow"
  }, {
    src: "/rabbitwrath/images/sign.png",
    id: "sign"
  }, {
    src: "/rabbitwrath/images/barrel.png",
    id: "barrel"
  }, {
    src: "/rabbitwrath/images/blank.png",
    id: "blank"
  }, {
    src: "/rabbitwrath/images/trap.png",
    id: "trap"
  }, {
    src: "/rabbitwrath/images/noitem.png",
    id: "noitem"
  }, {
    src: "/rabbitwrath/images/amplifier.png",
    id: "amplifier"
  }, {
    src: "/rabbitwrath/images/carrot.png",
    id: "carrot"
  }, {
    src: "/rabbitwrath/images/remote.png",
    id: "remote"
  }, {
    src: "/rabbitwrath/images/note.png",
    id: "note"
  }, {
    src: "/rabbitwrath/images/deactivator.png",
    id: "deactivator"
  }, {
    src: "/rabbitwrath/images/player2.png",
    id: "player2"
  }, {
    src: "/rabbitwrath/images/music.mp3",
    id: "music"
  }, {
    src: "/rabbitwrath/images/sword.mp3",
    id: "sword"
  }, {
    src: "/rabbitwrath/images/punch.mp3",
    id: "punch",
    data: 1
  }, {
    src: "/rabbitwrath/images/splat.mp3",
    id: "splat"
  }
];
});

;require.register("coffee/data/npcs", function(exports, require, module) {
module.exports = [
  {
    dialogs: [
      {
        type: 'else',
        dialog: 190
      }
    ],
    id: 90,
    pos: {
      x: 7896,
      y: 8860
    },
    sprite: "signSprite"
  }, {
    dialogs: [
      {
        type: 'else',
        dialog: 191
      }
    ],
    id: 91,
    pos: {
      x: 8016,
      y: 6650
    },
    sprite: "signSprite"
  }, {
    dialogs: [
      {
        type: 'else',
        dialog: 192
      }
    ],
    id: 92,
    pos: {
      x: 8796,
      y: 4300
    },
    sprite: "signSprite"
  }, {
    dialogs: [
      {
        type: 'else',
        dialog: 193
      }
    ],
    id: 93,
    pos: {
      x: 8646,
      y: 1596
    },
    sprite: "signSprite"
  }, {
    dialogs: [
      {
        type: 'else',
        dialog: 194
      }
    ],
    id: 94,
    pos: {
      x: 1756,
      y: 5600
    },
    sprite: "signSprite"
  }, {
    dialogs: [
      {
        type: 'queststart',
        quest: 901,
        dialog: 150,
        state: 'hasquest'
      }, {
        type: 'else',
        quest: 901,
        dialog: 151
      }
    ],
    id: 4,
    pos: {
      x: 8666,
      y: 8600
    },
    sprite: "signSprite"
  }, {
    dialogs: [
      {
        type: 'questpart',
        quest: 901,
        part: 850,
        dialog: 152,
        state: 'return'
      }
    ],
    id: 5,
    pos: {
      x: 5836,
      y: 220
    },
    sprite: "barrelSprite"
  }, {
    dialogs: [
      {
        type: 'queststart',
        quest: 911,
        dialog: 161,
        state: 'hasquest'
      }, {
        type: 'questpart',
        quest: 911,
        part: 862,
        dialog: 174,
        state: 'return'
      }
    ],
    id: 6,
    pos: {
      x: 4146,
      y: 3820
    },
    sprite: "blank",
    size: {
      x: 2,
      y: 2
    }
  }, {
    dialogs: [
      {
        type: 'questpart',
        quest: 911,
        part: 861,
        dialog: 172,
        state: 'return'
      }
    ],
    id: 8,
    pos: {
      x: 3200,
      y: 9000
    },
    sprite: "noteSprite"
  }, {
    dialogs: [
      {
        type: 'else',
        dialog: 178
      }
    ],
    id: 9,
    pos: {
      x: 7180,
      y: 2930
    },
    sprite: "noteSprite"
  }, {
    dialogs: [
      {
        type: 'easteregg',
        dialog: 171
      }
    ],
    id: 7,
    pos: {
      x: 4946,
      y: 8600
    },
    sprite: "signSprite"
  }
];
});

;require.register("coffee/data/quests", function(exports, require, module) {
module.exports = [
  {
    name: "First Quest",
    pos: 0,
    id: 900,
    npc: 2,
    ordered: true,
    markers: [
      {
        pos: 0,
        id: 801,
        description: "Talk to Donkey",
        npc: 3
      }, {
        pos: 1,
        id: 802,
        description: "Get banana from Diddy",
        npc: 2
      }
    ],
    onComplete: {
      type: "item",
      id: 300
    }
  }, {
    name: "message left by man quest",
    pos: 0,
    id: 901,
    npc: 4,
    ordered: true,
    markers: [
      {
        pos: 0,
        id: 850,
        description: "GO to SSM",
        npc: 5
      }
    ],
    onComplete: {
      type: "item",
      id: 300
    }
  }, {
    name: "Main quest to get the bunny killing device",
    pos: 0,
    id: 911,
    npc: 6,
    ordered: true,
    markers: [
      {
        pos: 0,
        id: 861,
        description: "Get the remote",
        npc: 8
      }, {
        pos: 1,
        id: 862,
        description: "Check if have all supplies",
        npc: 6,
        cond: {
          type: "inventory",
          items: [351, 352, 353, 354]
        }
      }
    ],
    onComplete: {
      type: "cb",
      name: "finishMain"
    }
  }
];
});

;require.register("coffee/dialog", function(exports, require, module) {
var Collections, Controls, DialogManager, wrap,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Collections = require('coffee/collections');

wrap = require('coffee/utils').wrap;

DialogManager = (function() {
  function DialogManager(delegate) {
    var _ref;
    this.delegate = delegate;
    this.keyPress = __bind(this.keyPress, this);
    this.close = __bind(this.close, this);
    this.showDialog = __bind(this.showDialog, this);
    this.createText = __bind(this.createText, this);
    _ref = this.delegate, this.canvas = _ref.canvas, this.stage = _ref.stage, this.endAction = _ref.endAction, this.setQuest = _ref.setQuest, this.gameover = _ref.gameover;
    this.currentDialog = null;
    this.dialog = null;
    this.lines = [];
    this.margin = 40;
    this.padding = 40;
    this.w = this.stage.canvas.width - this.margin * 2;
    this.h = 160;
  }

  DialogManager.prototype.createBox = function(pos) {
    this.box = new createjs.Shape();
    this.box.graphics.beginStroke("rgb(230,230,230)");
    this.box.graphics.beginFill("black");
    this.box.graphics.setStrokeStyle(2);
    this.box.snapToPixel = true;
    this.box.graphics.drawRect(pos.x, pos.y, this.w, this.h);
    return this.stage.addChild(this.box);
  };

  DialogManager.prototype.createText = function(pos, dialog) {
    var i, line, lines, text, _i, _len, _results;
    lines = wrap(this.canvas.getContext('2d'), dialog.text, this.w - this.padding * 2, "26px VT323");
    i = 0;
    _results = [];
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      text = new createjs.Text(line, "26px VT323", "rgb(0,255,0)");
      text.x = pos.x + this.padding;
      text.y = pos.y + i * 30 + this.padding;
      text.snapToPixel = true;
      text.textBaseline = "alphabetic";
      this.stage.addChild(text);
      this.lines.push(text);
      _results.push(i++);
    }
    return _results;
  };

  DialogManager.prototype.showDialog = function(id) {
    var dialog, pos;
    dialog = Collections.findModel(id);
    pos = {
      x: this.stage.x * -1 + this.margin,
      y: this.stage.y * -1 + this.stage.canvas.height - this.h - this.margin
    };
    this.createBox(pos);
    this.createText(pos, dialog);
    return this.dialog = new Controls(dialog, pos, this);
  };

  DialogManager.prototype.close = function() {
    var text, _i, _len, _ref;
    _ref = this.lines;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      text = _ref[_i];
      this.stage.removeChild(text);
    }
    this.lines = [];
    this.stage.removeChild(this.box);
    this.currentDialog = null;
    return this.dialog = null;
  };

  DialogManager.prototype.keyPress = function(key) {
    switch (key) {
      case "left":
      case "right":
        return this.dialog.changeSelection(key);
      case "enter":
        return this.dialog.enterPress();
      case "esc":
        this.dialog.close();
        return this.endAction();
    }
  };

  return DialogManager;

})();

Controls = (function() {
  function Controls(dialog, pos, delegate) {
    var action, button, i, _i, _len, _ref, _ref1;
    this.dialog = dialog;
    this.delegate = delegate;
    this.close = __bind(this.close, this);
    this.handleNext = __bind(this.handleNext, this);
    this.enterPress = __bind(this.enterPress, this);
    _ref = this.delegate, this.delegateClose = _ref.close, this.stage = _ref.stage, this.showDialog = _ref.showDialog, this.endAction = _ref.endAction, this.padding = _ref.padding, this.h = _ref.h, this.setQuest = _ref.setQuest, this.gameover = _ref.gameover;
    this.active = 0;
    this.buttons = [];
    i = 0;
    _ref1 = dialog.actions;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      action = _ref1[_i];
      button = new createjs.Text(action.text, "26px VT323", i === 0 ? "white" : "rgb(0,255,0)");
      button.x = pos.x + this.padding + i * 300;
      button.y = pos.y + this.h - this.padding;
      button.textBaseline = "alphabetic";
      button.addEventListener("click", _.partial(this.handleNext, action, _));
      this.buttons.push(button);
      this.stage.addChild(button);
      i++;
    }
  }

  Controls.prototype.changeSelection = function(direction) {
    if (direction === "right" && this.active < this.buttons.length - 1) {
      this.buttons[this.active].color = "rgb(0,255,0)";
      this.active++;
    } else if (direction === "left" && this.active > 0) {
      this.buttons[this.active].color = "rgb(0,255,0)";
      this.active--;
    }
    return this.buttons[this.active].color = "white";
  };

  Controls.prototype.enterPress = function() {
    return this.buttons[this.active].dispatchEvent('click');
  };

  Controls.prototype.handleNext = function(action, data, ev) {
    var next, partComplete, quest;
    if (action.type === 'goto') {
      next = action.value;
      this.close();
      if (!next) {
        this.endAction();
        return;
      }
      this.showDialog(next);
    } else if (action.type === 'gameover') {
      this.close();
      this.endAction();
      this.gameover(action.value || "You lost..");
    } else if (action.type === 'queststart') {
      if ((quest = Collections.findModel(action.value.quest))) {
        quest.start();
        this.setQuest(quest);
      }
      this.close();
      this.endAction();
    } else if (action.type === 'questpart') {
      if ((quest = Collections.findModel(action.value.quest)) != null) {
        partComplete = quest.completePart(action.value.part);
        next = partComplete ? action.value.success : action.value.fail;
        this.close();
        if (!next) {
          this.endAction();
        } else {
          this.showDialog(next);
        }
      } else {
        this.close();
        this.endAction();
      }
    } else {
      this.close();
      this.endAction();
    }
    return ev.stopPropagation();
  };

  Controls.prototype.close = function() {
    var button, _i, _len, _ref;
    _ref = this.buttons;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      button = _ref[_i];
      this.stage.removeChild(button);
    }
    this.buttons = [];
    return this.delegateClose();
  };

  return Controls;

})();

module.exports = {
  DialogManager: DialogManager
};
});

;require.register("coffee/game", function(exports, require, module) {
var Collections, DialogManager, Game, Home, Instructions, Intro, Inventory, KeyInput, Level, Manifest, Map, Monster, NPC, Player, Sprites, Win, _npcs,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Intro = require('coffee/intro');

KeyInput = require('coffee/input');

Player = require('coffee/player');

Monster = require('coffee/monster');

Level = require('coffee/level');

NPC = require('coffee/npc');

DialogManager = require('coffee/dialog').DialogManager;

Inventory = require('coffee/inventory');

_npcs = require('coffee/data/npcs');

Manifest = require('coffee/data/manifest');

Sprites = require('coffee/system/sprites');

Collections = require('coffee/collections');

Map = require('coffee/map');

Home = require('coffee/home');

Instructions = require('coffee/instructions');

Win = require('coffee/win');

module.exports = Game = (function() {
  function Game() {
    this.showWin = __bind(this.showWin, this);
    this.showInstructions = __bind(this.showInstructions, this);
    this.showHome = __bind(this.showHome, this);
    this.startGame = __bind(this.startGame, this);
    this.gameover = __bind(this.gameover, this);
    this.endInventory = __bind(this.endInventory, this);
    this.endAction = __bind(this.endAction, this);
    this.startDialog = __bind(this.startDialog, this);
    this.tick = __bind(this.tick, this);
    this.objectClick = __bind(this.objectClick, this);
    this.monsterClick = __bind(this.monsterClick, this);
    this.characterClick = __bind(this.characterClick, this);
    this.itemClick = __bind(this.itemClick, this);
    this.restart = __bind(this.restart, this);
    this.isSoundOn = __bind(this.isSoundOn, this);
    this.toggleSound = __bind(this.toggleSound, this);
    this.spawnMonsters = __bind(this.spawnMonsters, this);
    this.handleComplete = __bind(this.handleComplete, this);
    this.setQuest = __bind(this.setQuest, this);
    this.handleClick = __bind(this.handleClick, this);
    this.init = __bind(this.init, this);
    this.addLoadingText = __bind(this.addLoadingText, this);
    this.clearModes = __bind(this.clearModes, this);
    this.IN_ACTION = false;
    this.IN_INVENTORY = false;
    this.MAP_OPEN = false;
    this.INTRO = false;
    this.HOME = true;
    this.INSTR = false;
    this.WIN = false;
    this.GAME_OVER = false;
    this.npcs = [];
    this.monsters = [];
    this.keyInput = new KeyInput;
    this.init();
    this.currentQuest = null;
    this.healthBar = null;
    this.itemsInteractedWith = [];
    this.charsInteractedWith = [];
    this.monstersInteractedWith = [];
  }

  Game.prototype.clearModes = function() {
    this.INTRO = false;
    this.HOME = false;
    this.INSTR = false;
    this.GAME_OVER = false;
    return this.WIN = false;
  };

  Game.prototype.addLoadingText = function() {
    var ctx, loadingText, x;
    this.stage.x = 0;
    this.stage.y = 0;
    loadingText = "Loading...hold tight, this may take a hare";
    ctx = this.stage.canvas.getContext('2d');
    ctx.font = "40px Arial";
    x = this.stage.canvas.width / 2 - ctx.measureText(loadingText).width / 2;
    this.loadingText = new createjs.Text(loadingText, "40px Arial", "white");
    this.loadingText.x = x;
    this.loadingText.y = this.stage.canvas.height / 2 - 100;
    this.loadingText.snapToPixel = true;
    this.loadingText.textBaseline = "alphabetic";
    this.stage.addChild(this.loadingText);
    return this.stage.update();
  };

  Game.prototype.init = function() {
    var manifest;
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.onselectstart = function() {
      return false;
    };
    this.stage = new createjs.Stage(this.canvas);
    this.addLoadingText();
    this.img = document.createElement('img');
    this.img.src = '/rabbitwrath/images/map.png';
    this.dialogManager = new DialogManager(this);
    this.inventory = new Inventory(this);
    this.map = new Map(this.stage, this.img);
    manifest = Manifest || [];
    this.loader = new createjs.LoadQueue(false);
    this.loader.installPlugin(createjs.Sound);
    this.loader.addEventListener("complete", this.handleComplete);
    this.loader.loadManifest(manifest);
    this.intro = new Intro(this);
    this.home = new Home(this);
    this.instructions = new Instructions(this);
    this.win = new Win(this);
    this.stage.update();
    return this.soundOn = true;
  };

  Game.prototype.handleClick = function() {
    return this.canvas.onclick = null;
  };

  Game.prototype.setQuest = function(quest) {
    return this.currentQuest = quest;
  };

  Game.prototype.handleComplete = function(event) {
    var _this = this;
    _.each(Sprites, function(val, name) {
      if (name !== 'blankSprite') {
        return _this[name] = val(_this.loader);
      }
    });
    this.stage.removeChild(this.loadingText);
    if (!createjs.Ticker.hasEventListener("tick")) {
      createjs.Ticker.addEventListener("tick", this.tick);
    }
    if (this.isSoundOn()) {
      return createjs.Sound.play('music', createjs.Sound.INTERRUPT_NONE, 0, 0, true, 1);
    }
  };

  Game.prototype.spawnMonsters = function(diff) {
    var color, i, monster, num, playerPos, _i, _results;
    num = diff === 1 ? 1200 : 800;
    _results = [];
    for (i = _i = 0; _i <= num; i = _i += 1) {
      playerPos = {
        x: Math.random() * 9200,
        y: Math.random() * 9200
      };
      if (this.level.checkHitsAtPosition(playerPos.x, playerPos.y)) {
        continue;
      }
      color = Math.floor(Math.random() * 5);
      switch (color) {
        case 0:
          monster = _.extend(new Monster(_.clone(this.monsterSprite), _.clone(this.monsterRedSprite), this), new createjs.Container());
          break;
        case 1:
          monster = _.extend(new Monster(_.clone(this.monster2Sprite), _.clone(this.monsterRed2Sprite), this), new createjs.Container());
          break;
        case 2:
          monster = _.extend(new Monster(_.clone(this.monster3Sprite), _.clone(this.monsterRed3Sprite), this), new createjs.Container());
          break;
        case 3:
          monster = _.extend(new Monster(_.clone(this.monster4Sprite), _.clone(this.monsterRed4Sprite), this), new createjs.Container());
          break;
        case 4:
          monster = _.extend(new Monster(_.clone(this.monster5Sprite), _.clone(this.monsterRed5Sprite), this), new createjs.Container());
      }
      monster.init(playerPos, this.bloodSprite);
      this.stage.addChild(monster);
      _results.push(this.monsters.push(monster));
    }
    return _results;
  };

  Game.prototype.toggleSound = function() {
    if (this.soundOn) {
      createjs.Sound.stop('music', createjs.Sound.INTERRUPT_NONE, 0, 0, true, 1);
      return this.soundOn = false;
    } else {
      createjs.Sound.play('music', createjs.Sound.INTERRUPT_NONE, 0, 0, true, 1);
      return this.soundOn = true;
    }
  };

  Game.prototype.isSoundOn = function() {
    return this.soundOn;
  };

  Game.prototype.restart = function() {
    var monster, npc, npcData, playerPos, sprite, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2;
    if (this.isSoundOn()) {
      createjs.Sound.stop('music', createjs.Sound.INTERRUPT_NONE, 0, 0, true, 1);
      createjs.Sound.play('music', createjs.Sound.INTERRUPT_NONE, 0, 0, true, 1);
    }
    Collections.reset();
    this.stage.removeAllChildren();
    Inventory.items = [];
    this.stage.clear();
    this.stage.x = -(9600 - this.stage.canvas.width);
    this.stage.y = -(9600 - this.stage.canvas.height);
    this.npcs = [];
    this.monsters = [];
    if (!this.player) {
      this.player = _.extend(new Player(this), new createjs.Container());
      this.player.init();
      window.p = this.player;
    }
    playerPos = {
      x: 8400,
      y: 9300
    };
    this.player.restart(playerPos);
    this.level = new Level(this);
    this.keyInput.reset();
    this.spawnMonsters(this.difficulty);
    for (_i = 0, _len = _npcs.length; _i < _len; _i++) {
      npcData = _npcs[_i];
      if (npcData.sprite == null) {
        sprite = _.clone(this.playerSprite);
      } else if (npcData.sprite === 'blank') {
        sprite = _.clone(Sprites.blankSprite(this.loader, npcData.size.x, npcData.size.y));
      } else {
        sprite = _.clone(this[npcData.sprite]);
      }
      npc = _.extend(new NPC(this, sprite), new createjs.Container());
      npc.init(npcData);
      this.stage.addChild(npc);
      this.npcs.push(npc);
    }
    this.stage.addChild(this.player);
    this.healthBar = new createjs.Shape();
    this.healthBar.graphics.beginStroke("#000");
    this.healthBar.graphics.beginFill("rgb(0,255,0)");
    this.healthBar.graphics.setStrokeStyle(2);
    this.healthBar.snapToPixel = true;
    this.healthBar.graphics.drawRect(this.player.x - 70, this.player.y - 65, 150 * (this.player.health / this.player.healthMax), 15);
    this.healthBar.visible = true;
    this.stage.addChild(this.healthBar);
    switch (this.difficulty) {
      case 1:
        this.player.health = 10;
        this.player.healthMax = 10;
        _ref = this.monsters;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          monster = _ref[_j];
          monster.life = 5;
          monster.MAX_VELOCITY = 8;
        }
        return this.player.knockback = false;
      case 666:
        this.player.health = 1;
        this.player.healthMax = 1;
        _ref1 = this.monsters;
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          monster = _ref1[_k];
          monster.life = 5;
          monster.MAX_VELOCITY = 5;
        }
        return this.player.knockback = false;
      default:
        this.player.health = 15;
        this.player.healthMax = 15;
        _ref2 = this.monsters;
        for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
          monster = _ref2[_l];
          monster.life = 2;
          monster.MAX_VELOCITY = 5;
        }
        return this.player.knockback = true;
    }
  };

  Game.prototype.itemClick = function(item, data, ev) {
    this.itemsInteractedWith.push(item);
    return this.objectClick(ev);
  };

  Game.prototype.characterClick = function(char, data, ev) {
    this.charsInteractedWith.push(char);
    return this.objectClick(ev);
  };

  Game.prototype.monsterClick = function(monster, data, ev) {
    this.monstersInteractedWith.push(monster);
    return this.objectClick(ev);
  };

  Game.prototype.objectClick = function(ev) {
    this.player.gotoPos = null;
    return ev.stopPropagation();
  };

  Game.prototype.tick = function(event) {
    var char, ctx, dialog, esc, i, item, keys, monster, moving, npc, text, x, _i, _j, _len, _ref, _ref1, _ref2,
      _this = this;
    if (this.WIN) {
      if (!this.win.visible) {
        this.win.show();
      }
      this.win.tick(event);
      return;
    }
    if (this.HOME) {
      if (!this.home.visible) {
        this.home.show();
      }
      this.stage.x = 0;
      this.stage.y = 0;
      this.home.tick(event);
      return;
    }
    if (this.INSTR) {
      if (!this.instructions.visible) {
        this.instructions.show();
      }
      this.stage.x = 0;
      this.stage.y = 0;
      this.instructions.tick(event);
      return;
    }
    if (this.INTRO) {
      if (!this.intro.visible) {
        this.intro.show();
      }
      this.stage.x = 0;
      this.stage.y = 0;
      this.intro.tick(event);
      if (this.keyInput.escHeld) {
        this.restart();
        this.INTRO = false;
      }
      return;
    }
    if (this.GAME_OVER) {
      if (this.keyInput.escHeld) {
        this.stage.removeAllChildren();
        this.showHome();
      }
      if (this.GAME_OVER && this.GAME_OVER !== 'fin') {
        this.stage.update();
        this.stage.x = 0;
        this.stage.y = 0;
        text = new createjs.Text(this.GAME_OVER, "26px Arial", "white");
        ctx = this.stage.canvas.getContext('2d');
        ctx.font = "26px Arial";
        x = this.stage.canvas.width / 2 - ctx.measureText(this.GAME_OVER).width / 2;
        text.x = x;
        text.y = this.stage.canvas.height / 2 - 100;
        text.snapToPixel = true;
        text.textBaseline = "alphabetic";
        esc = new createjs.Text("(esc to go back)", "14px Arial", "white");
        esc.x = x;
        esc.y = this.stage.canvas.height / 2;
        esc.snapToPixel = true;
        esc.textBaseline = "alphabetic";
        this.stage.addChild(text);
        this.stage.addChild(esc);
        this.stage.update();
        this.GAME_OVER = "fin";
      }
      return;
    }
    keys = [];
    if (this.player == null) {
      return;
    }
    if ((_ref = this.currentQuest) != null ? _ref.isComplete : void 0) {
      this.currentQuest = null;
      this.stage.removeChild(this.questArrow);
      this.questArrow = null;
    }
    if (((item = (this.itemsInteractedWith.splice(0, 1))[0]) != null) && this.player.checkDistance(item, 200)) {
      Inventory.items.push(item.id);
      this.inventory.refresh();
      this.stage.removeChild(item);
      item.visible = false;
    }
    if (((char = (this.charsInteractedWith.splice(0, 1))[0]) != null) && this.player.checkDistance(char, 300)) {
      if ((dialog = char.getDialog()) != null) {
        this.startDialog(dialog);
      }
    }
    if (((monster = (this.monstersInteractedWith.splice(0, 1))[0]) != null) && this.player.checkDistance(monster, 300)) {
      this.player.damageBunny(monster);
    }
    if (this.keyInput.bHeld && _.contains(Inventory.items, 666)) {
      this.showWin();
    }
    if (!this.IN_DIALOG && !this.IN_INVENTORY) {
      if (this.keyInput.fwdHeld) {
        keys.push("up");
      }
      if (this.keyInput.dnHeld) {
        keys.push("down");
      }
      if (this.keyInput.lfHeld) {
        keys.push("left");
      }
      if (this.keyInput.rtHeld) {
        keys.push("right");
      }
      moving = this.player.accelerate(keys);
      if (moving) {
        this.level.checkDiv();
      }
      if (this.keyInput.spaceHeld) {
        this.keyInput.spaceHeld = false;
        this.player.punch();
      }
      if (this.keyInput.iHeld) {
        this.player.accelerate([]);
        this.IN_INVENTORY = true;
        this.keyInput.iHeld = false;
        this.inventory.showInventory();
      }
      if (this.keyInput.actionHeld) {
        this.player.accelerate([]);
        if (!this.player.checkNPCActions(this.npcs)) {
          if ((item = this.player.checkItemAcions(this.level.items)) != null) {
            Inventory.items.push(item.id);
            this.inventory.refresh();
            this.stage.removeChild(item);
            item.visible = false;
          }
        }
        this.keyInput.actionHeld = false;
      }
    } else if (!this.IN_INVENTORY) {
      if (this.keyInput.lfHeld) {
        this.dialogManager.keyPress("left");
        this.keyInput.lfHeld = false;
      } else if (this.keyInput.rtHeld) {
        this.dialogManager.keyPress("right");
        this.keyInput.rtHeld = false;
      }
      if (this.keyInput.enterHeld) {
        this.dialogManager.keyPress("enter");
        this.keyInput.enterHeld = false;
      } else if (this.keyInput.escHeld) {
        this.keyInput.escHeld = false;
        this.dialogManager.keyPress("esc");
      }
    } else {
      if (this.keyInput.escHeld || this.keyInput.iHeld) {
        this.keyInput.iHeld = false;
        this.inventory.keyPress("esc");
      } else if (this.keyInput.lfHeld) {
        this.keyInput.lfHeld = false;
        this.inventory.keyPress("left");
      } else if (this.keyInput.rtHeld) {
        this.keyInput.rtHeld = false;
        this.inventory.keyPress("right");
      }
    }
    if (this.keyInput.mHeld && !this.MAP_OPEN) {
      this.MAP_OPEN = true;
      this.map.update(this.stage, this.player.x, this.player.y, false);
    } else if (this.MAP_OPEN && !this.keyInput.mHeld) {
      this.MAP_OPEN = false;
      this.map.close();
    } else if (this.MAP_OPEN && this.keyInput.mHeld && moving) {
      this.map.close();
      this.map.update(this.stage, this.player.x, this.player.y, true);
    }
    this.healthBar.graphics.clear();
    this.healthBar.graphics.beginStroke("#000");
    this.healthBar.graphics.beginFill("rgb(" + (255 - Math.floor((this.player.health / this.player.healthMax) * 255)) + "," + Math.floor((this.player.health / this.player.healthMax) * 255) + ",0)");
    this.healthBar.graphics.setStrokeStyle(2);
    this.healthBar.snapToPixel = true;
    this.healthBar.graphics.drawRect(this.player.x + (150 - (150 * (this.player.health / this.player.healthMax))) / 2, this.player.y, 150 * (this.player.health / this.player.healthMax), 15);
    this.player.tick(event, this.level);
    _ref1 = this.npcs;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      npc = _ref1[_i];
      npc.tick(event, this.level);
    }
    for (i = _j = 0, _ref2 = this.monsters.length - 1; _j <= _ref2; i = _j += 1) {
      this.monsters[i].tick();
    }
    if (this.player.x > this.canvas.width * .5) {
      this.stage.x = -this.player.x + this.canvas.width * .5;
    }
    if (this.player.y > this.canvas.height * .5) {
      this.stage.y = -this.player.y + this.canvas.height * .5;
    }
    this.stage.update(event, this.level);
    return _.defer(function(quest) {
      var angle, len, partNPC, v;
      if (quest == null) {
        return;
      }
      if ((partNPC = quest.markers[quest.state]) == null) {
        return;
      }
      if ((npc = _.find(_this.npcs, function(npc) {
        return npc.id === partNPC.npc;
      })) == null) {
        return;
      }
      v = {
        x: (npc.x + npc.width / 2) - (_this.player.x + _this.player.width / 2),
        y: (npc.y + npc.height / 2) - (_this.player.y + _this.player.height / 2)
      };
      len = Math.sqrt(v.x * v.x + v.y * v.y);
      if (len > 200) {
        v.x /= len;
        v.y /= len;
        v.x *= 200;
        v.y *= 200;
      }
      angle = Math.atan2(v.y, v.x) * 180 / Math.PI;
      v.x += _this.player.x + _this.player.width / 2;
      v.y += _this.player.y + _this.player.height / 2;
      if (_this.questArrow) {
        _this.stage.removeChild(_this.questArrow);
      }
      _this.questArrow = _.clone(_this.arrowSprite);
      _this.questArrow.snapToPixel = true;
      _this.questArrow.x = v.x;
      _this.questArrow.y = v.y;
      _this.questArrow.rotation = angle;
      return _this.stage.addChild(_this.questArrow);
    }, this.currentQuest);
  };

  Game.prototype.startDialog = function(dialog) {
    this.IN_DIALOG = true;
    return this.dialogManager.showDialog(dialog);
  };

  Game.prototype.endAction = function() {
    this.player.gotoPos = null;
    return this.IN_DIALOG = false;
  };

  Game.prototype.endInventory = function() {
    return this.IN_INVENTORY = false;
  };

  Game.prototype.gameover = function(msg) {
    return this.GAME_OVER = msg;
  };

  Game.prototype.startGame = function(diff) {
    this.clearModes();
    this.stage.removeAllChildren();
    this.difficulty = diff || 0;
    return this.INTRO = true;
  };

  Game.prototype.showHome = function() {
    this.clearModes();
    this.stage.removeAllChildren();
    return this.HOME = true;
  };

  Game.prototype.showInstructions = function() {
    this.clearModes();
    this.stage.removeAllChildren();
    return this.INSTR = true;
  };

  Game.prototype.showWin = function() {
    this.clearModes();
    this.stage.removeAllChildren();
    return this.WIN = true;
  };

  return Game;

})();
});

;require.register("coffee/home", function(exports, require, module) {
var Home,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Home = (function() {
  function Home(delegate) {
    var _ref;
    this.delegate = delegate;
    this.tick = __bind(this.tick, this);
    this.close = __bind(this.close, this);
    this.addSound = __bind(this.addSound, this);
    this.addInstructions = __bind(this.addInstructions, this);
    this.addStartImp = __bind(this.addStartImp, this);
    this.addStartHard = __bind(this.addStartHard, this);
    this.addStart = __bind(this.addStart, this);
    this.addHeader = __bind(this.addHeader, this);
    this.show = __bind(this.show, this);
    _ref = this.delegate, this.stage = _ref.stage, this.startGame = _ref.startGame, this.keyInput = _ref.keyInput, this.toggleSound = _ref.toggleSound, this.showInstructions = _ref.showInstructions;
    this.components = [];
    this.controls = [];
    this.visible = false;
    this.selectedOption = 0;
    this.img = document.createElement('img');
    this.img.src = '/rabbitwrath/images/rw.png';
  }

  Home.prototype.show = function() {
    this.selectedOption = 0;
    this.visible = true;
    this.addHeader();
    this.addStart();
    this.addStartHard();
    this.addStartImp();
    this.addInstructions();
    return this.addSound();
  };

  Home.prototype.addHeader = function() {
    var header, scale;
    scale = 800 / this.img.width;
    header = new createjs.Bitmap(this.img);
    header.scaleX = scale;
    header.scaleY = 400 / this.img.height;
    header.x = this.stage.canvas.width / 2 - 400;
    header.y = 0;
    this.stage.addChild(header);
    return this.components.push(header);
  };

  Home.prototype.addStart = function() {
    var ctx, t, text, x,
      _this = this;
    t = "Play!";
    ctx = this.stage.canvas.getContext('2d');
    ctx.font = "36px Arial";
    x = this.stage.canvas.width / 2 - ctx.measureText(t).width / 2;
    text = new createjs.Text(t, "36px Arial", "white");
    text.x = x;
    text.y = 400;
    text.snapToPixel = true;
    text.textBaseline = "alphabetic";
    text.onSelect = function() {
      _this.startGame(0);
      return _this.close();
    };
    this.stage.addChild(text);
    this.components.push(text);
    this.controls.push(text);
    return this.stage.update();
  };

  Home.prototype.addStartHard = function() {
    var ctx, t, text, x,
      _this = this;
    t = "Play on Hard Mode";
    ctx = this.stage.canvas.getContext('2d');
    ctx.font = "36px Arial";
    x = this.stage.canvas.width / 2 - ctx.measureText(t).width / 2;
    text = new createjs.Text(t, "36px Arial", "white");
    text.x = x;
    text.y = 450;
    text.snapToPixel = true;
    text.textBaseline = "alphabetic";
    text.onSelect = function() {
      _this.startGame(1);
      return _this.close();
    };
    this.stage.addChild(text);
    this.components.push(text);
    this.controls.push(text);
    return this.stage.update();
  };

  Home.prototype.addStartImp = function() {
    var ctx, t, text, x,
      _this = this;
    t = "Play on Impossible Mode (Good luck)";
    ctx = this.stage.canvas.getContext('2d');
    ctx.font = "36px Arial";
    x = this.stage.canvas.width / 2 - ctx.measureText(t).width / 2;
    text = new createjs.Text(t, "36px Arial", "white");
    text.x = x;
    text.y = 500;
    text.snapToPixel = true;
    text.textBaseline = "alphabetic";
    text.onSelect = function() {
      _this.startGame(666);
      return _this.close();
    };
    this.stage.addChild(text);
    this.components.push(text);
    this.controls.push(text);
    return this.stage.update();
  };

  Home.prototype.addInstructions = function() {
    var ctx, t, text, x,
      _this = this;
    t = "Instructions";
    ctx = this.stage.canvas.getContext('2d');
    ctx.font = "36px Arial";
    x = this.stage.canvas.width / 2 - ctx.measureText(t).width / 2;
    text = new createjs.Text(t, "36px Arial", "white");
    text.x = x;
    text.y = 550;
    text.snapToPixel = true;
    text.textBaseline = "alphabetic";
    text.onSelect = function() {
      _this.showInstructions();
      return _this.close();
    };
    this.stage.addChild(text);
    this.components.push(text);
    this.controls.push(text);
    return this.stage.update();
  };

  Home.prototype.addSound = function() {
    var ctx, t, text, x,
      _this = this;
    t = "Toggle Sound";
    ctx = this.stage.canvas.getContext('2d');
    ctx.font = "36px Arial";
    x = this.stage.canvas.width / 2 - ctx.measureText(t).width / 2;
    text = new createjs.Text(t, "36px Arial", "white");
    text.x = x;
    text.y = 600;
    text.snapToPixel = true;
    text.textBaseline = "alphabetic";
    text.onSelect = function() {
      return _this.toggleSound();
    };
    this.stage.addChild(text);
    this.components.push(text);
    this.controls.push(text);
    return this.stage.update();
  };

  Home.prototype.close = function() {
    var comp, _i, _len, _ref;
    this.visible = false;
    _ref = this.components;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      comp = _ref[_i];
      this.stage.removeChild(comp);
    }
    this.components = [];
    return this.controls = [];
  };

  Home.prototype.tick = function(event) {
    var _ref, _ref1;
    if (!this.visible) {
      return;
    }
    if (this.keyInput.enterHeld) {
      if ((_ref = this.controls[this.selectedOption]) != null) {
        _ref.onSelect();
      }
      this.keyInput.enterHeld = false;
    } else if (this.keyInput.dnHeld) {
      if (this.selectedOption < this.controls.length - 1) {
        this.controls[this.selectedOption].color = "white";
        this.selectedOption++;
      }
      this.keyInput.dnHeld = false;
    } else if (this.keyInput.fwdHeld) {
      if (this.selectedOption > 0) {
        this.controls[this.selectedOption].color = "white";
        this.selectedOption--;
      }
      this.keyInput.fwdHeld = false;
    }
    if ((_ref1 = this.controls[this.selectedOption]) != null) {
      _ref1.color = "rgb(175,0,0)";
    }
    return this.stage.update();
  };

  return Home;

})();
});

;require.register("coffee/input", function(exports, require, module) {
var KeyInput,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = KeyInput = (function() {
  function KeyInput() {
    this.reset = __bind(this.reset, this);
    this.handleKeyUp = __bind(this.handleKeyUp, this);
    this.handleKeyDown = __bind(this.handleKeyDown, this);
    var _this = this;
    this.KEYCODE_UP = 38;
    this.KEYCODE_LEFT = 37;
    this.KEYCODE_RIGHT = 39;
    this.KEYCODE_DOWN = 40;
    this.KEYCODE_W = 87;
    this.KEYCODE_A = 65;
    this.KEYCODE_S = 83;
    this.KEYCODE_D = 68;
    this.KEYCODE_B = 66;
    this.KEYCODE_SPACE = 32;
    this.ACTION = 69;
    this.ENTER = 13;
    this.KEYCODE_ESCAPE = 27;
    this.KEYCODE_I = 73;
    this.KEYCODE_M = 77;
    this.lfHeld = false;
    this.rtHeld = false;
    this.fwdHeld = false;
    this.dnHeld = false;
    this.spaceHeld = false;
    this.escHeld = false;
    this.iHeld = false;
    this.mHeld = false;
    this.bHeld = false;
    this.spaceIsReady = false;
    this.actionheld = false;
    window.setTimeout(function() {
      document.onkeydown = _this.handleKeyDown;
      document.onkeyup = _this.handleKeyUp;
      return document.onkeypress = _this.handleKeyPress;
    }, 1000);
  }

  KeyInput.prototype.handleKeyDown = function(e) {
    if (!e) {
      e = window.event;
    }
    switch (e.keyCode) {
      case this.KEYCODE_A:
      case this.KEYCODE_LEFT:
        this.lfHeld = true;
        return false;
      case this.KEYCODE_D:
      case this.KEYCODE_RIGHT:
        this.rtHeld = true;
        return false;
      case this.KEYCODE_W:
      case this.KEYCODE_UP:
        this.fwdHeld = true;
        return false;
      case this.KEYCODE_S:
      case this.KEYCODE_DOWN:
        this.dnHeld = true;
        return false;
      case this.KEYCODE_SPACE:
        if (this.spaceIsReady) {
          this.spaceIsReady = false;
          this.spaceHeld = true;
        }
        return false;
      case this.KEYCODE_ESCAPE:
        this.escHeld = true;
        return false;
      case this.KEYCODE_I:
        this.iHeld = true;
        return false;
      case this.KEYCODE_M:
        this.mHeld = true;
        return false;
      case this.KEYCODE_B:
        this.bHeld = true;
        return false;
      case this.ACTION:
        return this.actionHeld = true;
      case this.ENTER:
        return this.enterHeld = true;
    }
  };

  KeyInput.prototype.handleKeyUp = function(e) {
    if (!e) {
      e = window.event;
    }
    switch (e.keyCode) {
      case this.KEYCODE_A:
      case this.KEYCODE_LEFT:
        return this.lfHeld = false;
      case this.KEYCODE_D:
      case this.KEYCODE_RIGHT:
        return this.rtHeld = false;
      case this.KEYCODE_W:
      case this.KEYCODE_UP:
        return this.fwdHeld = false;
      case this.KEYCODE_S:
      case this.KEYCODE_DOWN:
        return this.dnHeld = false;
      case this.KEYCODE_SPACE:
        this.spaceHeld = false;
        return this.spaceIsReady = true;
      case this.KEYCODE_ESCAPE:
        return this.escHeld = false;
      case this.KEYCODE_I:
        return this.iHeld = false;
      case this.KEYCODE_M:
        return this.mHeld = false;
      case this.KEYCODE_B:
        return this.bHeld = false;
      case this.ACTION:
        return this.actionHeld = false;
      case this.ENTER:
        return this.enterHeld = false;
    }
  };

  KeyInput.prototype.reset = function() {
    return this.lfHeld = this.rtHeld = this.fwdHeld = this.dnHeld = this.enterHeld = this.actionHeld = false;
  };

  return KeyInput;

})();
});

;require.register("coffee/instructions", function(exports, require, module) {
var Instructions,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Instructions = (function() {
  function Instructions(delegate) {
    var _ref;
    this.delegate = delegate;
    this.tick = __bind(this.tick, this);
    this.close = __bind(this.close, this);
    this.addInstructions = __bind(this.addInstructions, this);
    this.show = __bind(this.show, this);
    _ref = this.delegate, this.stage = _ref.stage, this.startGame = _ref.startGame, this.keyInput = _ref.keyInput, this.showHome = _ref.showHome;
    this.components = [];
    this.visible = false;
  }

  Instructions.prototype.show = function() {
    this.visible = true;
    return this.addInstructions();
  };

  Instructions.prototype.addInstructions = function() {
    var act, attk, clk, esc, inv, map, move, x;
    x = 200;
    move = new createjs.Text("wasd/arrows - move", "20px Arial", "white");
    move.x = x;
    move.y = 100;
    move.snapToPixel = true;
    move.textBaseline = "alphabetic";
    attk = new createjs.Text("space/left click - attack", "20px Arial", "white");
    attk.x = x;
    attk.y = 150;
    attk.snapToPixel = true;
    attk.textBaseline = "alphabetic";
    inv = new createjs.Text("I - inventory", "20px Arial", "white");
    inv.x = x;
    inv.y = 200;
    inv.snapToPixel = true;
    inv.textBaseline = "alphabetic";
    map = new createjs.Text("M (hold) - show map", "20px Arial", "white");
    map.x = x;
    map.y = 250;
    map.snapToPixel = true;
    map.textBaseline = "alphabetic";
    act = new createjs.Text("E - Interact with NPC", "20px Arial", "white");
    act.x = x;
    act.y = 300;
    act.snapToPixel = true;
    act.textBaseline = "alphabetic";
    clk = new createjs.Text("Left Click - Pick things up, attack, talk", "20px Arial", "white");
    clk.x = x;
    clk.y = 350;
    clk.snapToPixel = true;
    clk.textBaseline = "alphabetic";
    esc = new createjs.Text("(esc to go back)", "14px Arial", "white");
    esc.x = x;
    esc.y = 420;
    esc.snapToPixel = true;
    esc.textBaseline = "alphabetic";
    this.stage.addChild(move);
    this.stage.addChild(attk);
    this.stage.addChild(inv);
    this.stage.addChild(map);
    this.stage.addChild(act);
    this.stage.addChild(clk);
    this.stage.addChild(esc);
    this.components.push(move);
    this.components.push(attk);
    this.components.push(inv);
    this.components.push(map);
    this.components.push(act);
    this.components.push(clk);
    this.components.push(esc);
    return this.stage.update();
  };

  Instructions.prototype.close = function() {
    var comp, _i, _len, _ref, _results;
    this.visible = false;
    _ref = this.components;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      comp = _ref[_i];
      _results.push(this.stage.removeChild(comp));
    }
    return _results;
  };

  Instructions.prototype.tick = function(event) {
    if (this.keyInput.escHeld) {
      this.showHome();
      this.close();
    }
    return this.stage.update();
  };

  return Instructions;

})();
});

;require.register("coffee/intro", function(exports, require, module) {
var Intro, wrap,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

wrap = require('coffee/utils').wrap;

module.exports = Intro = (function() {
  function Intro(delegate) {
    this.delegate = delegate;
    this.tick = __bind(this.tick, this);
    this.close = __bind(this.close, this);
    this.show = __bind(this.show, this);
    this.stage = this.delegate.stage;
    this.pos = this.stage.canvas.height;
    this.lines = [];
    this.story = "It is the year 2064. Rabbits have been reintroduced to the UVic campus to satisfy the student body’s collective nostalgia for an imagined pastoral past. \n But the UVic administration has learned from their past mistakes, and stipulated one crucial difference this time around… \n Each rabbit has been equipped with augmented reality contact lenses and neural implants that allow the university to have complete control over their activities and keep an eye on all areas of the campus. \n This means the population can be kept in check, and messages can be relayed to and from campus visitors through the rabbits. \n However, not everyone thinks this is a good idea… \n \nMission brief: \n Environmental terrorist Dr. Antagonist has enclosed himself and UVic’s entire campus in an EMP forcefield. All electronics are rendered useless upon entry. \n Once he manages to hack into the world’s satellites, he plans on expanding the forcefield to encompass the entire world, destroying all technology in its wake. \n Your assignment is to infiltrate the campus and stop Dr. Antagonist before he can finish what he started. \n There’s just one small problem: The doctor has commandeered UVic’s Rabbit Control Room, allowing him to mobilize the normally peaceful rabbits into a furry army. \n Your mission starts now. Hop On! \n (press the esc key)      ";
    this.visible = false;
  }

  Intro.prototype.show = function() {
    var i, j, line, _i, _len, _ref;
    this.splitLines = wrap(this.stage.canvas.getContext('2d'), this.story, this.stage.canvas.width / 2, "40px Arial");
    this.container = new createjs.Container();
    i = 0;
    j = 0;
    _ref = this.splitLines;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      this.text = new createjs.Text(line.trim(), "40px Arial", "white");
      this.text.x = this.stage.canvas.width / 4;
      this.text.y = i * 40 + j * 20;
      this.text.snapToPixel = true;
      this.text.textBaseline = "alphabetic";
      this.container.addChild(this.text);
      i++;
      if (line.indexOf('\n') > -1) {
        j++;
      }
    }
    this.container.x = 0;
    this.container.y = this.stage.canvas.height;
    this.stage.addChild(this.container);
    return this.visible = true;
  };

  Intro.prototype.close = function() {
    var line, _i, _len, _ref;
    _ref = this.lines;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      this.stage.removeChile(line);
    }
    return this.visible = false;
  };

  Intro.prototype.tick = function(event) {
    this.stage.removeChild(this.container);
    this.container.y = this.pos;
    this.stage.addChild(this.container);
    this.pos -= 2;
    return this.stage.update();
  };

  return Intro;

})();
});

;require.register("coffee/inventory", function(exports, require, module) {
var Inventory, wrap,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

wrap = require('coffee/utils').wrap;

module.exports = Inventory = (function() {
  var Item;

  Inventory.items = [];

  Inventory.hasSword = function() {
    return _.contains(Inventory.items, 300);
  };

  function Inventory(delegate) {
    var _ref;
    this.delegate = delegate;
    this.keyPress = __bind(this.keyPress, this);
    this.close = __bind(this.close, this);
    this.showInventory = __bind(this.showInventory, this);
    this.refresh = __bind(this.refresh, this);
    this.createText = __bind(this.createText, this);
    this.createBox = __bind(this.createBox, this);
    _ref = this.delegate, this.canvas = _ref.canvas, this.stage = _ref.stage, this.endInventory = _ref.endInventory;
    this.w = 428;
    this.h = 208;
    this.shownItems = [];
    this.lines = [];
    this.selected = 0;
    this.open = false;
  }

  Inventory.prototype.createBox = function() {
    this.box = new createjs.Shape();
    this.box.graphics.beginStroke("#000");
    this.box.graphics.beginFill("papayawhip");
    this.box.graphics.setStrokeStyle(2);
    this.box.snapToPixel = true;
    this.box.graphics.drawRect(this.pos.x, this.pos.y, this.w, this.h);
    return this.stage.addChild(this.box);
  };

  Inventory.prototype.createText = function() {
    var i, line, lines, text, _i, _j, _len, _len1, _ref, _results;
    if (this.shownItems.length === 0) {
      return;
    }
    this.stage.removeChild(this.name);
    this.name = new createjs.Text(this.shownItems[this.selected].data.name, "24px Arial", "black");
    this.name.x = this.pos.x + 10;
    this.name.y = this.pos.y + 90;
    this.name.color = "black";
    this.name.textBaseline = "alphabetic";
    this.stage.addChild(this.name);
    _ref = this.lines;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      this.stage.removeChild(line);
    }
    this.lines = [];
    lines = wrap(this.canvas.getContext('2d'), this.shownItems[this.selected].data.description, this.w - 20, "20px Arial");
    i = 0;
    _results = [];
    for (_j = 0, _len1 = lines.length; _j < _len1; _j++) {
      line = lines[_j];
      text = new createjs.Text(line, "20px Arial", "black");
      text.x = this.pos.x + 10;
      text.y = this.pos.y + i * 30 + 140;
      text.color = "#333";
      text.textBaseline = "alphabetic";
      this.stage.addChild(text);
      this.lines.push(text);
      _results.push(i++);
    }
    return _results;
  };

  Inventory.prototype.refresh = function() {
    if (this.open) {
      this.close();
      return this.showInventory();
    }
  };

  Inventory.prototype.showInventory = function() {
    var i, item, _i, _ref, _ref1;
    if (this.selected >= Inventory.items.length) {
      this.selected = 0;
    }
    this.pos = {
      x: this.stage.x * -1 + 30,
      y: this.stage.y * -1 + 30
    };
    this.createBox();
    for (i = _i = 0, _ref = Inventory.items.length - 1; _i <= _ref; i = _i += 1) {
      item = Inventory.items[i];
      this.shownItems.push(new Item(this.pos, this.stage, item, i, this.delegate));
    }
    if ((_ref1 = this.shownItems[this.selected]) != null) {
      _ref1.changeColor('tomato');
    }
    this.createText();
    return this.open = true;
  };

  Inventory.prototype.close = function() {
    var item, line, _i, _j, _len, _len1, _ref, _ref1;
    this.stage.removeChild(this.box);
    this.stage.removeChild(this.name);
    _ref = this.shownItems;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      item.close();
    }
    this.shownItems = [];
    _ref1 = this.lines;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      line = _ref1[_j];
      this.stage.removeChild(line);
    }
    this.lines = [];
    return this.open = false;
  };

  Inventory.prototype.keyPress = function(key) {
    switch (key) {
      case "esc":
        this.close();
        return this.endInventory();
      case "left":
        if (this.selected > 0) {
          this.shownItems[this.selected].changeColor('black');
          this.selected--;
          this.shownItems[this.selected].changeColor('tomato');
          return this.createText();
        }
        break;
      case "right":
        if (this.selected < this.shownItems.length - 1) {
          this.shownItems[this.selected].changeColor('black');
          this.selected++;
          this.shownItems[this.selected].changeColor('tomato');
          return this.createText();
        }
    }
  };

  Item = (function() {
    function Item(pos, stage, item, i, delegate) {
      var Collections, sprite, spriteName, t;
      this.stage = stage;
      this.delegate = delegate;
      this.w = 50;
      this.h = 50;
      Collections = require('coffee/collections');
      this.data = Collections.findModel(item);
      this.pos = {
        x: pos.x + i * this.w + 7,
        y: pos.y + 7
      };
      spriteName = (t = this.data.type) ? "" + t + "Sprite" : "noitemSprite";
      sprite = _.clone(this.delegate[spriteName] || this.delegate.noitemSprite);
      this.box = sprite;
      this.box.x = this.pos.x;
      this.box.y = this.pos.y;
      this.box.scaleX = this.w / sprite.spriteSheet._frameHeight;
      this.box.scaleY = this.h / sprite.spriteSheet._frameWidth;
      this.stage.addChild(this.box);
      this.mask = new createjs.Shape();
      this.mask.graphics.beginStroke('black');
      this.mask.graphics.setStrokeStyle(2);
      this.mask.snapToPixel = true;
      this.mask.graphics.drawRect(this.pos.x, this.pos.y, this.w, this.h);
      this.stage.addChild(this.mask);
    }

    Item.prototype.changeColor = function(color) {
      this.stage.removeChild(this.mask);
      this.mask.graphics.beginStroke(color);
      this.mask.graphics.drawRect(this.pos.x, this.pos.y, this.w, this.h);
      return this.stage.addChild(this.mask);
    };

    Item.prototype.close = function() {
      this.stage.removeChild(this.box);
      return this.stage.removeChild(this.mask);
    };

    return Item;

  })();

  return Inventory;

})();
});

;require.register("coffee/level", function(exports, require, module) {
var Items, Level,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Items = require('coffee/data/items');

module.exports = Level = (function() {
  function Level(delegate) {
    var _ref;
    this.delegate = delegate;
    this.init = __bind(this.init, this);
    this.initLayer = __bind(this.initLayer, this);
    this.initLayers = __bind(this.initLayers, this);
    this.checkHitsAtPosition = __bind(this.checkHitsAtPosition, this);
    this.checkDiv = __bind(this.checkDiv, this);
    _ref = this.delegate, this.stage = _ref.stage, this.itemClick = _ref.itemClick, this.player = _ref.player;
    this.numDivs = 20;
    this.divs = [];
    this.currentDiv = {
      x: 0,
      y: 0
    };
    this.onScreen = [];
    this.items = [];
    this.mapData;
    this.tileset;
    this.init();
  }

  Level.prototype.checkDiv = function() {
    var i, j, perDiv, x, y, _i, _j, _k, _ref, _ref1, _ref2, _results;
    perDiv = this.layerSize * 96 / this.numDivs;
    x = this.currentDiv.x = Math.floor(this.stage.x * -1 / perDiv) % this.numDivs;
    y = this.currentDiv.y = Math.floor(this.stage.y * -1 / perDiv) % this.numDivs;
    for (i = _i = 0, _ref = this.numDivs; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      for (j = _j = 0, _ref1 = this.numDivs; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        this.divs[i][j].visible = false;
      }
    }
    _results = [];
    for (i = _k = 0, _ref2 = Math.ceil(this.stage.canvas.width / perDiv); 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      _results.push((function() {
        var _l, _ref3, _results1;
        _results1 = [];
        for (j = _l = 0, _ref3 = Math.ceil(this.stage.canvas.height / perDiv); 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; j = 0 <= _ref3 ? ++_l : --_l) {
          if (x + i < this.numDivs && y + j < this.numDivs) {
            _results1.push(this.divs[x + i][y + j].visible = true);
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Level.prototype.checkHitsAtPosition = function(x, y) {
    var layer, _i, _len, _ref;
    x = Math.floor(x / this.mapData.tilesets[0].tilewidth);
    y = Math.floor(y / this.mapData.tilesets[0].tileheight);
    _ref = this.mapData.layers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      layer = _ref[_i];
      if (layer.data[x + y * layer.width] !== 0 && layer.properties.hit === 'true') {
        return true;
      }
    }
    return false;
  };

  Level.prototype.initLayers = function() {
    var h, i, idx, imageData, j, layerData, tilesetSheet, w, _i, _j, _ref, _ref1;
    this.level = new createjs.Container();
    w = this.mapData.tilesets[0].tilewidth;
    h = this.mapData.tilesets[0].tileheight;
    imageData = {
      images: [this.tileset],
      frames: {
        width: w,
        height: h
      }
    };
    tilesetSheet = new createjs.SpriteSheet(imageData);
    idx = 0;
    while (idx < this.mapData.layers.length) {
      layerData = this.mapData.layers[idx];
      if (layerData.type === "tilelayer") {
        this.initLayer(layerData, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight);
      }
      idx++;
    }
    for (i = _i = 0, _ref = this.numDivs; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      for (j = _j = 0, _ref1 = this.numDivs; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        this.stage.addChild(this.divs[i][j]);
      }
    }
    return this.checkDiv(this.player.x, this.player.y);
  };

  Level.prototype.initLayer = function(layerData, tilesetSheet, tilewidth, tileheight) {
    var cellSprite, data, idx, item, perDiv, type, x, y, _base, _base1, _name, _name1, _ref, _results;
    perDiv = layerData.height / this.numDivs;
    if (this.layerSize == null) {
      this.layerSize = layerData.height;
    }
    y = 0;
    _results = [];
    while (y < layerData.height) {
      x = 0;
      while (x < layerData.width) {
        cellSprite = new createjs.Sprite(tilesetSheet);
        idx = x + y * layerData.width;
        if ((data = layerData.data[idx]) !== 0) {
          cellSprite.gotoAndStop(data - 1);
          cellSprite.x = x * tilewidth;
          cellSprite.y = y * tileheight;
          cellSprite.num = layerData.name;
          cellSprite.height = 96;
          cellSprite.width = 96;
          cellSprite.diagonalHeight = Math.sqrt(cellSprite.height * cellSprite.height + cellSprite.width * cellSprite.width);
          cellSprite.hit = layerData.properties.hit === "true" ? true : false;
          cellSprite.type = 'tile';
          if (_ref = data - 1, __indexOf.call(this.tilepropsKeys, _ref) >= 0) {
            cellSprite.on('click', _.partial(this.itemClick, cellSprite, _));
            type = cellSprite.type = this.tileprops[(data - 1).toString()].type;
            this.items.push(cellSprite);
            if ((item = _.find(Items, function(i) {
              return i.type === type;
            })) != null) {
              cellSprite.id = item.id;
            }
          }
          if ((_base = this.divs)[_name = Math.floor(x / perDiv) % this.numDivs] == null) {
            _base[_name] = [];
          }
          if ((_base1 = this.divs[Math.floor(x / perDiv) % this.numDivs])[_name1 = Math.floor(y / perDiv) % this.numDivs] == null) {
            _base1[_name1] = new createjs.Container();
          }
          this.divs[Math.floor(x / perDiv) % this.numDivs][Math.floor(y / perDiv) % this.numDivs].addChild(cellSprite);
        }
        x++;
      }
      _results.push(y++);
    }
    return _results;
  };

  Level.prototype.init = function(sprite) {
    var _this = this;
    return $.ajax({
      url: "/rabbitwrath/images/Level1.json",
      async: false,
      dataType: "json",
      success: function(response) {
        var key, value;
        _this.tileprops = response.tilesets[0].tileproperties;
        _this.tilepropsKeys = (function() {
          var _ref, _results;
          _ref = this.tileprops;
          _results = [];
          for (key in _ref) {
            value = _ref[key];
            _results.push(parseInt(key));
          }
          return _results;
        }).call(_this);
        _this.mapData = response;
        _this.tileset = new Image();
        _this.tileset.src = _this.mapData.tilesets[0].image;
        return _this.tileset.onLoad = _this.initLayers();
      }
    });
  };

  return Level;

})();
});

;require.register("coffee/map", function(exports, require, module) {
var Map,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Map = (function() {
  function Map(stage, img) {
    this.stage = stage;
    this.img = img;
    this.close = __bind(this.close, this);
    this.update = __bind(this.update, this);
  }

  Map.prototype.update = function(stage, playerX, playerY, moving) {
    var alpha, dotPos, pos, size;
    alpha = moving ? 0.5 : 1;
    size = Math.min(stage.canvas.width - 150, stage.canvas.height - 150);
    pos = {
      x: stage.x * -1 + stage.canvas.width / 2 - size / 2,
      y: stage.y * -1 + 20
    };
    dotPos = {
      x: (playerX / 9600) * size + pos.x,
      y: (playerY / 9600) * size + pos.y
    };
    this.mapBorder = new createjs.Shape();
    this.map = new createjs.Bitmap(this.img);
    this.dot = new createjs.Shape();
    this.map.alpha = alpha;
    this.mapBorder.alpha = alpha;
    this.dot.alpha = alpha;
    this.map.scaleX = size / this.img.width;
    this.map.scaleY = size / this.img.height;
    this.map.x = pos.x;
    this.map.y = pos.y;
    this.mapBorder.graphics.beginStroke('black');
    this.mapBorder.graphics.setStrokeStyle(15);
    this.mapBorder.graphics.drawRect(pos.x, pos.y, size, size);
    this.dot.graphics.beginFill("yellow");
    this.dot.snapToPixel = true;
    this.dot.graphics.drawCircle(dotPos.x, dotPos.y, 15, 15);
    stage.addChild(this.mapBorder);
    stage.addChild(this.map);
    return stage.addChild(this.dot);
  };

  Map.prototype.close = function() {
    this.stage.removeChild(this.map);
    this.stage.removeChild(this.dot);
    return this.stage.removeChild(this.mapBorder);
  };

  return Map;

})();
});

;require.register("coffee/models/quest", function(exports, require, module) {
var Inventory, Marker, Quest,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

Inventory = require('coffee/inventory');

Marker = require('coffee/models/questpart');

module.exports = Quest = (function() {
  function Quest(data) {
    this.finishMain = __bind(this.finishMain, this);
    this.complete = __bind(this.complete, this);
    this.getPart = __bind(this.getPart, this);
    this.checkPartCondition = __bind(this.checkPartCondition, this);
    this.isCurrentPart = __bind(this.isCurrentPart, this);
    this.checkPartStatus = __bind(this.checkPartStatus, this);
    this.start = __bind(this.start, this);
    this.checkComplete = __bind(this.checkComplete, this);
    this.completePart = __bind(this.completePart, this);
    var marker, _i, _len, _ref;
    this.name = data.name;
    this.state = 0;
    this.id = data.id;
    this.markers = {};
    _ref = data.markers;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      marker = _ref[_i];
      this.markers[marker.pos] = new Marker(marker);
    }
    this.ordered = data.ordered || true;
    this.inProgress = false;
    this.isComplete;
    this.onComplete = data.onComplete;
  }

  Quest.prototype.completePart = function(part) {
    var com, passed;
    if (!this.inProgress) {
      return;
    }
    part = this.getPart(part);
    passed = this.checkPartStatus(part);
    if (!passed) {
      return false;
    }
    part.done = true;
    this.state = part.pos + 1;
    if ((com = part.onComplete) != null) {
      if (com.type === 'item') {
        Inventory.items.push(com.id);
      }
    }
    if (this.checkComplete()) {
      this.complete();
      this.inProgress = false;
      this.isComplete = true;
    }
    return true;
  };

  Quest.prototype.checkComplete = function() {
    return this.inProgress && ((_.find(this.markers, function(m) {
      return !m.done;
    })) == null);
  };

  Quest.prototype.start = function() {
    return this.inProgress = true;
  };

  Quest.prototype.checkPartStatus = function(part) {
    var conditionPassed;
    if (!this.inProgress) {
      return false;
    }
    conditionPassed = true;
    if (part.condition != null) {
      conditionPassed = this.checkPartCondition(part.condition);
    }
    if (!conditionPassed) {
      return false;
    } else if (part.pos !== this.state) {
      return false;
    }
    return true;
  };

  Quest.prototype.isCurrentPart = function(part) {
    var _ref;
    return ((_ref = this.getPart(part)) != null ? _ref.pos : void 0) === this.state;
  };

  Quest.prototype.checkPartCondition = function(cond) {
    switch (cond.type) {
      case 'inventory':
        return (_.without.apply(_, [cond.items].concat(__slice.call(Inventory.items)))).length === 0;
    }
  };

  Quest.prototype.getPart = function(id) {
    var _this = this;
    return _.find(this.markers, function(m) {
      return m.id === id;
    });
  };

  Quest.prototype.complete = function() {
    if (this.onComplete == null) {
      return;
    }
    switch (this.onComplete.type) {
      case 'item':
        return Inventory.items.push(this.onComplete.id);
      case 'cb':
        return this[this.onComplete.name]();
    }
  };

  Quest.prototype.finishMain = function() {
    Inventory.items = _.without.apply(_, [Inventory.items].concat(__slice.call([351, 352, 353, 354])));
    return Inventory.items.push(666);
  };

  return Quest;

})();
});

;require.register("coffee/models/questpart", function(exports, require, module) {
var Marker;

module.exports = Marker = (function() {
  function Marker(data) {
    this.pos = data.pos;
    this.id = data.id;
    this.done = false;
    this.npc = data.npc;
    this.onComplete = data.onComplete;
    this.condition = data.cond;
  }

  return Marker;

})();
});

;require.register("coffee/monster", function(exports, require, module) {
var Character, Level, Monster, NPC,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Character = require('coffee/character');

NPC = require('coffee/npc');

Level = require('coffee/level');

module.exports = Monster = (function(_super) {
  __extends(Monster, _super);

  function Monster(sprite, hitsprite, delegate) {
    var _ref;
    this.hitsprite = hitsprite;
    this.delegate = delegate;
    this.checkCollision = __bind(this.checkCollision, this);
    this.velocity = __bind(this.velocity, this);
    this.tick = __bind(this.tick, this);
    this.checkDamagePlayer = __bind(this.checkDamagePlayer, this);
    this.lineDistance = __bind(this.lineDistance, this);
    this.kill = __bind(this.kill, this);
    this.hit = __bind(this.hit, this);
    this.init = __bind(this.init, this);
    _ref = this.delegate, this.stage = _ref.stage, this.monsterClick = _ref.monsterClick, this.player = _ref.player, this.isSoundOn = _ref.isSoundOn;
    this.regsprite = _.clone(sprite);
    Monster.__super__.constructor.call(this, this.regsprite);
    this.tickCount = 0;
    this.waitCount = 0;
    this.dying = false;
    this.MAX_VELOCITY = 5;
  }

  Monster.prototype.init = function(pos, blood) {
    this.pos = pos;
    this.bloodSprite = blood;
    Monster.__super__.init.call(this, this.pos);
    this.facing = Math.floor(Math.random() * 4);
    switch (this.facing) {
      case 0:
        if (this.playerBody.currentAnimation !== "up") {
          this.playerBody.gotoAndPlay("up");
        }
        break;
      case 1:
        if (this.playerBody.currentAnimation !== "down") {
          this.playerBody.gotoAndPlay("down");
        }
        break;
      case 2:
        if (this.playerBody.currentAnimation !== "left") {
          this.playerBody.gotoAndPlay("left");
        }
        break;
      case 3:
        if (this.playerBody.currentAnimation !== "right") {
          this.playerBody.gotoAndPlay("right");
        }
    }
    this.life = 2;
    this.on('click', _.partial(this.monsterClick, this, _));
    return this.diagonalHeight = Math.sqrt((this.width / 2) * (this.width / 2) + (this.height / 2) * (this.height / 2));
  };

  Monster.prototype.hit = function(direction) {};

  Monster.prototype.kill = function() {
    var killChild,
      _this = this;
    killChild = function() {
      return _this.stage.removeChild(_this);
    };
    setTimeout(killChild, 4000);
    if (this.isSoundOn()) {
      createjs.Sound.play("splat");
    }
    this.playerBody.spriteSheet = _.clone(this.bloodSprite);
    return this.playerBody.gotoAndPlay("left_idle");
  };

  Monster.prototype.lineDistance = function(point1, point2) {
    var xs, ys;
    xs = 0;
    ys = 0;
    xs = point2.x - point1.x;
    xs = xs * xs;
    ys = point2.y - point1.y;
    ys = ys * ys;
    return Math.sqrt(xs + ys);
  };

  Monster.prototype.checkDamagePlayer = function() {
    var d, v;
    v = {
      x: (this.player.x + this.player.width / 2) - (this.x + this.width / 2),
      y: (this.player.y + this.player.height / 2) - (this.y + this.height / 2)
    };
    d = Math.sqrt(v.x * v.x + v.y * v.y);
    if (d < 125) {
      return this.player.damage();
    }
  };

  Monster.prototype.tick = function(event, level) {
    var child, dir, horizCollision, randomDirArr, vertCollision, _i, _len, _ref, _ref1, _ref2;
    if (!((-this.stage.x - 200 <= (_ref = this.x) && _ref <= -this.stage.x + this.stage.canvas.width + 200) && (-this.stage.y - 200 <= (_ref1 = this.y) && _ref1 <= -this.stage.y + this.stage.canvas.height + 200))) {
      this.visible = false;
      return;
    } else if (!this.visible) {
      this.visible = true;
    }
    if (this.dying) {
      this.playerBody.spriteSheet = this.bloodSprite;
      return false;
    }
    this.checkDamagePlayer();
    this.tickCount++;
    if (this.waitCount > 0) {
      this.waitCount -= 1;
      if (this.waitCount !== 0) {
        return;
      } else {
        switch (this.facing) {
          case 0:
            this.playerBody.gotoAndPlay("up");
            break;
          case 1:
            this.playerBody.gotoAndPlay("down");
            break;
          case 2:
            this.playerBody.gotoAndPlay("left");
            break;
          case 3:
            this.playerBody.gotoAndPlay("right");
        }
      }
    }
    if (this.tickCount % Math.floor(Math.random() * 300) === 0) {
      this.waitCount = 20;
      switch (this.facing) {
        case 0:
          this.playerBody.gotoAndPlay("up_idle");
          break;
        case 1:
          this.playerBody.gotoAndPlay("down_idle");
          break;
        case 2:
          this.playerBody.gotoAndPlay("left_idle");
          break;
        case 3:
          this.playerBody.gotoAndPlay("right_idle");
      }
    }
    randomDirArr = [];
    if (this.player.x > this.x) {
      randomDirArr.push(3);
    } else {
      randomDirArr.push(2);
    }
    if (this.player.y > this.y) {
      randomDirArr.push(1);
    } else {
      randomDirArr.push(0);
    }
    if (this.tickCount % Math.floor(Math.random() * 50) === 0) {
      if ((this.lineDistance({
        x: this.player.x,
        y: this.player.y
      }, {
        x: this.x,
        y: this.y
      })) > 2500) {
        this.facing = Math.floor(Math.random() * 4);
      } else {
        this.facing = randomDirArr[Math.floor(Math.random() * randomDirArr.length)];
      }
      switch (this.facing) {
        case 0:
          if ((this.playerBody.currentAnimation != null) !== "up") {
            this.playerBody.gotoAndPlay("up");
          }
          break;
        case 1:
          if ((this.playerBody.currentAnimation != null) !== "down") {
            this.playerBody.gotoAndPlay("down");
          }
          break;
        case 2:
          if ((this.playerBody.currentAnimation != null) !== "left") {
            this.playerBody.gotoAndPlay("left");
          }
          break;
        case 3:
          if ((this.playerBody.currentAnimation != null) !== "right") {
            this.playerBody.gotoAndPlay("right");
          }
      }
    }
    horizCollision = false;
    vertCollision = false;
    _ref2 = this.stage.children;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      child = _ref2[_i];
      dir = this.checkCollisions(child) || {};
      if (dir.whore) {
        horizCollision = true;
      }
      if (dir.green) {
        vertCollision = true;
      }
    }
    if (!horizCollision) {
      this.x += this.velocity().x;
    }
    if (!vertCollision) {
      return this.y += this.velocity().y;
    }
  };

  Monster.prototype.velocity = function() {
    var vel;
    vel = {
      x: 0,
      y: 0
    };
    switch (this.facing) {
      case 0:
        vel.y -= this.MAX_VELOCITY;
        break;
      case 1:
        vel.y += this.MAX_VELOCITY;
        break;
      case 2:
        vel.x -= this.MAX_VELOCITY;
        break;
      case 3:
        vel.x += this.MAX_VELOCITY;
    }
    return vel;
  };

  Monster.prototype.checkCollision = function(child) {
    var data, dir;
    dir = {};
    if (child instanceof NPC || (child.type === 'tile' && child.hit)) {
      data = {
        top: child.y,
        left: child.x,
        right: child.x + child.width,
        bottom: child.y + child.height,
        width: child.width,
        height: child.height,
        diagonalHeight: child.diagonalHeight
      };
      dir = this.collide(data, this.velocity());
    }
    return dir;
  };

  return Monster;

})(Character);
});

;require.register("coffee/npc", function(exports, require, module) {
var Character, Collections, NPC,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Character = require('coffee/character');

Collections = require('coffee/collections');

module.exports = NPC = (function(_super) {
  __extends(NPC, _super);

  function NPC(delegate, sprite) {
    var exclamationSprite, playerSprite, questionSprite, _ref;
    this.delegate = delegate;
    this.tick = __bind(this.tick, this);
    this.getQuestState = __bind(this.getQuestState, this);
    this.getDialog = __bind(this.getDialog, this);
    this.init = __bind(this.init, this);
    _ref = this.delegate, this.stage = _ref.stage, questionSprite = _ref.questionSprite, exclamationSprite = _ref.exclamationSprite, playerSprite = _ref.playerSprite, this.characterClick = _ref.characterClick;
    this.questionSprite = _.clone(questionSprite);
    this.exclamationSprite = _.clone(exclamationSprite);
    NPC.__super__.constructor.call(this, sprite);
    this.hasQuestion = false;
    this.hasExlaimation = false;
  }

  NPC.prototype.init = function(data) {
    NPC.__super__.init.call(this, data.pos);
    this.id = data.id;
    this.dialogs = data.dialogs;
    this.on('click', _.partial(this.characterClick, this, _));
    return this.diagonalHeight = Math.sqrt((this.width / 2) * (this.width / 2) + (this.height / 2) * (this.height / 2));
  };

  NPC.prototype.getDialog = function() {
    var dialog, quest, _i, _len, _ref;
    _ref = this.dialogs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dialog = _ref[_i];
      quest = Collections.findModel(dialog.quest);
      if (dialog.type === 'questpart') {
        if (quest.isCurrentPart(dialog.part) && quest.inProgress) {
          return dialog.dialog;
        }
      } else if (dialog.type === 'questdone') {
        if (quest.isComplete) {
          return dialog.dialog;
        }
      } else if (dialog.type === 'quest') {
        if (quest.inProgress) {
          return dialog.dialog;
        }
      } else if (dialog.type === 'queststart') {
        if (!quest.inProgress && !quest.isComplete) {
          return dialog.dialog;
        }
      } else {
        return dialog.dialog;
      }
    }
  };

  NPC.prototype.getQuestState = function() {
    var dialog, quest, _i, _len, _ref;
    _ref = this.dialogs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      dialog = _ref[_i];
      quest = Collections.findModel(dialog.quest);
      if (dialog.type === 'questpart') {
        if (quest.isCurrentPart(dialog.part) && quest.inProgress) {
          return dialog.state;
        }
      } else if (dialog.type === 'queststart') {
        if (!quest.inProgress && !quest.isComplete) {
          return dialog.state;
        }
      }
    }
  };

  NPC.prototype.tick = function(event, level) {
    switch (this.getQuestState()) {
      case 'hasquest':
        if (!this.hasExclamation) {
          this.stage.addChild(this.exclamationSprite);
          this.exclamationSprite.x = this.x + this.width / 2 - 33.5;
          this.exclamationSprite.y = this.y - this.height / 2 - 80;
          return this.hasExclamation = true;
        }
        break;
      case 'return':
        if (!this.hasQuestion) {
          this.stage.addChild(this.questionSprite);
          this.questionSprite.x = this.x + this.width / 2 - 33.5;
          this.questionSprite.y = this.y - this.height / 2 - 80;
          return this.hasQuestion = true;
        }
        break;
      default:
        if (this.hasQuestion) {
          this.stage.removeChild(this.questionSprite);
          this.hasQuestion = false;
        }
        if (this.hasExclamation) {
          this.stage.removeChild(this.exclamationSprite);
          return this.hasExclamation = false;
        }
    }
  };

  return NPC;

})(Character);
});

;require.register("coffee/player", function(exports, require, module) {
var Character, Collections, Inventory, Level, Monster, NPC, Player,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NPC = require('coffee/npc');

Monster = require('coffee/monster');

Character = require('coffee/character');

Level = require('coffee/level');

Collections = require('coffee/collections');

Inventory = require('coffee/inventory');

module.exports = Player = (function(_super) {
  __extends(Player, _super);

  function Player(delegate) {
    var sprite, _ref;
    this.delegate = delegate;
    this.pos = __bind(this.pos, this);
    this.toLib = __bind(this.toLib, this);
    this.toElliot = __bind(this.toElliot, this);
    this.toSSM = __bind(this.toSSM, this);
    this.toCornett = __bind(this.toCornett, this);
    this.toStart = __bind(this.toStart, this);
    this.toClearihue = __bind(this.toClearihue, this);
    this.lineDistance = __bind(this.lineDistance, this);
    this.spinAttack = __bind(this.spinAttack, this);
    this.accelerate = __bind(this.accelerate, this);
    this.isFacing = __bind(this.isFacing, this);
    this.checkDistance = __bind(this.checkDistance, this);
    this.damageBunny = __bind(this.damageBunny, this);
    this.punch = __bind(this.punch, this);
    this.checkCollision = __bind(this.checkCollision, this);
    this.damage = __bind(this.damage, this);
    this.tick = __bind(this.tick, this);
    this.restoreHealth = __bind(this.restoreHealth, this);
    this.checkNPCActions = __bind(this.checkNPCActions, this);
    this.init = __bind(this.init, this);
    this.restart = __bind(this.restart, this);
    this.goto = __bind(this.goto, this);
    this.moveTo = __bind(this.moveTo, this);
    _ref = this.delegate, this.startDialog = _ref.startDialog, sprite = _ref.playerSprite, this.stage = _ref.stage, this.gameover = _ref.gameover, this.isSoundOn = _ref.isSoundOn;
    Player.__super__.constructor.call(this, sprite);
    this.MAX_VELOCITY = 20;
    this.lastKey;
    this.attack = false;
    this.knockback = true;
  }

  Player.prototype.moveTo = function(x, y) {
    this.x = x;
    return this.y = y;
  };

  Player.prototype.goto = function(ev) {
    var x, y;
    x = -this.stage.x + ev.stageX;
    y = -this.stage.y + ev.stageY;
    return this.gotoPos = {
      x: x,
      y: y
    };
  };

  Player.prototype.restart = function(pos) {
    this.x = pos.x;
    this.y = pos.y;
    return this.health = 15;
  };

  Player.prototype.init = function() {
    var _this = this;
    Player.__super__.init.call(this, {
      x: 0,
      y: 0
    });
    this.vX = 0;
    this.vY = 0;
    this.facing = 3;
    this.health = 15;
    this.healthMax = 15;
    this.recentlyHit = false;
    this.diagonalHeight = Math.sqrt((this.width / 2) * (this.width / 2) + (this.height / 4) * (this.height / 4));
    this.playerBody.addEventListener('animationend', function(ev) {
      if (ev.name.indexOf('attack') !== -1) {
        return _this.attack = false;
      }
    });
    return setInterval(function() {
      return _this.restoreHealth();
    }, 10000);
  };

  Player.prototype.checkNPCActions = function(npcs) {
    var d, dialog, me, npc, them, v, _i, _len;
    me = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
    for (_i = 0, _len = npcs.length; _i < _len; _i++) {
      npc = npcs[_i];
      them = {
        x: npc.x + npc.width / 2,
        y: npc.y + npc.height / 2
      };
      v = {
        x: me.x - them.x,
        y: me.y - them.y
      };
      d = Math.sqrt(v.x * v.x + v.y * v.y);
      if (d < 250) {
        if ((dialog = npc.getDialog())) {
          this.startDialog(npc.getDialog());
          return true;
        }
      }
    }
  };

  Player.prototype.checkItemAcions = function(items) {
    var d, item, me, them, v, _i, _j, _len, _len1;
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      me = {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
      };
      for (_j = 0, _len1 = items.length; _j < _len1; _j++) {
        item = items[_j];
        them = {
          x: item.x + item.width / 2,
          y: item.y + item.height / 2
        };
        v = {
          x: me.x - them.x,
          y: me.y - them.y
        };
        d = Math.sqrt(v.x * v.x + v.y * v.y);
        if (d < 250) {
          return item;
        }
      }
    }
  };

  Player.prototype.restoreHealth = function() {
    if (this.health < this.healthMax) {
      return this.health += 1;
    }
  };

  Player.prototype.tick = function(event, level) {
    var child, dir, horizCollision, vertCollision, _i, _len, _ref;
    horizCollision = false;
    vertCollision = false;
    _ref = this.stage.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      dir = this.checkCollisions(child) || {};
      if (dir.whore) {
        horizCollision = true;
      }
      if (dir.green) {
        vertCollision = true;
      }
      if (dir.whore && dir.green) {
        break;
      }
    }
    if (!horizCollision) {
      this.x += this.vX;
    }
    if (!vertCollision) {
      return this.y += this.vY;
    }
  };

  Player.prototype.damage = function() {
    var _this = this;
    if (this.recentlyHit) {
      return;
    }
    this.recentlyHit = true;
    this.health -= 1;
    if (this.health <= 0) {
      this.gameover("You aren't invincible, protagonist!");
    }
    return setTimeout(function() {
      return _this.recentlyHit = false;
    }, 1200);
  };

  Player.prototype.checkCollision = function(child) {
    var data, dir, vel;
    dir = {};
    vel = {
      x: this.vX,
      y: this.vY
    };
    if (child instanceof NPC || (child instanceof Monster && child.dying === false) || (child.type === 'tile' && child.hit)) {
      data = {
        top: child.y,
        left: child.x,
        right: child.x + child.width,
        bottom: child.y + child.height,
        width: child.width,
        height: child.height,
        diagonalHeight: child.diagonalHeight
      };
      dir = this.collide(data, vel);
    }
    return dir;
  };

  Player.prototype.punch = function() {
    var child, vel, _i, _len, _ref, _results,
      _this = this;
    vel = {
      x: this.vX,
      y: this.vY
    };
    _ref = this.stage.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push((function(child) {
        var data, dir;
        dir = {};
        if (child instanceof Monster) {
          data = {
            top: child.y,
            left: child.x,
            right: child.x + child.width,
            bottom: child.y + child.height
          };
          if (!child.dying) {
            if (child instanceof Monster) {
              if ((_this.lineDistance({
                x: child.x,
                y: child.y
              }, {
                x: _this.x,
                y: _this.y
              })) < 200 && child.life > 0) {
                if (child.x > _this.x && _this.facing === 3) {
                  if (_this.knockback) {
                    child.x += 80;
                  }
                  return _this.damageBunny(child);
                } else if (child.x < _this.x && _this.facing === 2) {
                  if (_this.knockback) {
                    child.x -= 80;
                  }
                  return _this.damageBunny(child);
                } else if (child.y < _this.y && _this.facing === 0) {
                  if (_this.knockback) {
                    child.y -= 80;
                  }
                  return _this.damageBunny(child);
                } else if (child.y > _this.y && _this.facing === 1) {
                  if (_this.knockback) {
                    child.y += 80;
                  }
                  return _this.damageBunny(child);
                }
              }
            }
          }
        }
      })(child));
    }
    return _results;
  };

  Player.prototype.damageBunny = function(child) {
    var dmg, revertSprite, v;
    dmg = _.contains(Inventory.items, 300) ? 2 : 1;
    if (this.isSoundOn()) {
      if (_.contains(Inventory.items, 300)) {
        createjs.Sound.play("sword");
      } else {
        createjs.Sound.play("punch");
      }
    }
    child.life -= dmg;
    v = {
      x: child.x - this.x,
      y: child.y - this.y
    };
    this.attack = Math.abs(v.x) > Math.abs(v.y) && v.x > 0 ? "right_attack" : Math.abs(v.x) > Math.abs(v.y) && v.x < 0 ? "left_attack" : Math.abs(v.x) < Math.abs(v.y) && v.y < 0 ? "up_attack" : Math.abs(v.x) < Math.abs(v.y) && v.y > 0 ? "down_attack" : void 0;
    if (Inventory.hasSword()) {
      this.attack += "_sword";
    }
    child.playerBody.spriteSheet = child.hitsprite.spriteSheet;
    revertSprite = function() {
      return child.playerBody.spriteSheet = child.regsprite.spriteSheet;
    };
    setTimeout(revertSprite, 100);
    if (child.life <= 0) {
      child.dying = true;
      return child.kill();
    }
  };

  Player.prototype.checkDistance = function(item, max) {
    var d, me, them, v;
    me = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
    them = {
      x: item.x + item.width / 2,
      y: item.y + item.height / 2
    };
    v = {
      x: me.x - them.x,
      y: me.y - them.y
    };
    d = Math.sqrt(v.x * v.x + v.y * v.y);
    return d < max;
  };

  Player.prototype.isFacing = function(them) {
    var angle, v;
    v = {
      x: this.x - them.x,
      y: this.y - them.y
    };
    angle = Math.abs(Math.atan(v.y / v.x) * 180 / Math.PI);
    return (this.facing === 3 && v.x < 0 && ((0 < angle && angle < 60))) || (this.facing === 2 && v.x > 0 && ((0 < angle && angle < 60))) || (this.facing === 0 && v.y > 0 && ((60 < angle && angle < 120))) || (this.facing === 1 && v.y < 0 && ((60 < angle && angle < 120)));
  };

  Player.prototype.accelerate = function(keys) {
    var latestKey, v, vl,
      _this = this;
    if (!keys.length && !this.gotoPos) {
      this.latestKey = false;
      this.vX = 0;
      this.vY = 0;
    } else if (keys.length) {
      this.gotoPos = null;
      this.vX = 0;
      this.vY = 0;
      latestKey = false;
      keys.forEach(function(key) {
        if (key === "left") {
          _this.vX += -_this.MAX_VELOCITY;
        }
        if (key === "right") {
          _this.vX += _this.MAX_VELOCITY;
        }
        if (key === "up") {
          _this.vY += -_this.MAX_VELOCITY;
        }
        if (key === "down") {
          _this.vY += _this.MAX_VELOCITY;
        }
        return latestKey = key;
      });
    } else {
      v = {
        x: this.gotoPos.x - (this.x + this.width / 2),
        y: this.gotoPos.y - (this.y + this.height / 2)
      };
      if (Math.abs(v.x) <= 10 && Math.abs(v.y) <= 10) {
        this.vX = 0;
        this.vY = 0;
        this.gotoPos = null;
      } else {
        vl = Math.sqrt(v.x * v.x + v.y * v.y);
        this.vX = (v.x / vl * this.MAX_VELOCITY) | 0;
        this.vY = (v.y / vl * this.MAX_VELOCITY) | 0;
        latestKey = Math.abs(this.vX) > Math.abs(this.vY) ? this.vX > 0 ? 'right' : 'left' : this.vY > 0 ? 'down' : 'up';
      }
    }
    if (this.attack) {
      if (this.playerBody.currentAnimation !== this.attack) {
        this.playerBody.gotoAndPlay(this.attack);
      }
    } else {
      switch (latestKey) {
        case "left":
          this.facing = 2;
          if (this.playerBody.currentAnimation !== "left") {
            this.playerBody.gotoAndPlay("left");
            this.lastKey = "left";
          }
          break;
        case "right":
          this.facing = 3;
          if (this.playerBody.currentAnimation !== "right") {
            this.playerBody.gotoAndPlay("right");
            this.lastKey = "right";
          }
          break;
        case "up":
          this.facing = 0;
          if (this.playerBody.currentAnimation !== "up") {
            this.playerBody.gotoAndPlay("up");
            this.lastKey = "up";
          }
          break;
        case "down":
          this.facing = 1;
          if (this.playerBody.currentAnimation !== "down") {
            this.playerBody.gotoAndPlay("down");
            this.lastKey = "down";
          }
          break;
        default:
          switch (this.lastKey) {
            case "left":
              this.playerBody.gotoAndPlay("left_idle");
              break;
            case "up":
              this.playerBody.gotoAndPlay("up_idle");
              break;
            case "down":
              this.playerBody.gotoAndPlay("down_idle");
              break;
            case "right":
              this.playerBody.gotoAndPlay("right_idle");
          }
      }
    }
    if (this.vX > this.MAX_VELOCITY) {
      this.vX = this.MAX_VELOCITY;
    }
    if (this.vX < -this.MAX_VELOCITY) {
      this.vX = -this.MAX_VELOCITY;
    }
    if (this.vY > this.MAX_VELOCITY) {
      this.vY = this.MAX_VELOCITY;
    }
    if (this.vY < -this.MAX_VELOCITY) {
      this.vY = -this.MAX_VELOCITY;
    }
    if (this.vX || this.vY) {
      return true;
    } else {
      return false;
    }
  };

  Player.prototype.spinAttack = function() {
    var child, d, _i, _len, _ref, _results;
    _ref = this.stage.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (child instanceof Monster) {
        d = {
          x: child.x - this.x,
          y: child.y - this.y
        };
        d = Math.sqrt(d.x * d.x + d.y * d.y);
        if (d < 400) {
          _results.push(this.damageBunny(child));
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Player.prototype.lineDistance = function(point1, point2) {
    var xs, ys;
    xs = 0;
    ys = 0;
    xs = point2.x - point1.x;
    xs = xs * xs;
    ys = point2.y - point1.y;
    ys = ys * ys;
    return Math.sqrt(xs + ys);
  };

  Player.prototype.toClearihue = function() {
    this.x = 8000;
    return this.y = 7000;
  };

  Player.prototype.toStart = function() {
    this.x = 9000;
    return this.y = 9000;
  };

  Player.prototype.toCornett = function() {
    this.x = 8720;
    return this.y = 4500;
  };

  Player.prototype.toSSM = function() {
    this.x = 8500;
    return this.y = 1800;
  };

  Player.prototype.toElliot = function() {
    this.x = 1720;
    return this.y = 6060;
  };

  Player.prototype.toLib = function() {
    this.x = 3120;
    return this.y = 8940;
  };

  Player.prototype.pos = function(x, y) {
    if (!((x != null) || (y != null))) {
      return "x: " + this.x + ", y: " + this.y;
    } else {
      this.x = x;
      return this.y = y;
    }
  };

  return Player;

})(Character);
});

;require.register("coffee/system/sprites", function(exports, require, module) {
var amplifierSprite, arrowSprite, barrelSprite, blankSprite, bloodSprite, carrotSprite, deactivatorSprite, exclamationSprite, monster2Sprite, monster3Sprite, monster4Sprite, monster5Sprite, monsterRed2Sprite, monsterRed3Sprite, monsterRed4Sprite, monsterRed5Sprite, monsterRedSprite, monsterSprite, noitemSprite, noteSprite, playerSprite, questionSprite, remoteSprite, signSprite, trapSprite;

playerSprite = function(loader) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("player2")],
    frames: {
      regX: 0,
      height: 179,
      count: 96,
      regY: 0,
      width: 134
    },
    animations: {
      up: [0, 2, "up"],
      right: [12, 14, "right"],
      down: [24, 26, "down"],
      left: [36, 38, "left"],
      left_attack_sword: {
        frames: [39, 55, 62, 62, 62]
      },
      right_attack_sword: {
        frames: [5, 16, 62, 62, 62]
      },
      up_attack_sword: {
        frames: [8, 18, 62, 62, 62]
      },
      down_attack_sword: {
        frames: [30, 41, 62, 62, 62]
      },
      left_attack: {
        frames: [87, 88, 89]
      },
      right_attack: {
        frames: [63, 64, 65]
      },
      up_attack: {
        frames: [51, 52, 53]
      },
      down_attack: {
        frames: [75, 76, 77]
      },
      left_idle: [37, 37],
      right_idle: [13, 13],
      up_idle: [1, 1],
      down_idle: [25, 25]
    }
  });
  playerSprite = new createjs.Sprite(data, "right_idle");
  playerSprite.framerate = 10;
  return playerSprite;
};

exclamationSprite = function(loader) {
  var data, exclamation;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("exclamation")],
    frames: {
      regX: 0,
      height: 201,
      count: 9,
      regY: 0,
      width: 67
    },
    animations: {
      bounce: [0, 8, "bounce"]
    }
  });
  exclamation = new createjs.Sprite(data, "bounce");
  exclamation.framerate = 10;
  return exclamation;
};

questionSprite = function(loader) {
  var data, question;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("question")],
    frames: {
      regX: 0,
      height: 201,
      count: 9,
      regY: 0,
      width: 67
    },
    animations: {
      bounce: [0, 8, "bounce"]
    }
  });
  question = new createjs.Sprite(data, "bounce");
  question.framerate = 10;
  return question;
};

monsterSprite = function(loader) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("monster")],
    frames: {
      regX: 0,
      height: 130,
      count: 12,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 2, "down"],
      left: [3, 5, "left"],
      right: [6, 8, "right"],
      up: [9, 11, "up"],
      left_idle: [4, 4],
      right_idle: [7, 7],
      up_idle: [9, 9],
      down_idle: [0, 0]
    }
  });
  monsterSprite = new createjs.Sprite(data, "right_idle");
  monsterSprite.framerate = 10;
  return monsterSprite;
};

monster2Sprite = function(loader) {
  var data, monsterSprite2;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("monster2")],
    frames: {
      regX: 0,
      height: 130,
      count: 12,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 2, "down"],
      left: [3, 5, "left"],
      right: [6, 8, "right"],
      up: [9, 11, "up"],
      left_idle: [4, 4],
      right_idle: [7, 7],
      up_idle: [9, 9],
      down_idle: [0, 0]
    }
  });
  monsterSprite2 = new createjs.Sprite(data, "right_idle");
  monsterSprite2.framerate = 10;
  return monsterSprite2;
};

monster3Sprite = function(loader) {
  var data, monsterSprite2;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("monster3")],
    frames: {
      regX: 0,
      height: 130,
      count: 12,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 2, "down"],
      left: [3, 5, "left"],
      right: [6, 8, "right"],
      up: [9, 11, "up"],
      left_idle: [4, 4],
      right_idle: [7, 7],
      up_idle: [9, 9],
      down_idle: [0, 0]
    }
  });
  monsterSprite2 = new createjs.Sprite(data, "right_idle");
  monsterSprite2.framerate = 10;
  return monsterSprite2;
};

monster4Sprite = function(loader) {
  var data, monsterSprite2;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("monster4")],
    frames: {
      regX: 0,
      height: 130,
      count: 12,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 2, "down"],
      left: [3, 5, "left"],
      right: [6, 8, "right"],
      up: [9, 11, "up"],
      left_idle: [4, 4],
      right_idle: [7, 7],
      up_idle: [9, 9],
      down_idle: [0, 0]
    }
  });
  monsterSprite2 = new createjs.Sprite(data, "right_idle");
  monsterSprite2.framerate = 10;
  return monsterSprite2;
};

monster5Sprite = function(loader) {
  var data, monsterSprite2;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("monster5")],
    frames: {
      regX: 0,
      height: 130,
      count: 12,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 2, "down"],
      left: [3, 5, "left"],
      right: [6, 8, "right"],
      up: [9, 11, "up"],
      left_idle: [4, 4],
      right_idle: [7, 7],
      up_idle: [9, 9],
      down_idle: [0, 0]
    }
  });
  monsterSprite2 = new createjs.Sprite(data, "right_idle");
  monsterSprite2.framerate = 10;
  return monsterSprite2;
};

monsterRedSprite = function(loader) {
  var data, monsterSpritered;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("monsterred")],
    frames: {
      regX: 0,
      height: 130,
      count: 12,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 2, "down"],
      left: [3, 5, "left"],
      right: [6, 8, "right"],
      up: [9, 11, "up"],
      left_idle: [4, 4],
      right_idle: [7, 7],
      up_idle: [9, 9],
      down_idle: [0, 0]
    }
  });
  monsterSpritered = new createjs.Sprite(data, "right_idle");
  monsterSpritered.framerate = 10;
  return monsterSpritered;
};

monsterRed2Sprite = function(loader) {
  var data, monsterSpritered;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("monster2red")],
    frames: {
      regX: 0,
      height: 130,
      count: 12,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 2, "down"],
      left: [3, 5, "left"],
      right: [6, 8, "right"],
      up: [9, 11, "up"],
      left_idle: [4, 4],
      right_idle: [7, 7],
      up_idle: [9, 9],
      down_idle: [0, 0]
    }
  });
  monsterSpritered = new createjs.Sprite(data, "right_idle");
  monsterSpritered.framerate = 10;
  return monsterSpritered;
};

monsterRed3Sprite = function(loader) {
  var data, monsterSpritered;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("monster3red")],
    frames: {
      regX: 0,
      height: 130,
      count: 12,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 2, "down"],
      left: [3, 5, "left"],
      right: [6, 8, "right"],
      up: [9, 11, "up"],
      left_idle: [4, 4],
      right_idle: [7, 7],
      up_idle: [9, 9],
      down_idle: [0, 0]
    }
  });
  monsterSpritered = new createjs.Sprite(data, "right_idle");
  monsterSpritered.framerate = 10;
  return monsterSpritered;
};

monsterRed4Sprite = function(loader) {
  var data, monsterSpritered;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("monster4red")],
    frames: {
      regX: 0,
      height: 130,
      count: 12,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 2, "down"],
      left: [3, 5, "left"],
      right: [6, 8, "right"],
      up: [9, 11, "up"],
      left_idle: [4, 4],
      right_idle: [7, 7],
      up_idle: [9, 9],
      down_idle: [0, 0]
    }
  });
  monsterSpritered = new createjs.Sprite(data, "right_idle");
  monsterSpritered.framerate = 10;
  return monsterSpritered;
};

monsterRed5Sprite = function(loader) {
  var data, monsterSpritered;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("monster5red")],
    frames: {
      regX: 0,
      height: 130,
      count: 12,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 2, "down"],
      left: [3, 5, "left"],
      right: [6, 8, "right"],
      up: [9, 11, "up"],
      left_idle: [4, 4],
      right_idle: [7, 7],
      up_idle: [9, 9],
      down_idle: [0, 0]
    }
  });
  monsterSpritered = new createjs.Sprite(data, "right_idle");
  monsterSpritered.framerate = 10;
  return monsterSpritered;
};

bloodSprite = function(loader) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("bloodPool")],
    frames: {
      regX: 0,
      height: 130,
      count: 1,
      regY: 0,
      width: 130
    },
    animations: {
      down: [0, 0, "down"],
      left: [0, 0, "left"],
      right: [0, 0, "right"],
      up: [0, 0, "up"],
      left_idle: [0, 0],
      right_idle: [0, 0],
      up_idle: [0, 0],
      down_idle: [0, 0]
    }
  });
  return data;
};

arrowSprite = function(loader) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("arrow")],
    frames: {
      regX: 0,
      height: 50,
      count: 1,
      regY: 0,
      width: 50
    },
    animations: {
      "default": [0, 0]
    }
  });
  arrowSprite = new createjs.Sprite(data, "default");
  arrowSprite.framerate = 10;
  return arrowSprite;
};

signSprite = function(loader) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("sign")],
    frames: {
      regX: 0,
      height: 310,
      count: 1,
      regY: 0,
      width: 330
    },
    animations: {
      "default": [0, 0]
    }
  });
  signSprite = new createjs.Sprite(data, "default");
  signSprite.framerate = 10;
  return signSprite;
};

barrelSprite = function(loader) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("barrel")],
    frames: {
      regX: 0,
      height: 200,
      count: 1,
      regY: 0,
      width: 200
    },
    animations: {
      "default": [0, 0]
    }
  });
  barrelSprite = new createjs.Sprite(data, "default");
  barrelSprite.framerate = 10;
  return barrelSprite;
};

blankSprite = function(loader, x, y) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("blank")],
    frames: {
      regX: 0,
      height: 96 * y,
      count: 1,
      regY: 0,
      width: 96 * x
    },
    animations: {
      "default": [0, 0]
    }
  });
  blankSprite = new createjs.Sprite(data, "default");
  blankSprite.framerate = 10;
  return blankSprite;
};

trapSprite = function(loader, x, y) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("trap")],
    frames: {
      regX: 0,
      height: 96,
      count: 1,
      regY: 0,
      width: 96
    },
    animations: {
      "default": [0, 0]
    }
  });
  trapSprite = new createjs.Sprite(data, "default");
  trapSprite.framerate = 10;
  return trapSprite;
};

noitemSprite = function(loader, x, y) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("noitem")],
    frames: {
      regX: 0,
      height: 50,
      count: 1,
      regY: 0,
      width: 50
    },
    animations: {
      "default": [0, 0]
    }
  });
  noitemSprite = new createjs.Sprite(data, "default");
  noitemSprite.framerate = 10;
  return noitemSprite;
};

amplifierSprite = function(loader, x, y) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("amplifier")],
    frames: {
      regX: 0,
      height: 96,
      count: 1,
      regY: 0,
      width: 96
    },
    animations: {
      "default": [0, 0]
    }
  });
  amplifierSprite = new createjs.Sprite(data, "default");
  amplifierSprite.framerate = 10;
  return amplifierSprite;
};

carrotSprite = function(loader, x, y) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("carrot")],
    frames: {
      regX: 0,
      height: 50,
      count: 1,
      regY: 0,
      width: 50
    },
    animations: {
      "default": [0, 0]
    }
  });
  carrotSprite = new createjs.Sprite(data, "default");
  carrotSprite.framerate = 10;
  return carrotSprite;
};

remoteSprite = function(loader, x, y) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("remote")],
    frames: {
      regX: 0,
      height: 50,
      count: 1,
      regY: 0,
      width: 50
    },
    animations: {
      "default": [0, 0]
    }
  });
  remoteSprite = new createjs.Sprite(data, "default");
  remoteSprite.framerate = 10;
  return remoteSprite;
};

noteSprite = function(loader, x, y) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("note")],
    frames: {
      regX: 0,
      height: 96,
      count: 1,
      regY: 0,
      width: 96
    },
    animations: {
      "default": [0, 0]
    }
  });
  noteSprite = new createjs.Sprite(data, "default");
  noteSprite.framerate = 10;
  return noteSprite;
};

deactivatorSprite = function(loader, x, y) {
  var data;
  data = new createjs.SpriteSheet({
    images: [loader.getResult("deactivator")],
    frames: {
      regX: 0,
      height: 96,
      count: 1,
      regY: 0,
      width: 96
    },
    animations: {
      "default": [0, 0]
    }
  });
  deactivatorSprite = new createjs.Sprite(data, "default");
  deactivatorSprite.framerate = 10;
  return deactivatorSprite;
};

module.exports = {
  playerSprite: playerSprite,
  exclamationSprite: exclamationSprite,
  questionSprite: questionSprite,
  monsterSprite: monsterSprite,
  monster2Sprite: monster2Sprite,
  monster3Sprite: monster3Sprite,
  monster4Sprite: monster4Sprite,
  monster5Sprite: monster5Sprite,
  monsterRedSprite: monsterRedSprite,
  monsterRed2Sprite: monsterRed2Sprite,
  monsterRed3Sprite: monsterRed3Sprite,
  monsterRed4Sprite: monsterRed4Sprite,
  monsterRed5Sprite: monsterRed5Sprite,
  bloodSprite: bloodSprite,
  arrowSprite: arrowSprite,
  signSprite: signSprite,
  barrelSprite: barrelSprite,
  blankSprite: blankSprite,
  trapSprite: trapSprite,
  noitemSprite: noitemSprite,
  amplifierSprite: amplifierSprite,
  carrotSprite: carrotSprite,
  remoteSprite: remoteSprite,
  noteSprite: noteSprite,
  deactivatorSprite: deactivatorSprite
};
});

;require.register("coffee/utils", function(exports, require, module) {
module.exports = {
  wrap: function(ctx, phrase, maxPxLength, textStyle) {
    var i, l, lastPhrase, measure, phraseArray, w, wa, _i, _ref;
    wa = phrase.split(" ");
    phraseArray = [];
    lastPhrase = wa[0];
    l = maxPxLength;
    measure = 0;
    ctx.font = textStyle;
    for (i = _i = 1, _ref = wa.length; _i <= _ref; i = _i += 1) {
      w = wa[i];
      if (w === '\n') {
        phraseArray.push(lastPhrase);
        phraseArray.push('\n');
        lastPhrase = "";
        continue;
      }
      measure = ctx.measureText(lastPhrase + w).width;
      if (measure < l) {
        lastPhrase += " " + w;
      } else {
        phraseArray.push(lastPhrase);
        lastPhrase = w;
      }
      if (i === wa.length - 1) {
        phraseArray.push(lastPhrase);
        break;
      }
    }
    return phraseArray;
  }
};
});

;require.register("coffee/win", function(exports, require, module) {
var Win,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Win = (function() {
  function Win(delegate) {
    var _ref;
    this.delegate = delegate;
    this.tick = __bind(this.tick, this);
    this.close = __bind(this.close, this);
    this.show = __bind(this.show, this);
    this.addText = __bind(this.addText, this);
    _ref = this.delegate, this.stage = _ref.stage, this.keyInput = _ref.keyInput, this.showHome = _ref.showHome;
    this.visible = false;
    this.components = [];
  }

  Win.prototype.addText = function() {
    var esc, text;
    this.stage.x = 0;
    this.stage.y = 0;
    text = new createjs.Text("You deactivated all the bunnies! You Winner", "20px Arial", "yellow");
    text.x = 200;
    text.y = 400;
    text.snapToPixel = true;
    text.textBaseline = "alphabetic";
    esc = new createjs.Text("(esc to go back)", "14px Arial", "white");
    esc.x = 200;
    esc.y = 300;
    esc.snapToPixel = true;
    esc.textBaseline = "alphabetic";
    this.stage.addChild(text);
    this.stage.addChild(esc);
    this.components.push(text);
    this.components.push(esc);
    return this.stage.update();
  };

  Win.prototype.show = function() {
    this.visible = true;
    return this.addText();
  };

  Win.prototype.close = function() {
    var comp, _i, _len, _ref;
    this.visible = false;
    _ref = this.components;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      comp = _ref[_i];
      this.stage.removeChild(comp);
    }
    return this.components = [];
  };

  Win.prototype.tick = function(event) {
    if (this.keyInput.escHeld) {
      this.close();
      return this.showHome();
    }
  };

  return Win;

})();
});

;
//# sourceMappingURL=application.js.map