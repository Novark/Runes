var app = angular.module('runes', []);
var underscore = angular.module("underscore", []);

app.service('itemGenerator', newItem);

function newItem() {
    //TODO
    var a = 10;
    this.test = function() {
        return {"type": "chest", "armour": a};
    };
}

app.directive('item', function($compile) {
    var contentContainer;
    return {
        restrict: "E",
        scope: {
            itemData: "=data"
        },
        link: function(scope, element, attrs) {
            $(function() {
                $(element).draggable({
                    start: function(event, ui) {
                        $(ui.helper).find('.tooltip').hide();
                    },
                    helper: 'clone',
                    revert: 'invalid',
                    revertDuration: false
                });

                $(element).uitooltip({
                    items: "*",
                    content: function() {
                        itemHTML = "";
                        itemHTML += "<div class='item-header rarity-rare'>Magic Item of Champions</div>";
                        if (scope.itemData.sockets !== 0) {
                            itemHTML += "Sockets: <font color='#ff6600'>" + (scope.itemData.sockets).toString() + "</font>";
                        } else {
                            itemHTML += "Sockets: <font color='#ff6600'>None</font>";
                        }
                        itemHTML += "<br>";
                        itemHTML += "Image: " + scope.itemData.type.image;
                        return itemHTML;
                    },
                    //position: {my: "right center", at: "right top+16"},
                    //content: function() {
                        //$("span.item-tooltip-sockets").replaceWith(scope.itemData.type.image);
                        //itemHTML = $("div.item-tooltip").html();
                        //return itemHTML;

                    //},
                    show: {duration: 0},
                    hide: {duration: 0}
                });
                $(element).click(function() {
                    $(element).tooltip("close");
                });
            });
        },
        template: "<img src={{itemData.type.image}} style='border: 2px solid #DDDDDD !important'>"
        //templateUrl: 'item.html'
    };
});



app.controller('ContentController', ['itemGenerator', '$scope', '$timeout', function(itemGenerator, $scope, $timeout) {

    $scope.a = itemGenerator.test();
    $scope.b = itemGenerator.test();
    $scope.b.type = "head";
    console.log($scope.a);
    console.log($scope.b);

    $scope.test = [$scope.a, $scope.b];

    var constants = {
        "quest": {
            "type": {
                "DEFEAT": 0,
                "FIND": 1,
                "ACQUIRE": 2
            },
            "status": {
                "INCOMPLETE": 0,
                "COMPLETE": 1
            }
        }
    };

    var game = {
        "actionTimerCount": 0
    };

    //Defines the item base-types, and the properties that are common across
    //all items of this type
    //TODO: Sort these into categories (e.g. chest {chest1, chest2, chest3}, etc...)
    var itemTypes = {
        "head1": {"image": "temp.png", "baseArmour": 5},
        "chest1": {"image": "temp2.png", "baseArmour": 20},
        "hands1": {"image": "temp.png", "baseArmour": 5},
        "legs1": {"image": "temp.png", "baseArmour": 5},
        "legs2": {"image": "temp2.png", "baseArmour": 10},
        "legs3": {"image": "temp3.png", "baseArmour": 15},
        "feet1": {"image": "temp.png", "baseArmour": 5},
        "ring1": {"image": "temp3.png", "baseArmour": 0},
        "ring2": {"image": "temp3.png", "baseArmour": 0},
        "amulet1": {"image": "temp2.png", "baseArmour": 0}
    };

    //Contains all of the items that are currently equipped on the main hero
    $scope.heroItems = {
        "head": {"type": itemTypes["head1"], "sockets": 1},
        "chest": {"type": itemTypes["chest1"], "sockets": 3},
        "hands": {"type": itemTypes["hands1"], "sockets": 2},
        "legs": {"type": itemTypes["legs2"], "sockets": 4},
        "feet": {"type": itemTypes["feet1"], "sockets": 1},
        "ringLeft": {"type": itemTypes["ring1"], "sockets": 0},
        "ringRight": {"type": itemTypes["ring2"], "sockets": 0},
        "amulet": {"type": itemTypes["amulet1"], "sockets": 0}
    };

    //TODO: Swap two items
    $scope.swapItems = function(item1, item2) {
        temp = item2;
        item1 = item2;
        item2 = temp;
    };

    //TODO: Rune list
    var runeList = {
        "R1": {p1: 1, p2: 2, p3: 3},
        "R2": {p1: 1, p2: 2, p3: 3},
        "R3": {p1: 1, p2: 2, p3: 3},
        "R4": {p1: 1, p2: 2, p3: 3},
        "R5": {p1: 1, p2: 2, p3: 3}
    };

    var skills = {
        "pierce": {
            "description": "Flavour text goes here",
            "unlocksAt": 1,
            "image": "",
            "type": "active",
            "behaviour": {
                
            }
        }
    };

    var classes = {
        "enforcer": {
            "name": "Enforcer",
            "baseHealth": 50,
            "baseArmour": 50,
            "baseCritChance": 0.05,
            "baseCritMultiplier": 1.2,
            "baseAPS": 1.0,
            "skills": []
        },
        "acolyte": {
            "name": "Acolyte",
            "baseHealth": 50,
            "baseArmour": 0,
            "baseCritChance": 0.07,
            "baseCritMultiplier": 1.5,
            "baseAPS": 1.1,
            "skills": []
        },
        "splitter": {
            "name": "Splitter",
            "baseHealth": 75,
            "baseArmour": 0,
            "baseCritChance": 0.09,
            "baseCritMultiplier": 1.35,
            "baseAPS": 1.2,
            "skills": []
        },
        "dev": {
            "name": "Developer",
            "baseHealth": 75,
            "baseArmour": 0,
            "baseCritChance": 0.1,
            "baseCritMultiplier": 5,
            "baseAPS": 5,
            "skills": []
        }
    };

    var heroBaseInfo = {
        "class": classes.dev
    };

    var heroBaseStats = {
        "health": heroBaseInfo.class.baseHealth,
        "armour": heroBaseInfo.class.baseArmour,
        "damageMin": 1,
        "damageMax": 3,
        "critChance": heroBaseInfo.class.baseCritChance,
        "critMultiplier": heroBaseInfo.class.baseCritMultiplier,
        "aps": heroBaseInfo.class.baseAPS,
        "experience": 0
    };

    //Accessible to the view
    $scope.hero = {
        "class": heroBaseInfo.class.name,
        "inCombat": false,
        "target": null
    };

    var getAttackTime = function() {
        return Math.round((1 / heroBaseStats.aps) * 1000);
    };

    var mods = {
        armourMod: function(source, amount) {
            //Does the mod's functionality go here, or should the mods object only contain codes or something?
            
        }
    };

    var abilities = {
        "giveArmourLR": {
            "name": "Shielding",
            effect: function(source) {
                id = source.id;
                source = source;

                var position = $scope.enemyBoard.board.indexOf(source);

                armour = {"armour": 50, "maxArmour": 50};

                if (enemyAt(position + 1) === true) {
                    if ($scope.enemyBoard.board[position + 1].armourList[id] === undefined) {
                        $scope.enemyBoard.board[position + 1].armourList[id] = armour;
                    }
                }

                if (enemyAt(position - 1) === true) {
                    if ($scope.enemyBoard.board[position - 1].armourList[id] === undefined) {
                        $scope.enemyBoard.board[position - 1].armourList[id] = armour;
                    }
                }

            },
            start: function(source) {
                this.effect(source);
            },
            end: function(source) {
                id = source.id;
                source = source;

                var position = $scope.enemyBoard.board.indexOf(source);

                if (enemyAt(position + 1) === true) {
                    if ($scope.enemyBoard.board[position + 1].armourList[id] !== undefined) {
                        delete $scope.enemyBoard.board[position + 1].armourList[id];
                    }
                }

                if (enemyAt(position - 1) === true) {
                    if ($scope.enemyBoard.board[position - 1].armourList[id] !== undefined) {
                        delete $scope.enemyBoard.board[position - 1].armourList[id];
                    }
                }
            }
        }
    };

    //Returns true if there is an enemy at the specified position and false otherwise
    var enemyAt = function(position) {
        if (position < 0) {
            return false;
        }

        if (position > ($scope.enemyBoard.board.length - 1)) {
            return false;
        }

        return true;
    };

    //Returns a damage multiplier based on the critical hit chance
    var damageMultiplier = function(critChance, critMultiplier) {
        var roll = Math.random();
        if (roll <= critChance) {
            return critMultiplier;
        } else {
            return 1;
        }
    };

    //This simply increments a value which is then appended to the unique ID that is generated in getUniqueID()
    var incrementID = {
        "value": 0,
        increment: function() {
            if (this.value >= 99999) {
                this.value = 0;
                return this.value;
            } else {
                this.value = this.value + 1;
                return this.value;
            }
        }
    };

    //Return a unique ID based on the date and a value which is incremented each time a timestamp is generated
    var getUniqueID = function() {
        var id = new Date().valueOf();
        return id + "." + incrementID.increment();
    };

    var enemyDefinitions = {
        "boar": {
                    "name": "Wild Boar",
                    "image": "temp.png",
                    "baseHealth": 5,
                    "baseArmour": 0,
                    "baseDamageMin": 5,
                    "baseDamageMax": 10,
                    "abilities": []
                },
        "wolf": {
                    "name": "Wolf",
                    "image": "temp2.png",
                    "baseHealth": 10,
                    "baseArmour": 0,
                    "baseDamageMin": 10,
                    "baseDamageMax": 15,
                    "abilities": []
                },
        "skeleton": {
                    "name": "Skeleton",
                    "image": "temp3.png",
                    "baseHealth": 10,
                    "baseArmour": 10,
                    "baseDamageMin": 5,
                    "baseDamageMax": 15,
                    "abilities": []
                },
        "skeletalDefender": {
                    "name": "Skeletal Defender",
                    "image": "temp.png",
                    "baseHealth": 5,
                    "baseArmour": 10,
                    "baseDamageMin": 5,
                    "baseDamageMax": 10,
                    "abilities": [abilities.giveArmourLR]
                }
    };

    var levelEnemies = [
        {"enemyPool": [null]},
        {"enemyPool": [enemyDefinitions.boar, enemyDefinitions.wolf, enemyDefinitions.skeleton, enemyDefinitions.skeletalDefender]}
    ];

    //Define the quests
    var quests = {
        "level1": {
            "boar1": {
                        "name": "A Witty Quest Title",
                        "description": "The boars are invading! Defeat as many as possible!",
                        "objectives": [{"type": constants.quest.type.DEFEAT, "target": enemyDefinitions.boar, "amount": 10, "currentAmount": 0, "status": constants.quest.status.INCOMPLETE}],
                        "rewards": {"experience": 100, "gold": 25, "items": null},
                        "status": constants.quest.status.INCOMPLETE
                    },
            "skeleton1": {
                        "name": "Skeleton Quest #1",
                        "description": "The skeletons are invading! Defeat as many as possible!",
                        "objectives": [
                                        {"type": constants.quest.type.DEFEAT, "target": enemyDefinitions.skeleton, "amount": 1, "currentAmount": 0, "status": constants.quest.status.INCOMPLETE},
                                        {"type": constants.quest.type.DEFEAT, "target": enemyDefinitions.skeletalDefender, "amount": 2, "currentAmount": 0, "status": constants.quest.status.INCOMPLETE}
                                    ],
                        "rewards": {"experience": 100, "gold": 25, "items": null},
                        "status": constants.quest.status.INCOMPLETE
                    }
        },
        "level2": {},
        "level3": {}
    };

    //Sets up a list of quests available to the player, and provides an active flag
    $scope.questLog = [quests.level1.boar1, quests.level1.skeleton1];

    //Update the quest log objectives
    var updateQuestObjectives = function(type, data) {

        _.each($scope.questLog, function(quest) {
            _.each(quest.objectives, function(objective) {
                
                //Update each quest type
                switch(type) {
                    //Quest type: defeat
                    case constants.quest.type.DEFEAT:
                        if ((objective.type === constants.quest.type.DEFEAT) && (data === objective.target)) {
                            if (objective.currentAmount < objective.amount) {
                                objective.currentAmount += 1;
                            }
                            if (objective.currentAmount == objective.amount) {
                                objective.status = constants.quest.status.COMPLETE;
                            }
                        }
                        break;

                    //Quest type: find
                    case "find":
                        console.log("TODO");
                        break;

                    //Quest type: acquire
                    case "acquire":
                        console.log("TODO");
                        break;
                }

            });

            //Check to see if the quest is completed
            checkQuestCompletion(quest);

        });
    };

    //Check to see if the provided quest can be completed
    var checkQuestCompletion = function(quest) {
        searchResult = _.findWhere(quest.objectives, {"status": constants.quest.status.INCOMPLETE});

        if (searchResult === undefined) {
            quest.status = constants.quest.status.COMPLETE;
        }
    };

    //Complete a quest
    var completeQuest = function(quest) {
        //TODO - give the rewards to the player
        $scope.questLog = _.without($scope.questLog, _.findWhere($scope.questLog, quest));
    };

    //Order of operations for a new enemy being added to the board:
    //
    //1. Add enemy
    //2. New enemy calls create()
    //3. create() calls start() for all abilities available to the enemy
    //4. $scope.enemyBoard.update() calls update() for all enemies on the board
    //----------
    //Order of operations for an enemy being removed from the board:
    //
    //1. Enemy to be removed calls its destroy() function
    //2. Enemy calls end() for all abilities available to the enemy
    //3. Hero target / combat variables are updated
    //4. Enemy is removed from the board
    //5. Quest objectives are updated
    //6. $scope.enemyBoard.update() calls update() for all enemies on the board

    $scope.enemyBoard = {
        "board": [],
        update: function() {
            for (var enemy in this.board) {
                this.board[enemy].update();
            }
        },
        deactivate: function() {
            for (var enemy in this.board) {
                this.board[enemy].active = false;
            }
        }
    };

    //Spawn an enemy
    var spawnEnemy = function() {
        var currentLevel = 1; //TODO: Change this to use the current level
        var enemyChoices = levelEnemies[currentLevel].enemyPool;
        var enemy = enemyChoices[Math.floor(Math.random() * enemyChoices.length)];
        var newEnemy = {
                            "enemy": enemy,
                            "id": null,
                            "active": false,
                            "healthList": {},
                            "health": enemy.baseHealth,
                            "maxHealth": enemy.baseHealth,
                            "healthMultipliers": {"self": {"amount": 1}},
                            "armourList": {},
                            "armour": enemy.baseArmour,
                            "maxArmour": enemy.baseArmour,
                            "armourMultipliers": {"self": {"amount": 1}},
                            "mods": [],
                            "abilities": enemy.abilities,
                            getHealth: function() {
                                countCurrent = this.health;
                                countMax = this.maxHealth;

                                for (var h in this.healthList) {
                                    countCurrent = countCurrent + this.healthList[h].health;
                                    countMax = countMax + this.healthList[h].maxHealth;
                                }

                                return {"health": countCurrent, "maxHealth": countMax};

                            },
                            getArmour: function() {
                                countCurrent = this.armour;
                                countMax = this.maxArmour;

                                for (var a in this.armourList) {
                                    countCurrent = countCurrent + this.armourList[a].armour;
                                    countMax = countMax + this.armourList[a].maxArmour;
                                }

                                return {"armour": countCurrent, "maxArmour": countMax};

                            },
                            create: function() {
                                this.id = getUniqueID();

                                for (var a in this.abilities) {
                                    this.abilities[a].start(this);
                                }
                            },
                            hit: function() {
                                var damage = Math.random() * (heroBaseStats.damageMax - heroBaseStats.damageMin) + heroBaseStats.damageMin;
                                damage = Math.round(damage * damageMultiplier(heroBaseStats.critChance, heroBaseStats.critMultiplier));
                                
                                //Check to see if the damage exceeds the remaining base armour
                                if ((this.armour - damage) >= 1) {
                                    this.armour = this.armour - damage;
                                } else {
                                    if (this.maxArmour > 0) {
                                        damageSurplus = damage - this.armour + 1;
                                        this.armour = 1;
                                    } else {
                                        damageSurplus = damage - this.armour;
                                    }

                                    //Check for additional armour from the armour list
                                    //armourListCurrent = 0;
                                    for (var a in this.armourList) {

                                        //See if the current entry has some armour
                                        if (this.armourList[a].armour > 0) {
                                            //If it does, then find out if there is a surplus of damage, and update the surplus amount as necessary
                                            if (this.armourList[a].armour - damageSurplus < 0) {
                                                damageSurplus = damageSurplus - this.armourList[a].armour;
                                                this.armourList[a].armour = 0;
                                            } else {
                                                this.armourList[a].armour = this.armourList[a].armour - damageSurplus;
                                                damageSurplus = 0;
                                            }

                                        }
                                        //armourListCurrent = armourListCurrent + this.armourList[a].armour;
                                    }

                                    //We've now gone through the armour list, and done any damage there as required...there may still be surplus damage to distribute

                                    //Deal the last point of damage to the armour if there is any surplus damage, and if the target had armour to begin with
                                    if (this.maxArmour > 0) {
                                        if (damageSurplus > 0) {
                                            damageSurplus = damageSurplus - 1;
                                            this.armour = 0;
                                        }
                                    }

                                    //Next, deal any surplus damage to the health - this is almost identical to the previous steps with armour

                                    //Check to see if the damage exceeds the remaining base health
                                    if ((this.health - damageSurplus) >= 1) {
                                        this.health = this.health - damageSurplus;
                                    } else {
                                        damageSurplus = damageSurplus - this.health + 1;
                                        this.health = 1;

                                        //Check for additional health from the health list
                                        //healthListCurrent = 0;
                                        for (var h in this.healthList) {

                                            //See if the current entry has some health
                                            if (this.healthList[h].health > 0) {
                                                //If it does, then find out if there is a surplus of damage, and update the surplus amount as necessary
                                                if (this.healthList[h].health - damageSurplus < 0) {
                                                    damageSurplus = damageSurplus - this.healthList[h].health;
                                                    this.healthList[h].health = 0;
                                                } else {
                                                    this.healthList[h].health = this.healthList[h].health - damageSurplus;
                                                    damageSurplus = 0;
                                                }

                                            }
                                            //healthListCurrent = healthListCurrent + this.healthList[h].health;
                                        }

                                        //Deal the last point of damage to the health if there is any surplus damage
                                        if (damageSurplus > 0) {
                                            damageSurplus = damageSurplus - 1;
                                            this.health = 0;
                                            this.destroy();
                                        }
                                    }
                                }
                            },
                            giveMods: function() {
                                //TODO
                            },
                            destroy: function() {
                                for (var a in this.abilities) {
                                    this.abilities[a].end(this);
                                }

                                $scope.hero.inCombat = false;
                                $scope.hero.target = null;
                                $scope.enemyBoard.board = _.without($scope.enemyBoard.board, _.findWhere($scope.enemyBoard.board, this));

                                updateQuestObjectives(constants.quest.type.DEFEAT, this.enemy);

                                $scope.enemyBoard.update();
                            },
                            update: function() {
                                for (var a in this.abilities) {
                                    this.abilities[a].effect(this);
                                }
                                //console.log(this);
                                //console.log("---");
                            },
                            activate: function() {
                                $scope.enemyBoard.deactivate();
                                this.active = true;
                                $scope.hero.inCombat = true;
                                $scope.hero.target = this;
                            }
                        };
        $scope.enemyBoard.board.push(newEnemy);
        newEnemy.create();
        $scope.enemyBoard.update();

    };

    $scope.energy = 0;
    
    $scope.levels = [
        {"level": 0, "unlocksAt": 0, "status": true, "value": 0},
        {"level": 1, "unlocksAt": 1, "status": true, "value": 1},
        {"level": 2, "unlocksAt": 50, "status": true, "value": 5},
        {"level": 3, "unlocksAt": 250, "status": true, "value": 10},
        {"level": 4, "unlocksAt": 650, "status": true, "value": 25}
    ];

    $scope.increment = function(incrementAmount) {
        $scope.energy = $scope.energy + incrementAmount;
    };

    $scope.buttonClick = function(incrementAmount) {
        $scope.increment(incrementAmount);
        $scope.checkUnlocks();
        spawnEnemy();
        //$scope.heroItems.head = $scope.heroItems.chest;
        //$scope.swapItems($scope.heroItems.head, $scope.heroItems.amulet);
    };

    //Debug function
    $scope.checkUnlocks = function() {
        var level = null;
        for (level in $scope.levels) {
            if (($scope.energy >= $scope.levels[level]["unlocksAt"]) & ($scope.levels[level]["value"] > 0)) {
                $scope.levels[level]["status"] = false;
            }
        }

    };

    //This timer is used for development purposes
    $scope.intervalFunction = function() {
        $timeout(function() {
            $scope.increment(1);
            $scope.checkUnlocks();

            $scope.intervalFunction();
        }, 1000);
    };

    //This timer is used to increment the action progress bar, and ties in with the hero's APS
    $scope.actionTimer = function() {
        $timeout(function() {
            if ($scope.hero.inCombat === true) {
                game.actionTimerCount += 10;

                if (game.actionTimerCount >= getAttackTime()) {
                    $scope.hero.target.hit();
                    game.actionTimerCount = 0;
                }

            }

            $scope.actionTimer();
        }, 10);
    };

    //These helpers can be used to support various view requirements
    $scope.viewHelpers = {

        //Get the action bar percentage
        getActionBarPercent: function() {
            return Math.ceil((game.actionTimerCount / getAttackTime()) * 100);
        },

        "constants": constants,

        completeQuest: function(quest) {
            completeQuest(quest);
        }

    };

    $scope.intervalFunction();
    $scope.actionTimer();
    spawnEnemy();
    spawnEnemy();
    spawnEnemy();

}]);
