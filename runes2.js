/*jslint multistr: true */

/*
Notes:

Themes:
1. Forest (Freewind Forest)
2. Graveyard (Freewind Cemetary)
3. Temple (Temple of Ios)
4. Desert (Arid Frontier)
5. Mountains (Silverpeak)
6. Volcanic (Stonecore)
7. Jungle (Ivory Tropics)
8. Arcane (Realm of the Four)
9. Sky (Shimmering Expanse)
10. Celestial (Aurellis) / Aurellians / Spectral Plains
11. Overgrown Ruins
12. Crypt

Runes:
Omn
Wel
Lek
Lex
Tol
Quo
Sel
Oris
Ven
Lio
Qal
Uen
Zor
Ort
Wyx
Osh
Sar
Isp
Ung
Fen
Ro
Mer
Eln
Jix
Xii
Vol
Aur

Enemies:
1. Boars, Wolves, Bears
2. Spiders, Snakes, Centaurs
3. Skeletons, Guardians, Traps
4. Mummies, Scorpions, Wasps
5. Yetis, Giants, Ogres
6. Dragons, Demons
7. Tigers, Alligators, Crocodiles, Gorillas
8. Windigoes, Fairies, Sprites
9. Sentries, Mages
10. Illuminated

Enemy Abilities:
1. Splitting - Splits into two or more smaller versions of itself
2. Shielding - Provides shields to other enemies
3. Exploding - Explodes, dealing damage to other enemies
4. Absorbing - Absorbs damage dealt to the enemy
5. Linked - Health is linked to other enemies
6. Stealthed - Can not be targeted until other enemies have been killed
7. Builders - Constructs another enemy unless killed within a set time limit
8. Pack - Extra health when adjacent to other pack enemies
9. Resilient - Extra resistance to certain damage types
10. Debuffers - Give penalties to the player (such as attack speed decreases, or critical hit penalties, etc...)
11. Vampiric - Steals life from adjacent enemies
12. Shimmering - Drops extra loot
13. Shadowed - Enemies have a shadow version of themselves which must also be killed
14. Quick - Can not receive critical hits
15. Healthy - Extra health
16. Healing - Regenerates health
17. Avenging - Gives allies extra health / armour on death

Ideas:
Adventures - side areas that progress horizontally towards a boss fight that has a chance to drop an item class that is only available in adventures
Champion / Rare packs - self explanatory


*/


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

app.directive('item', function() {
    return {
        restrict: "E",
        scope: {
            itemData: "=data",
            itemHelpers: "=helper",
            itemSlot: "@slot"
        },
        link: function(scope, element, attrs) {
            $(function() {
                //Hover
                //$(element).hover(function() {
                //    $(element).find("span.item-inner").toggleClass("item-hover");
                //});

                //Mouse Over
                $(element).find("span.item-outer").mouseover(function() {
                    $(element).find("span.item-inner").addClass("item-hover");
                });

                //Mouse Out
                $(element).find("span.item-outer").mouseout(function() {
                    $(element).find("span.item-inner").removeClass("item-hover");
                });

                //Double Click
                $(element).dblclick(function() {
                    //alertfind("span.item-outer").("Double Clicked!");
                    //scope.itemHelpers.swapItems(scope.itemData);
                });

                //Mouse Down
                $(element).find("span.item-outer").mousedown(function() {
                    $(this).css("z-index", 100);
                });

                //Draggable
                $(element).find("span.item-outer").draggable({
                    start: function(event, ui) {
                        $(this).css("opacity", 0.25);
                        console.log("Start!");
                        scope.itemHelpers.setItemSource(scope.itemData);
                        if (scope.itemData === null) {
                            $(this).css("opacity", 1);
                            return false;
                        }
                        //scope.itemHelpers.setTargetSource(scope.itemData);
                        //$(element).find("span.item-inner").removeClass("item-hover");
                        //$(ui.helper).find('.tooltip').hide();
                    },
                    stop: function(event, ui) {
                        $(this).css("opacity", 1);
                    },
                    helper: 'clone',
                    revert: 'invalid',
                    revertDuration: false
                });

                //Droppable
                $(element).find("span.item-outer").droppable({
                    over: function(event, ui) {
                        console.log("over");
                        $(element).find("span.item-inner").addClass("item-hover");
                    },

                    out: function(event, ui) {
                        console.log("out");
                        $(element).find("span.item-inner").removeClass("item-hover");
                        return false;
                    },

                    drop: function(event, ui) {
                        console.log("Dropped!");
                        $(element).find("span.item-outer").uitooltip();
                        $(element).find("span.item-outer").uitooltip('disable');
                        scope.itemHelpers.setItemTarget(scope.itemData);
                        setTimeout(function() {
                            $(element).find("span.item-outer").uitooltip('enable');
                            $(".ui-tooltip").css("display", "none");
                            $(element).find("span.item-inner").removeClass("item-hover");
                            scope.itemHelpers.swapItems("inventory", scope.itemSlot);
                        }, 1);
                        $(element).find("span.item-inner").removeClass("item-hover");
                        return false;
                    }
                });

                //Tooltip
                $(element).find("span.item-outer").uitooltip({
                    items: "*",
                    position: {at: "right+7 top-15"},
                    tooltipClass: "tooltip-extend",
                    content: function() {
                        if (scope.itemData === null) {
                            return false;
                        }
                        console.log(scope.itemSlot);
                        var itemHTML = scope.itemData.getHTMLHeader() + scope.itemData.getHTMLBody() + scope.itemData.getHTMLFooter();
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
                    //$(".ui-tooltip").siblings(".ui-tooltip").css("display", "none");
                    //$(element).tooltip("close");
                });
            });
        },
        template: "<span class=\"item-outer\" style=\"width: 68px; height: 68px; background-image: url('bg_{{itemData.rarity}}.png'); display: block;\">\
                    <span class=\"item-inner\" style=\"width: 68px; height: 68px; background-image: url('{{itemData.image}}'); display: block; border: 2px solid #000000\"></span></span>"
        //template: "<img src={{itemData.type.image}} style='border: 2px solid #DDDDDD !important'>"
        //templateUrl: 'item.html'
    };
});

app.directive('skill', function() {
    return {
        restrict: "E",
        scope: {
            skillData: "=data",
            skillHelpers: "=helper"
        },
        link: function(scope, element, attrs) {
            $(function() {
                //Double-click
                $(element).dblclick(function() {
                    //alert("Hello!");
                    scope.$apply("debug()");
                });



                //Tooltip
                $(element).uitooltip({
                    items: "*",
                    position: {at: "right+7 top-15"},
                    tooltipClass: "tooltip-extend",
                    content: function() {
                        var skillHTML = "";
                        skillHTML += "<div class='skill-tooltip'>";
                        skillHTML += "<div class='skill-header'>" + scope.skillData.name + "</div>";
                        
                        skillHTML += "<div class='skill-divider'></div>";
                        skillHTML += "<div class='skill-description'>" + scope.skillData.description + "</div>";
                        skillHTML += "<div class='skill-divider'></div>";
                        
                        skillHTML += "<div class='skill-data'>";
                        skillHTML += scope.skillHelpers.getFloorHTML(scope.skillData.unlocksAt.floor) + "<br>";
                        skillHTML += "Requirements: " + scope.skillHelpers.getStatHTML("strength", scope.skillData.unlocksAt.strength) + " STR, " + scope.skillHelpers.getStatHTML("agility", scope.skillData.unlocksAt.agility) + " AGI, " + scope.skillHelpers.getStatHTML("intelligence", scope.skillData.unlocksAt.intelligence) + " INT";
                        skillHTML += "</div>";

                        skillHTML += "</div>";
                        return skillHTML;
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
                    //$(element).tooltip("close");
                });
            });
        },
        template: "<span ng-class=\"{active: skillData.active === true, inactive: skillData.active === false}\" style=\"width: 68px; height: 68px; background-image: url('{{skillData.image}}'); display: block; border: 2px solid #DDDDDD\"></span>"
        //template: "<img src={{itemData.type.image}} style='border: 2px solid #DDDDDD !important'>"
        //templateUrl: 'item.html'
    };
});



app.controller('ContentController', ['itemGenerator', '$scope', '$timeout', function(itemGenerator, $scope, $timeout) {

    /*
    ----------------------------------------------------------------------------------------------------
    ----- Game Constants

     ######   #######  ##    ##  ######  ########    ###    ##    ## ########  ######  
    ##    ## ##     ## ###   ## ##    ##    ##      ## ##   ###   ##    ##    ##    ##
    ##       ##     ## ####  ## ##          ##     ##   ##  ####  ##    ##    ##      
    ##       ##     ## ## ## ##  ######     ##    ##     ## ## ## ##    ##     ######  
    ##       ##     ## ##  ####       ##    ##    ######### ##  ####    ##          ##
    ##    ## ##     ## ##   ### ##    ##    ##    ##     ## ##   ###    ##    ##    ##
     ######   #######  ##    ##  ######     ##    ##     ## ##    ##    ##     ######  

    ----------------------------------------------------------------------------------------------------
    */
    function debug() {
        alert("Hello!");
    }

    var constants = {
        "game": {
            "state": {
                "START": 0,
                "PLAY": 1,
                "HERO": 2,
                "INVENTORY": 3,
                "QUESTS": 4
            }
        },

        "floor": {
            "status": {
                "PRESTART": 0,
                "INCOMPLETE": 1,
                "COMPLETE": 2
            }
        },

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
        },

        "skill": {
            "type": {
                "ACTIVE": 0,
                "PASSIVE": 1
            }
        },

        "html": {
            "colour": {
                "RED": "#EE5555",
                "GREEN": "#55EE55",
                "BLUE": "#5555EE"
            }
        },

        "item": {
            "type": {
                "weapon": {
                    "SWORD": "Sword",
                    "DAGGER": "Dagger",
                    "AXE": "Axe",
                    "STAFF": "Staff",
                    "BOW": "Bow"
                },

                "armour": {
                    "HEAD": "Head",
                    "CHEST": "Chest",
                    "HANDS": "Hands",
                    "LEGS": "Legs",
                    "FEET": "Feet",
                },

                "jewellery": {
                    "RING": "Ring",
                    "AMULET": "Amulet"
                }
            },

            "mod": {
                //Lacerate
                "LAC": 0,

                //Critical Chance
                "CC": 1,

                //Critical Multiplier
                "CM": 2,

                //Bypass Armour
                "BYA": 3,

                //Multi-strike
                "MS": 4,

                //Maximum Mana
                "MNA": 5,

                //Mana Per Tick
                "MPT": 6,

                //Mana Tick Rate
                "MTR": 7
            },

            "class": {
                "WEAPON": 0,
                "ARMOUR": 1,
                "RUNE": 2,
                "QUESTITEM": 3,
                "TRADEGOOD": 4
            },

            "rarity": {
                "NORMAL": "normal",
                "MAGIC": "magic",
                "RARE": "rare",
                "SET": "set",
                "MYSTICAL": "mystical"
            }
        }
    };

    Object.freeze(constants);









    /*
    ----------------------------------------------------------------------------------------------------
    ----- Player Setup

    ########  ##          ###    ##    ## ######## ########      ######  ######## ######## ##     ## ########  
    ##     ## ##         ## ##    ##  ##  ##       ##     ##    ##    ## ##          ##    ##     ## ##     ##
    ##     ## ##        ##   ##    ####   ##       ##     ##    ##       ##          ##    ##     ## ##     ##
    ########  ##       ##     ##    ##    ######   ########      ######  ######      ##    ##     ## ########  
    ##        ##       #########    ##    ##       ##   ##            ## ##          ##    ##     ## ##        
    ##        ##       ##     ##    ##    ##       ##    ##     ##    ## ##          ##    ##     ## ##        
    ##        ######## ##     ##    ##    ######## ##     ##     ######  ########    ##     #######  ##        

    ----------------------------------------------------------------------------------------------------
    */

    /* Possible stats:

    Any of these can be negative as well, in order to balance out other effects

    - Health
    - Mana
    - Armour
    - STR / AGI / INT / END / All attributes
    - Attack speed
    - + Mana / Mana regen
    - Lower item requirements
    - (X) when on full mana / below X% mana / spend X% mana
    - %MF (Quality and drop amounts)
    - Added (element) damage
    - Crit damaage / multiplier
    - Culling strike on critical hits
    - Non-critical hits do (X)
    - Mana regenerates 2x faster below 50% and 2x slower above 50%
    - Never deal critical strikes, but gain (X)
    - Sockets
    - Mana gained on kill / on hit
    - Elemental status effects
    - X% reduced mana cost for all skills
    - X% increased mana cost for all skills, but (X)
    - Increased (STAT) requirement
    - Experienece gain



    */

    //Contains all of the items that are currently equipped on the hero
    var heroItems = {
        "head": {"type": 0, "image": "helm.png", "baseArmour": 5, "sockets": 1, "rarity": "mystical"},
        "chest": {"type": 0, "image": "temp.png", "baseArmour": 5, "sockets": 3, "rarity": "set"},
        "hands": {"type": 0, "image": "temp2.png", "baseArmour": 5, "sockets": 2, "rarity": "magic"},
        "legs": {"type": 0, "image": "temp3.png", "baseArmour": 5, "sockets": 4, "rarity": "normal"},
        "feet": {"type": 0, "image": "temp.png", "baseArmour": 5, "sockets": 1, "rarity": "normal"},
        "ringLeft": {"type": 0, "image": "temp2.png", "baseArmour": 5, "sockets": 0, "rarity": "magic"},
        "ringRight": {"type": 0, "image": "temp3.png", "baseArmour": 5, "sockets": 0, "rarity": "rare"},
        "amulet": null
    };

    var heroBaseStats = {
        /* Defensive */
        "health": 50,
        "healthMax": 50,
        "mana": 20,
        "manaMax": 20,
        "manaPerTick": 1,
        "manaTickRate": 5,
        "armour": 25,
        "armourMax": 25,
        "strength": 10,
        "agility": 10,
        "intelligence": 10,
        "endurance": 10,
        "magicFind": 0,

        /* Offensive */
        "damageMin": 1,
        "damageMax": 3,
        "critChance": 0.1,
        "critMultiplier": 5,
        "aps": 5,
        "experience": 0
    };

    //Accessible to the view
    $scope.hero = {
        "name": null,
        "stats": heroBaseStats,
        "inventory": [],
        "equipment": heroItems,
        "questLog": [],
        "inCombat": false,
        "target": null,
        "nextSkill": null
    };









    /*
    ----------------------------------------------------------------------------------------------------
    ----- Player Skills

    ########  ##          ###    ##    ## ######## ########      ######  ##    ## #### ##       ##        ######  
    ##     ## ##         ## ##    ##  ##  ##       ##     ##    ##    ## ##   ##   ##  ##       ##       ##    ##
    ##     ## ##        ##   ##    ####   ##       ##     ##    ##       ##  ##    ##  ##       ##       ##      
    ########  ##       ##     ##    ##    ######   ########      ######  #####     ##  ##       ##        ######  
    ##        ##       #########    ##    ##       ##   ##            ## ##  ##    ##  ##       ##             ##
    ##        ##       ##     ##    ##    ##       ##    ##     ##    ## ##   ##   ##  ##       ##       ##    ##
    ##        ######## ##     ##    ##    ######## ##     ##     ######  ##    ## #### ######## ########  ######

    ----------------------------------------------------------------------------------------------------
    */

    $scope.skills = {

        //NOTE:  Do skills become unlocked PERMANENTLY when the player reaches the required floor, or are the skills ALWAYS locked below the required floor?

        "pierce": {
            "name": "Pierce",
            "description": "Flavour text goes here",
            "unlocksAt": {"floor": 2, "strength": 15, "agility": 10, "intelligence": 5},
            "image": "pierce.png",
            "type": constants.skill.type.ACTIVE,
            "active": false,
            "manaCost": 1,
            clearActive: function() {
                $scope.hero.nextSkill = null; //Future tip:  This could be set to another skill, and used in conjunction with hit() to chain skills
                this.active = false;
            },
            start: function(source) {
                if ($scope.hero.stats.mana >= this.manaCost) {
                    $scope.hero.stats.mana = $scope.hero.stats.mana - this.manaCost;
                    this.clearActive();
                    this.effect(source);
                }
            },
            effect: function(source) {

            },
            end: function(source) {

            }
        },

        "arcaneBarrage": {
            "name": "Arcane Barrage",
            "description": "Flavour text goes here",
            "unlocksAt": {"floor": 1, "strength": 5, "agility": 5, "intelligence": 10},
            "image": "magic2.png",
            "type": constants.skill.type.ACTIVE,
            "active": false,
            "manaCost": 10,
            clearActive: function() {
                $scope.hero.nextSkill = null; //Future tip:  This could be set to another skill, and used in conjunction with hit() to chain skills
                this.active = false;
            },
            start: function(source) {
                if ($scope.hero.stats.mana >= this.manaCost) {
                    $scope.hero.stats.mana = $scope.hero.stats.mana - this.manaCost;
                    this.clearActive();
                    this.effect(source);
                }
            },
            effect: function(source) {
                var damage = 10;
                $scope.hero.target.hit(damage);
            },
            end: function(source) {

            }
        }
    };










    /*
    ----------------------------------------------------------------------------------------------------
    ----- Enemy Abilities

    ######## ##    ## ######## ##     ## ##    ##       ###    ########  #### ##       #### ######## #### ########  ######  
    ##       ###   ## ##       ###   ###  ##  ##       ## ##   ##     ##  ##  ##        ##     ##     ##  ##       ##    ##
    ##       ####  ## ##       #### ####   ####       ##   ##  ##     ##  ##  ##        ##     ##     ##  ##       ##      
    ######   ## ## ## ######   ## ### ##    ##       ##     ## ########   ##  ##        ##     ##     ##  ######    ######  
    ##       ##  #### ##       ##     ##    ##       ######### ##     ##  ##  ##        ##     ##     ##  ##             ##
    ##       ##   ### ##       ##     ##    ##       ##     ## ##     ##  ##  ##        ##     ##     ##  ##       ##    ##
    ######## ##    ## ######## ##     ##    ##       ##     ## ########  #### ######## ####    ##    #### ########  ######  

    ----------------------------------------------------------------------------------------------------
    */

    var abilities = {
        //Give adjacent enemies +50 armour
        "giveArmourLR": {
            "name": "Shielding",
            effect: function(source) {
                id = source.id;
                source = source;

                var position = $scope.enemyBoard.board.indexOf(source);

                armour = {"armour": 50, "armourMax": 50};

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









    /*
    ----------------------------------------------------------------------------------------------------
    ----- Itemization

    #### ######## ######## ##     ## #### ########    ###    ######## ####  #######  ##    ##
     ##     ##    ##       ###   ###  ##       ##    ## ##      ##     ##  ##     ## ###   ##
     ##     ##    ##       #### ####  ##      ##    ##   ##     ##     ##  ##     ## ####  ##
     ##     ##    ######   ## ### ##  ##     ##    ##     ##    ##     ##  ##     ## ## ## ##
     ##     ##    ##       ##     ##  ##    ##     #########    ##     ##  ##     ## ##  ####
     ##     ##    ##       ##     ##  ##   ##      ##     ##    ##     ##  ##     ## ##   ###
    ####    ##    ######## ##     ## #### ######## ##     ##    ##    ####  #######  ##    ##

    ----------------------------------------------------------------------------------------------------
    */

    /*
    Ideas:

    1. An item that removes the mana tick rate, and instead provides a flat rate of - say - 1 mana per second for example
    2. An item that increases the passive (offline) item gain rate / quality / amount
    3. An item that adds inventory space
    4. More gold / trade goods
    5. Skill cooldown
    6. Treasure chest drop chance
    7. Monster / boss life reduction
    8. Chance for 10x gold / item drop
    9. X skill cooldown
    10. X skill duration
    11. Boss timer(s) ?
    12. X skill modification

    */

    /*
    Themes:
    1. Forest
    2. Graveyard
    3. Temple
    4. Desert
    5. Mountains
    6. Jungle
    7. Volcanic
    8. Sky
    9. Arcane
    10. Celestial
    11. Overgrown
    12. Crypt

        Swords: Medium damage, medium attack speed, medium crit, +laceration chance
        Daggers: Low damage, fast attack speed, high crit, +crit chance
        Axes: Medium damage, normal attack speed, high crit, +crit multiplier
        Staves: High damage, slow attack speed, low crit, +chance to bypass armour
        Bows: Medium damage, fast attack speed, high crit, +multistrike chance

        1. Stone Sword
        2. Longsword
        3. Broadsword
        4. Sabre
        5. Ancient Sword
        6. Ornate Sword
        7. Granite Sword
        8. Midnight Sword
        9. Banished Sword
        10. Eternal Sword

        1. Foraging Hatchet
        2. Twin Axe
        3. Ceremonial Axe
        4. War Axe
        5. Tomahawk
        6. Ivory Axe
        7. Tempered Axe
        8. Royal Axe
        9. Void Axe
        10. Auric Axe

        1. Skinning Knife
        2. Bone Knife
        3. Flayed Dagger
        4. Imperial Dagger
        5. Wrapped Dagger
        6. Edge Dagger
        7. Annealed Dagger
        8. Glass Dagger
        9. Soul Dagger
        10. Ethereal Dagger

        1. Wooden Staff
        2. Crypt Staff
        3. Sacred Staff
        4. Assault Staff
        5. Quarterstaff
        6. Gnarled Staff
        7. Encrusted Staff
        8. Highborne Staff
        9. Recondite Staff
        10. Radiant Staff

        1. Cedar Bow
        2. Recurve Bow
        3. Long Bow
        4. Compound Bow
        5. Alpine Bow
        6. Hunting Bow
        7. Ash Bow
        8. Zephyr Bow
        9. Runic Bow
        10. Resplendent Bow

    */




    /* Item Class */
    function Item() {
        //An item is any object that can be placed in a player's inventory, and shows a tooltip when hovered over with the cursor
        this.image = null;
    }

    Item.prototype.setRarity = function(rarity) {
        this.rarity = rarity;
    };

    Item.prototype.setItemName = function(itemName) {
        this.itemName = itemName;
    };

    Item.prototype.getHTMLHeader = function() {
        var itemHTML = "";

        itemHTML += "<div class='item-tooltip'>";
        itemHTML += "<div class='item-header rarity-" + this.rarity +"'>" + this.itemName + "</div>";

        return itemHTML;
    };

    Item.prototype.getHTMLBody = function() {
        return "Temporary";
    };

    Item.prototype.getHTMLFooter = function() {
        return "</div>";
    };

    /* Equipable Class */
    function Equipable() {
        //An equipable is any item that can be placed on a player's hero
        Item.call(this);
        this.affixes = [];
        this.affixDisplayText = [];
    }

    Equipable.prototype = Object.create(Item.prototype);
    Equipable.prototype.constructor = Equipable;
    Equipable.prototype.addAffixes = function(affixes) {
        this.affixes = affixes;
        for (var affix in affixes) {
            this.affixDisplayText.push(affixes[affix].displayText);
        }
    };

    /* Socketable Class */
    function Socketable() {
        //A socketable object can be inserted into any valid equipable that contains an empty socket
        Equipable.call(this); //May need to inherit from Item() instead of Equipable()...
    }

    Socketable.prototype = Object.create(Item.prototype);
    Socketable.prototype.constructor = Socketable;

    /* Weapon Class */
    function Weapon(weaponData) {
        //A weapon is any object that can be used to attack enemies, and can be fitted into a hero's weapon slot
        Equipable.call(this);

        this.image = weaponData.image;
        this.weaponType = "Weapon";
        this.damageMin = weaponData.damageBase[0];
        this.damageMax = weaponData.damageBase[1];
        this.critChance = 0;
        this.aps = weaponData.apsBase;
        this.sockets = 1;
    }

    Weapon.prototype = Object.create(Equipable.prototype);
    Weapon.prototype.constructor = Weapon;

    Weapon.prototype.getHTMLBody = function() {
        var itemHTML = "";

        //itemHTML += "<div class='item-divider'></div>";
        itemHTML += "<div class='item-information'>";
        itemHTML += "Item Type: " + this.weaponType + "<br>";
        itemHTML += "Damage: " + this.damageMin + " to " + this.damageMax + "<br>";
        itemHTML += "Attacks per Second: " + this.aps + "<br>";
        if (this.sockets !== 0) {
            itemHTML += "Sockets: <font color='#ff6600'>" + (this.sockets).toString() + "</font>";
        } else {
            itemHTML += "Sockets: <font color='#ff6600'>None</font>";
        }
        itemHTML += "</div>";

        itemHTML += "<div class='item-divider'></div>";

        itemHTML += "<div class='item-mods'>";
        for (var affix in this.affixDisplayText) {
            itemHTML += this.affixDisplayText[affix] + "<br>";
        }
        itemHTML += "</div>";

        return itemHTML;
    };

    /* Armour Class */
    function Armour(armourData) {
        //Armour is any object that can be fitted into any of a hero's armour slots
        Equipable.call(this);

        this.image = armourData.image;
        this.armourType = "Armour";
        this.armour = 0;
        this.sockets = 1;
    }

    Armour.prototype = Object.create(Equipable.prototype);
    Armour.prototype.constructor = Armour;

    Armour.prototype.getHTMLBody = function() {
        var itemHTML = "";

        //itemHTML += "<div class='item-divider'></div>";
        itemHTML += "<div class='item-information'>";
        itemHTML += "Item Type: " + this.armourType + "<br>";
        itemHTML += "Armour: " + this.armour + "<br>";
        if (this.sockets !== 0) {
            itemHTML += "Sockets: <font color='#ff6600'>" + (this.sockets).toString() + "</font>";
        } else {
            itemHTML += "Sockets: <font color='#ff6600'>None</font>";
        }
        itemHTML += "</div>";

        itemHTML += "<div class='item-divider'></div>";

        itemHTML += "<div class='item-mods'>";
        for (var affix in this.affixDisplayText) {
            itemHTML += this.affixDisplayText[affix] + "<br>";
        }
        itemHTML += "</div>";

        return itemHTML;
    };

    /* Rune Class */
    function Rune() {
        //A rune is a socketable object that can be slotted into a valid equipable that contains a rune slot
        Socketable.call(this);
    }

    Rune.prototype = Object.create(Socketable.prototype);
    Rune.prototype.constructor = Rune;

    /* Quest Item Class */
    function QuestItem() {
        //A quest item is any object that is required for a specific quest
        Item.call(this);
    }

    QuestItem.prototype = Object.create(Item.prototype);
    QuestItem.prototype.constructor = QuestItem;

    /* Trade Good Class */
    function TradeGood() {
        //A trade good is any object that can be used in crafting, or sold to a vendor, but is not an equipable
        Item.call(this);
    }

    TradeGood.prototype = Object.create(Item.prototype);
    TradeGood.prototype.constructor = TradeGood;









    //Item type definitions

    var itemTypes1 = {
        //Weapons
        "sword1": {
            "name": "Stone Sword",
            "type": constants.item.type.weapon.SWORD,
            "class": constants.item.class.WEAPON,
            "image": "sword.png",
            "damageBase": [1, 5],
            "apsBase": 1.2,
            "critBase": 5,
            "implicitMods": [
                {"mod": constants.item.mod.LAC, "amount": 10}
            ]
        },

        "axe1": {
            "name": "Foraging Axe",
            "type": constants.item.type.weapon.AXE,
            "class": constants.item.class.WEAPON,
            "image": "axe.png",
            "damageBase": [1, 3],
            "apsBase": 1.3,
            "critBase": 7,
            "implicitMods": [
                {"mod": constants.item.mod.CM, "amount": 10}
            ]
        },

        "dagger1": {
            "name": "Skinning Knife",
            "type": constants.item.type.weapon.DAGGER,
            "class": constants.item.class.WEAPON,
            "image": "rune2.png",
            "damageBase": [1, 3],
            "apsBase": 1.5,
            "critBase": 7.5,
            "implicitMods": [
                {"mod": constants.item.mod.CC, "amount": 10}
            ]
        },

        "staff1": {
            "name": "Wooden Staff",
            "type": constants.item.type.weapon.STAFF,
            "class": constants.item.class.WEAPON,
            "image": "axe.png",
            "damageBase": [1, 7],
            "apsBase": 1,
            "critBase": 4,
            "implicitMods": [
                {"mod": constants.item.mod.BYA, "amount": 10}
            ]
        },

        "bow1": {
            "name": "Cedar Bow",
            "type": constants.item.type.weapon.BOW,
            "class": constants.item.class.WEAPON,
            "image": "rune1.png",
            "damageBase": [1, 5],
            "apsBase": 1.4,
            "critBase": 6.5,
            "implicitMods": [
                {"mod": constants.item.mod.MS, "amount": 10}
            ]
        },

        //Armour
        "chest1": {"name": "Leather Hide", "class": constants.item.class.ARMOUR, "image": "helm.png"},
        "head1": {"name": "Leather Cap", "class": constants.item.class.ARMOUR, "image": "helm.png"}
    };

    //Treasure Classes

    var treasureClasses = {
        tc1: {
            "level": 1,
            "drops": 1,
            "rarity": {
                "none": 0,
                "list": [
                    ["normal", 50],
                    ["magic", 30],
                    ["rare", 10],
                    ["set", 2],
                    ["mystical", 1]
                ]
            },
            "items": {
                "none": 10,
                "list": [
                    [itemTypes1.sword1, 10],
                    [itemTypes1.dagger1, 10],
                    [itemTypes1.axe1, 10],
                    [itemTypes1.staff1, 10],
                    [itemTypes1.bow1, 10],
                    [itemTypes1.chest1, 7],
                    [itemTypes1.head1, 7]
                ]
            }
        },

        tc2: {
            "level": 1,
            "drops": 1,
            "rarity": {
                "none": 0,
                "list": [
                    ["normal", 50],
                    ["magic", 30],
                    ["rare", 10],
                    ["set", 2],
                    ["mystical", 1]
                ]
            },
            "items": {
                "none": 0,
                "list": [
                    ["tc1", 10],
                    [itemTypes1.sword1, 1],
                ]
            }
        }

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

    var affixes = {
        "prefixes": {
            getWeights: function() {
                var weights = {
                    "none": 0,
                    "list": [
                        [this.affixes.phys_dmg, 10, 1],
                        [this.affixes.crit_chance, 10, 1],
                        [this.affixes.strength, 10, 1],
                        [this.affixes.agility, 10, 1],
                        [this.affixes.intelligence, 10, 1],
                        [this.affixes.all_attributes, 10, 1],
                        [this.affixes.mana_regen, 10, 1],
                        [this.affixes.attack_speed, 10, 1]
                    ]
                };
                return weights;
            },
            "affixes": {
                "phys_dmg": {
                    "dmg1": {"level": 1, get: function() {return new PhysicalDamage(1, [1, 2], [3, 5], "Heavy");}},
                    "dmg2": {"level": 2, get: function() {return new PhysicalDamage(2, [4, 5], [6, 8], "Very Heavy");}}
                },
                "crit_chance": {
                    "cc1": {"level": 1, get: function() {return new CriticalChance(1, [1, 2], "Sharp");}},
                    "cc2": {"level": 2, get: function() {return new CriticalChance(2, [3, 4], "Very Sharp");}}
                },
                "strength": {
                    "str1": {"level": 1, get: function() {return new Strength(1, [1, 2], "Brawler's");}},
                    "str2": {"level": 2, get: function() {return new Strength(2, [3, 4], "Warrior's");}}
                },
                "agility": {
                    "agi1": {"level": 1, get: function() {return new Agility(1, [1, 2], "Tracker's");}},
                    "agi2": {"level": 2, get: function() {return new Agility(2, [3, 4], "Acrobat's");}}
                },
                "intelligence": {
                    "int1": {"level": 1, get: function() {return new Intelligence(1, [1, 2], "Student's");}},
                    "int2": {"level": 2, get: function() {return new Intelligence(2, [3, 4], "Professor's");}}
                },
                "all_attributes": {
                    "all1": {"level": 1, get: function() {return new AllAttributes(1, [1, 3], "Journeyman's");}},
                    "all2": {"level": 2, get: function() {return new AllAttributes(2, [4, 5], "Wanderer's");}}
                },
                "mana_regen": {
                    "mr1": {"level": 1, get: function() {return new ManaRegeneration(1, [1, 3], "Trickling");}},
                    "mr2": {"level": 2, get: function() {return new ManaRegeneration(2, [4, 5], "Flowing");}}
                },
                "attack_speed": {
                    "as1": {"level": 1, get: function() {return new AttackSpeed(1, [1, 5], "Rabbit's");}},
                    "as2": {"level": 2, get: function() {return new AttackSpeed(2, [6, 10], "Cheetah's");}}
                }
            }
        },

        "suffixes": {
            getWeights: function() {
                var weights = {
                    "none": 0,
                    "list": [
                        [this.affixes.crit_multiply, 10, 1],
                        [this.affixes.max_mana, 10, 1],
                        [this.affixes.mana_regen_rate, 10, 1]
                    ]
                };
                return weights;
            },
            "affixes": {
                "crit_multiply": {
                    "cm1": {"level": 1, get: function() {return new CriticalMultiplier(1, [1, 2], "of Fury");}},
                    "cm2": {"level": 2, get: function() {return new CriticalMultiplier(2, [3, 5], "of Whirling Fury");}}
                },
                "max_mana": {
                    "maxmana1": {"level": 1, get: function() {return new MaximumMana(1, [1, 2], "from the Stream");}},
                    "maxmana2": {"level": 2, get: function() {return new MaximumMana(2, [3, 5], "from the River");}}
                },
                "mana_regen_rate": {
                    "mrr1": {"level": 1, get: function() {return new ManaRegenerationRate(1, [1, 2], "of Quickening");}},
                    "mrr2": {"level": 2, get: function() {return new ManaRegenerationRate(2, [3, 5], "of Swiftness");}}
                }
            }
        }
    };

    /* Affix Class */
    function Affix() {
        //An affix is any modifier that can be found on an item
    }

    /* Prefix Class */
    function Prefix() {
        //A prefix is any modifier that can be found on an item
        Affix.call(this);
    }

    Prefix.prototype = Object.create(Affix.prototype);
    Prefix.prototype.constructor = Prefix;

    /* Suffix Class */
    function Suffix() {
        //A suffix is any modifier that can be found on an item
        Affix.call(this);
    }

    Suffix.prototype = Object.create(Affix.prototype);
    Suffix.prototype.constructor = Suffix;

    /* Physical Damage Class */
    function PhysicalDamage(level, min, max, text) {
        //Physical damage is damage which does not have any status effects
        Prefix.call(this);
        this.level = level;
        this.text = text;
        this.min = _.random(min[0], min[1]);
        this.max = _.random(max[0], max[1]);
        this.displayText = this.min + " - " + this.max + " Physical Damage";
    }

    PhysicalDamage.prototype = Object.create(Prefix.prototype);
    PhysicalDamage.prototype.constructor = PhysicalDamage;

    /* Critical Chance Class */
    function CriticalChance(level, amount, text) {
        //Critical chance is the chance to deal an amount of damage which is multiplied by the critical multiplier
        Prefix.call(this);
        this.level = level;
        this.text = text;
        this.amount = _.random(amount[0], amount[1]);
        this.displayText = "+" + this.amount + "% Critical Chance";
    }

    CriticalChance.prototype = Object.create(Prefix.prototype);
    CriticalChance.prototype.constructor = CriticalChance;

    /* Strength Class */
    function Strength(level, amount, text) {
        //Strength is the affix which increases the physical damage done by the hero
        Prefix.call(this);
        this.level = level;
        this.text = text;
        this.amount = _.random(amount[0], amount[1]);
        this.displayText = "+" + this.amount + " Strength";
    }

    Strength.prototype = Object.create(Prefix.prototype);
    Strength.prototype.constructor = Strength;

    /* Agility Class */
    function Agility(level, amount, text) {
        //Agility is the affix which increases the speed at which the hero can attack
        Prefix.call(this);
        this.level = level;
        this.text = text;
        this.amount = _.random(amount[0], amount[1]);
        this.displayText = "+" + this.amount + " Agility";
    }

    Agility.prototype = Object.create(Prefix.prototype);
    Agility.prototype.constructor = Agility;

    /* Intelligence Class */
    function Intelligence(level, amount, text) {
        //Intelligence is the affix which increases the hero's magic damage
        Prefix.call(this);
        this.level = level;
        this.text = text;
        this.amount = _.random(amount[0], amount[1]);
        this.displayText = "+" + this.amount + " Intelligence";
    }

    Intelligence.prototype = Object.create(Prefix.prototype);
    Intelligence.prototype.constructor = Intelligence;

    /* All Attributes Class */
    function AllAttributes(level, amount, text) {
        //All attributes is the affix which increases the hero's strength, agility and intelligence
        Prefix.call(this);
        this.level = level;
        this.text = text;
        this.amount = _.random(amount[0], amount[1]);
        this.displayText = "+" + this.amount + " to All Attributes";
    }

    AllAttributes.prototype = Object.create(Prefix.prototype);
    AllAttributes.prototype.constructor = AllAttributes;

    /* Mana Regeneration Class */
    function ManaRegeneration(level, amount, text) {
        //Mana regeneration is the affix which increases the amount of mana that the hero regenerates
        Prefix.call(this);
        this.level = level;
        this.text = text;
        this.amount = _.random(amount[0], amount[1]);
        this.displayText = "+" + this.amount + " Mana Regeneration";
    }

    ManaRegeneration.prototype = Object.create(Prefix.prototype);
    ManaRegeneration.prototype.constructor = ManaRegeneration;

    /* Attack Speed Class */
    function AttackSpeed(level, amount, text) {
        //Attack speed is the affix which affects how fast a hero can attack
        Prefix.call(this);
        this.level = level;
        this.text = text;
        this.amount = _.random(amount[0], amount[1]);
        this.displayText = "+" + this.amount + "% Faster Attack Speed";
    }

    AttackSpeed.prototype = Object.create(Prefix.prototype);
    AttackSpeed.prototype.constructor = AttackSpeed;



    /* Critical Multiplier Class */
    function CriticalMultiplier(level, amount, text) {
        //Critical multiplier is the multiplier for any damage which is dealt from a critical hit
        Suffix.call(this);
        this.level = level;
        this.text = text;
        this.amount = _.random(amount[0], amount[1]);
        this.displayText = "+" + this.amount + "% Critical Multiplier";
    }

    CriticalMultiplier.prototype = Object.create(Suffix.prototype);
    CriticalMultiplier.prototype.constructor = CriticalMultiplier;

    /* Maximum Mana Class */
    function MaximumMana(level, amount, text) {
        //Maximum mana adds to the hero's total mana pool
        Suffix.call(this);
        this.level = level;
        this.text = text;
        this.amount = _.random(amount[0], amount[1]);
        this.displayText = "+" + this.amount + " to Maximum Mana";
    }

    MaximumMana.prototype = Object.create(Suffix.prototype);
    MaximumMana.prototype.constructor = MaximumMana;

    /* Mana Regeneration Rate Class */
    function ManaRegenerationRate(level, amount, text) {
        //Mana regeneration rate is the affix which decreases the amount of time that it takes for the hero to regenerate mana
        Suffix.call(this);
        this.level = level;
        this.text = text;
        this.amount = _.random(amount[0], amount[1]);
        this.displayText = "+" + this.amount + " Mana Regeneration Rate";
    }

    ManaRegenerationRate.prototype = Object.create(Suffix.prototype);
    ManaRegenerationRate.prototype.constructor = ManaRegenerationRate;

    /*

    Drop Process:

    1. Enemy is defeated, a chest is looted, etc...
    2. Target enemy / chest / etc... has a treasure class associated with it
    3. dropItems(TC, target) is called with the associated TC and target object information (important in case the target is an enemy with a buff that drops
       additional items for example)
    4. dropItems(...) is the manager for which all of the item drop calculations are done - it manages all of the components required to drop items, such as
       the player's MF, target enemy / chest / etc..., current floor, and other factors that affect the drop(s)
    5. dropItems(...) makes a call to the itemGenerator service, which returns an item object
    6. dropItems(...) may inject additional data into the item object
    7. dropItems(...) returns a list of dropped items - OR - dumps them directly into the player's inventory / the floor / etc...

    */

    function dropItems(treasureClass, source) {
        var items = [];

        var drops = treasureClass.drops;
        //var dropSum = weightSum(treasureClass.items);

        //Define the affix getter
        var affixGetter = function() {
            //Choose a suffix or prefix
            var affixSection = _.sample(["prefixes", "suffixes"], 1)[0];

            //Do the pre-filtering
            var floor = gameFloors.currentFloor.index;
            var filteredAffixGroups = preFilterAffixGroups(floor, affixSection);

            //Select an affix group from the filtered affix groups
            var affixGroupSelection = selectFromWeights(filteredAffixGroups);

            //Select an affix from the selected group
            var affix = chooseAffix(floor, affixGroupSelection);

            console.log("FilteredAffixGroups = ", filteredAffixGroups);
            console.log("AffixGroupSelection = ", affixGroupSelection);
            console.log("Affix =", affix);

            return affix.get();

        };

        var getItem = function(tc) {
            var item = selectFromWeights(tc.items);
            if (item === null) {
                return null;
            } else {
                if (typeof item === "string") {
                    item = getItem(treasureClasses[item]);
                }
            }

            return item;
        };

        //Get the base item type, and determine which rarity to upgrade the item to
        for (var i = 1; i <= drops; i++) {
            var item = null;
            var rarity = null;

            //Choose a random base item type to drop
            var newItem = getItem(treasureClass);

            if (newItem !== null) {
                //Figure out which item type to generate, based on the base item type
                switch(newItem.class) {
                    case constants.item.class.WEAPON:
                        item = new Weapon(newItem);
                        break;

                    case constants.item.class.ARMOUR:
                        item = new Armour(newItem);
                        break;
                }

                //Select the rarity
                rarity = selectFromWeights(treasureClass.rarity);
                item.setRarity(rarity);

                //Figure out whether to choose a preset drop (i.e., a mystical or set item), or simply generate random affixes
                if (rarity === constants.item.rarity.SET || rarity === constants.item.rarity.MYSTICAL) {
                    //Find a preset item with the specified item type and rarity - if none exists, then drop a rare item of the same base type (if possible)
                    //TODO: Create a preset-item data set with which to consult
                    //DEBUG for now - the name will either be determined from a preset item, or dynamically based on the affixes that are generated
                    item.setItemName(newItem.name);
                } else {
                    //Set the item affixes
                    //1. Generate a random number which represents the number of affixes to select, based on the item rarity and the current floor level
                    var affixCount = 0;
                    switch(rarity) {
                        case constants.item.rarity.NORMAL:
                            affixCount = 1;
                            break;
                        case constants.item.rarity.MAGIC:
                            affixCount = _.random(1, 2); //TODO: Factor in the floor here
                            break;
                        case constants.item.rarity.RARE:
                            affixCount = _.random(3, 6); //TODO: Factor in the floor here
                            break;
                    }
                    //2. Determine whether or not the affixes will be prefixes or suffixes (or both)
                    //3. Select the affixes which will be used, making sure not to select affixes that belong to the same group more than once (perhaps by selecting the groups first)
                    //4. Affix groups can potentially have different weights, and floor thresholds that only allow the group to be selected after a certain floor
                    //5. The affixes within these groups will work the same way as in step 4
                    var affixes = _.times(affixCount, affixGetter);
                    console.log("Affixes = ", affixes);
                    item.addAffixes(affixes);
                    //DEBUG for now - the name will either be determined from a preset item, or dynamically based on the affixes that are generated
                    var prefix = "";
                    var suffix = "";
                    for (var affix in affixes) {
                        if (affixes[affix] instanceof Prefix) {
                            prefix = affixes[affix].text + " ";
                        } else {
                            suffix = " " + affixes[affix].text;
                        }
                    }
                    item.setItemName(prefix + newItem.name + suffix);

                }

                //item.sockets = 0;
                //item.id = getUniqueID();
                $scope.hero.inventory.push(item);
            } else {
                //No drop
                continue;
            }


            console.log(i, item);




        }

        console.log($scope.hero.inventory);

        //console.log(dropSum);

        return items;
    }

    //Calculate the sum of the weights from a provided data source, as well as a provided noDrop weight
    function weightSum(source) {
        var dropSum = 0;

        for (var drop in source.list) {
            dropSum = dropSum + source.list[drop][1];
        }

        dropSum = dropSum + source.none;

        return dropSum;
    }

    //Provided a source, map each of the weights to a percentage, and then return one of the items based on a randomly generated number between 0 and 1 (0% - 100%)
    function selectFromWeights(source) {
        var data = source.list;
        var weightList = [];
        var sum = 0;
        var randomNumber = Math.random(1);
        //console.log("Random Number = " + randomNumber);

        for (var entry in data) {
            var entryToAdd = [];
            entryToAdd[0] = data[entry][0];
            sum = sum + (data[entry][1] / weightSum(source));
            entryToAdd[1] = sum;
            weightList.push(entryToAdd);
        }

        if (source.none !== 0) {
            sum = sum + (source.none / weightSum(source));
            weightList.push([null, sum]);
        }

        /* 
        DEBUG
        for (var i in weightList) {
            if (weightList[i][0] !== null) {
                console.log(weightList[i][0].name, weightList[i][1]);
            } else {
                console.log(null, weightList[i][1]);
            }
        }
        */

        //Note: The weightList indices need to be in ascending order for this to work correctly
        for (var index in weightList) {
            if (randomNumber <= weightList[index][1]) {
                return weightList[index][0];
            }
        }

        //The function should return before this point
        return undefined;

    }

    //Get only the affix groups that can drop at the current floor or lower
    function preFilterAffixGroups(floor, affixSection) {
        affixWeights = affixes[affixSection].getWeights();

        var returnAffixGroups = {
            "none": affixWeights.none,
            "list": []
        };

        returnAffixGroups.list = _.filter(affixWeights.list, function(entry) {return (entry[2] <= floor);});

        return returnAffixGroups;
    }

    //Select an affix
    function chooseAffix(floor, affixes) {
        returnAffixes = _.filter(affixes, function(entry) {return (entry.level <= floor);});

        affix = returnAffixes[_.random(0, returnAffixes.length - 1)];

        return affix;
    }









    /*
    ----------------------------------------------------------------------------------------------------
    ----- Enemy Setup

    ######## ##    ## ######## ##     ## ##    ##     ######  ######## ######## ##     ## ########  
    ##       ###   ## ##       ###   ###  ##  ##     ##    ## ##          ##    ##     ## ##     ##
    ##       ####  ## ##       #### ####   ####      ##       ##          ##    ##     ## ##     ##
    ######   ## ## ## ######   ## ### ##    ##        ######  ######      ##    ##     ## ########  
    ##       ##  #### ##       ##     ##    ##             ## ##          ##    ##     ## ##        
    ##       ##   ### ##       ##     ##    ##       ##    ## ##          ##    ##     ## ##        
    ######## ##    ## ######## ##     ##    ##        ######  ########    ##     #######  ##

    ----------------------------------------------------------------------------------------------------
    */

    var enemyDefinitions = {
        "boar": {
                    "name": "Wild Boar",
                    "image": "temp.png",
                    "baseHealth": 5,
                    "baseArmour": 0,
                    "baseDamageMin": 5,
                    "baseDamageMax": 10,
                    "baseAPS": 1,
                    "abilities": [],
                    "treasureClass": treasureClasses.tc1
                },
        "wolf": {
                    "name": "Wolf",
                    "image": "temp2.png",
                    "baseHealth": 10,
                    "baseArmour": 0,
                    "baseDamageMin": 10,
                    "baseDamageMax": 15,
                    "baseAPS": 1.5,
                    "abilities": [],
                    "treasureClass": treasureClasses.tc1
                },
        "bear": {
                    "name": "Bear",
                    "image": "temp3.png",
                    "baseHealth": 25,
                    "baseArmour": 0,
                    "baseDamageMin": 15,
                    "baseDamageMax": 20,
                    "baseAPS": 0.8,
                    "abilities": [],
                    "treasureClass": treasureClasses.tc1
        },
        "skeleton": {
                    "name": "Skeleton",
                    "image": "temp3.png",
                    "baseHealth": 10,
                    "baseArmour": 10,
                    "baseDamageMin": 5,
                    "baseDamageMax": 15,
                    "baseAPS": 1,
                    "abilities": [],
                    "treasureClass": treasureClasses.tc1
                },
        "skeletalDefender": {
                    "name": "Skeletal Defender",
                    "image": "temp.png",
                    "baseHealth": 5,
                    "baseArmour": 10,
                    "baseDamageMin": 5,
                    "baseDamageMax": 10,
                    "baseAPS": 1,
                    "abilities": [abilities.giveArmourLR],
                    "treasureClass": treasureClasses.tc1
                },
        "gargoyle": {
                    "name": "Gargoyle",
                    "image": "temp.png",
                    "baseHealth": 30,
                    "baseArmour": 0,
                    "baseDamageMin": 5,
                    "baseDamageMax": 10,
                    "baseAPS": 1,
                    "abilities": [],
                    "treasureClass": treasureClasses.tc1
                }
    };

    //Maybe re-purpose this to define spawn groups?
    var levelEnemies = [
        {"enemyPool": [null]},
        {"enemyPool": [enemyDefinitions.boar, enemyDefinitions.wolf, enemyDefinitions.skeleton, enemyDefinitions.skeletalDefender]}
    ];

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
            if (this.board.length === 0) {
                //DEBUG - Temporary
                gameFloors.nextFloor();
            }
        },
        deactivate: function() {
            for (var enemy in this.board) {
                this.board[enemy].active = false;
            }
        }
    };

    //Spawn an enemy
    function spawnEnemy(enemyType) {
        var currentLevel = 1; //TODO: Change this to use the current level
        var enemyChoices = levelEnemies[currentLevel].enemyPool;
        var enemy = enemyType;//enemyChoices[Math.floor(Math.random() * enemyChoices.length)];
        //console.log(enemy);
        var newEnemy = {
                            "enemy": enemy,
                            "id": null,
                            "active": false,
                            "healthList": {},
                            "health": enemy.baseHealth,
                            "healthMax": enemy.baseHealth,
                            "healthMultipliers": {"self": {"amount": 1}},
                            "armourList": {},
                            "armour": enemy.baseArmour,
                            "armourMax": enemy.baseArmour,
                            "armourMultipliers": {"self": {"amount": 1}},
                            "mods": [],
                            "abilities": enemy.abilities,
                            getHealth: function() {
                                return getStatCurrentMax("health", "healthMax", this.health, this.healthMax, this.healthList);
                            },
                            getArmour: function() {
                                return getStatCurrentMax("armour", "armourMax", this.armour, this.armourMax, this.armourList);
                            },
                            create: function() {
                                this.id = getUniqueID();

                                for (var a in this.abilities) {
                                    this.abilities[a].start(this);
                                }
                            },
                            hit: function(setDamage) {
                                //First, use any skills that might be queued by the player
                                if ($scope.hero.nextSkill !== null) {
                                    if ($scope.hero.stats.mana >= $scope.hero.nextSkill.manaCost) {
                                        $scope.hero.nextSkill.start(this);
                                        return null;
                                    }
                                }

                                var damage = 0;

                                if (setDamage === null) {
                                    damage = Math.random() * (heroBaseStats.damageMax - heroBaseStats.damageMin) + heroBaseStats.damageMin;
                                    damage = Math.round(damage * damageMultiplier(heroBaseStats.critChance, heroBaseStats.critMultiplier));
                                } else {
                                    //Do we need to check for critical hits here?
                                    damage = setDamage;
                                }
                                
                                //Check to see if the damage exceeds the remaining base armour
                                if ((this.armour - damage) >= 1) {
                                    this.armour = this.armour - damage;
                                } else {
                                    if (this.armourMax > 0) {
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
                                    if (this.armourMax > 0) {
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
                                //TODO - Check to see if the player is using a skill here
                                $scope.enemyBoard.deactivate();
                                this.active = true;
                                $scope.hero.inCombat = true;
                                $scope.hero.target = this;
                            }
                        };
        $scope.enemyBoard.board.push(newEnemy);
        newEnemy.create();
        $scope.enemyBoard.update();

    }










    /*
    ----------------------------------------------------------------------------------------------------
    ----- Quest Setup

     #######  ##     ## ########  ######  ########     ######  ######## ######## ##     ## ########  
    ##     ## ##     ## ##       ##    ##    ##       ##    ## ##          ##    ##     ## ##     ##
    ##     ## ##     ## ##       ##          ##       ##       ##          ##    ##     ## ##     ##
    ##     ## ##     ## ######    ######     ##        ######  ######      ##    ##     ## ########  
    ##  ## ## ##     ## ##             ##    ##             ## ##          ##    ##     ## ##        
    ##    ##  ##     ## ##       ##    ##    ##       ##    ## ##          ##    ##     ## ##        
     ##### ##  #######  ########  ######     ##        ######  ########    ##     #######  ##    

    ----------------------------------------------------------------------------------------------------
    */

    //Define the quests
    var quests = {
        "level1": {
            "boar1": {
                        "name": "Boars Boars Boars!",
                        "description": "The boars are invading! Defeat as many as possible!",
                        "objectives": [
                                        {"type": constants.quest.type.DEFEAT, "target": enemyDefinitions.boar, "amount": 10, "currentAmount": 0, "status": constants.quest.status.INCOMPLETE}
                                    ],
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

    //Update the quest log objectives
    function updateQuestObjectives(type, data) {

        _.each($scope.hero.questLog, function(quest) {
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

            //Check to see if the quest has been completed
            checkQuestCompletion(quest);

        });
    }

    //Check to see if the provided quest can be completed
    function checkQuestCompletion(quest) {
        searchResult = _.findWhere(quest.objectives, {"status": constants.quest.status.INCOMPLETE});

        if (searchResult === undefined) {
            quest.status = constants.quest.status.COMPLETE;
        }
    }

    //Complete a quest
    function completeQuest(quest) {
        //TODO - give the rewards to the player
        $scope.hero.questLog = _.without($scope.hero.questLog, _.findWhere($scope.hero.questLog, quest));
    }










    /*
    ----------------------------------------------------------------------------------------------------
    ----- Game Setup

     ######      ###    ##     ## ########     ######  ######## ######## ##     ## ########  
    ##    ##    ## ##   ###   ### ##          ##    ## ##          ##    ##     ## ##     ##
    ##         ##   ##  #### #### ##          ##       ##          ##    ##     ## ##     ##
    ##   #### ##     ## ## ### ## ######       ######  ######      ##    ##     ## ########  
    ##    ##  ######### ##     ## ##                ## ##          ##    ##     ## ##        
    ##    ##  ##     ## ##     ## ##          ##    ## ##          ##    ##     ## ##        
     ######   ##     ## ##     ## ########     ######  ########    ##     #######  ##        

    ----------------------------------------------------------------------------------------------------
    */

    /*
    DEBUG
    $scope.a = itemGenerator.test();
    $scope.b = itemGenerator.test();
    $scope.b.type = "head";
    console.log($scope.a);
    console.log($scope.b);
    $scope.test = [$scope.a, $scope.b];
    */

    $scope.timerPerformance = 0;
    $scope.timerArray = [];
    $scope.getAverageTimerPerformance = function() {
        var sum = 0;
        for (var i in $scope.timerArray) {
            sum = sum + $scope.timerArray[i];
        }
        return Math.round(sum / 100);
    };

    //Game variables
    var game = {
        "actionTimerCount": 0,
        "state": constants.game.state.START
    };

    //Defines the floor generator which contains everything that belongs on that floor
    function newFloor(index, name, status, enemies, quests) {
        var floor = {
            "index": index,
            "name": name,
            "status": status,
            begin: function() {
                //Setup
                //Spawn enemies
                for (var enemy in enemies) {
                    spawnEnemy(enemies[enemy]);
                }
                //Give quests
                for (var quest in quests) {
                    $scope.hero.questLog.push(quests[quest]);
                }
                //Random encounters / events
            },
            end: function() {
                //Tear-down
            },
            "enemies": enemies
        };

        return floor;
    }

    var gameFloors = {
        //Define the list of floors in the game - might want to pull this in from an external data source at some point
        "floorList": [
            newFloor(1, "Tower Entrance", constants.floor.status.PRESTART, [enemyDefinitions.boar], [quests.level1.boar1]),
            newFloor(2, "Floor 2", constants.floor.status.PRESTART, [enemyDefinitions.boar, enemyDefinitions.bear, enemyDefinitions.boar], []),
            newFloor(3, "Floor 3", constants.floor.status.PRESTART, [enemyDefinitions.skeleton, enemyDefinitions.skeletalDefender, enemyDefinitions.skeleton], [quests.level1.skeleton1])
        ],

        //The current floor - a complete floor object
        "currentFloor": newFloor(0, "NULL", constants.floor.status.PRESTART, [], []),

        //Go to the next floor
        nextFloor: function() {
            targetFloor = _.findWhere(this.floorList, {index: this.currentFloor.index + 1});
            if (targetFloor !== undefined) {
                this.currentFloor = targetFloor;
                this.currentFloor.begin();
            } else {
                console.log("ERROR: Unable to move to the next floor");
            }
        },

        //Go to the previous floor
        previousFloor: function() {
            targetFloor = _.findWhere(this.floorList, {index: this.currentFloor.index - 1});
            if (targetFloor !== undefined) {
                this.currentFloor = targetFloor;
                this.currentFloor.begin();
            } else {
                console.log("ERROR: Unable to move to the previous floor");
            }
        },

        //Go to the floor specified by targetIndex
        gotoFloor: function(targetIndex) {
            targetFloor = _.findWhere(gameFloors.floorList, {index: targetIndex});
            if (targetFloor !== undefined) {
                this.currentFloor = targetFloor;
            } else {
                console.log("ERROR: Unable to move to the floor indexed by: " + targetIndex);
            }
        }
    };

    //This object contains several counters for various stat 'payouts' that will occur on the 1 second timer
    var timerCounters = {
        "manaPerTick": 0
    };

    //Performance metric
    var scheduled = new Date().getTime() + 10;
    var timerArrayCount = 0;

    //This timer is used for any action that needs to occur on a 1 second timer
    $scope.oneSecondTimer = function() {
        $timeout(function() {
            $scope.increment(1);
            $scope.checkUnlocks();
            $scope.oneSecondTimer();

            //$scope.timerPerformance = new Date().getTime() - scheduled;

            //Increment all timer counter variables
            for (var stat in timerCounters) {
                timerCounters[stat] = timerCounters[stat] + 1;
            }

            //Mana per second
            if (timerCounters.manaPerTick >= $scope.hero.stats.manaTickRate) {
                timerCounters.manaPerTick = 0;
                if ($scope.hero.stats.mana < $scope.hero.stats.manaMax) {
                    if (($scope.hero.stats.mana + $scope.hero.stats.manaPerTick) < $scope.hero.stats.manaMax) {
                        $scope.hero.stats.mana = $scope.hero.stats.mana + $scope.hero.stats.manaPerTick;
                    } else {
                        $scope.hero.stats.mana = $scope.hero.stats.manaMax;
                    }
                }
            }
            //scheduled = new Date().getTime() + 1000;
        }, 1000);
    };

    //This timer is used to increment the action progress bar, and ties in with the hero's APS
    $scope.actionTimer = function() {
        $timeout(function() {
            if (timerArrayCount > 99) {
                timerArrayCount = 0;
            }
            $scope.timerArray[timerArrayCount] = new Date().getTime() - scheduled;
            timerArrayCount = timerArrayCount + 1;

            if ($scope.hero.inCombat === true) {
                game.actionTimerCount += 10;

                if (game.actionTimerCount >= getAttackTime()) {
                    $scope.hero.target.hit(null);
                    game.actionTimerCount = 0;
                }

            }
            scheduled = new Date().getTime() + 10;
            $scope.actionTimer();
        }, 10);
    };

    //Start
    $scope.oneSecondTimer();
    $scope.actionTimer();
    //spawnEnemy();
    //spawnEnemy();
    //spawnEnemy();









    /*
    ----------------------------------------------------------------------------------------------------
    ----- Helper Functions

    ##     ## ######## ##       ########  ######## ########     ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######  
    ##     ## ##       ##       ##     ## ##       ##     ##    ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ##
    ##     ## ##       ##       ##     ## ##       ##     ##    ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##      
    ######### ######   ##       ########  ######   ########     ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######  
    ##     ## ##       ##       ##        ##       ##   ##      ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ##
    ##     ## ##       ##       ##        ##       ##    ##     ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ##
    ##     ## ######## ######## ##        ######## ##     ##    ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######  

    ----------------------------------------------------------------------------------------------------
    */

    //Returns an object containing the current value of a stat, and its maximum possible value
    function getStatCurrentMax(statName, statMaxName, stat, statMax, statList) {
        statReturn = {};
        countCurrent = stat;
        countMax = statMax;

        for (var s in statList) {
            countCurrent = countCurrent + statList[s][statName];
            countMax = countMax + statList[s][statMaxName];
        }

        statReturn[statName] = countCurrent;
        statReturn[statMaxName] = countMax;
        return statReturn;

    }

    //Returns the number of seconds required to make one attack, given the hero's attacks per second
    function getAttackTime() {
        //TODO: Make this generic - pass in the APS as an argument
        return Math.round((1 / heroBaseStats.aps) * 1000);
    }

    //Returns true if there is an enemy at the specified position and false otherwise
    function enemyAt(position) {
        if (position < 0) {
            return false;
        }

        if (position > ($scope.enemyBoard.board.length - 1)) {
            return false;
        }

        return true;
    }

    //Returns a damage multiplier based on the critical hit chance
    function damageMultiplier(critChance, critMultiplier) {
        var roll = Math.random();
        if (roll <= critChance) {
            return critMultiplier;
        } else {
            return 1;
        }
    }

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
    function getUniqueID() {
        var id = new Date().valueOf();
        return id + "." + incrementID.increment();
    }

    //These helpers can be used to support various view requirements
    $scope.viewHelpers = {

        //Get the action bar percentage
        getActionBarPercent: function() {
            return Math.ceil((game.actionTimerCount / getAttackTime()) * 100);
        },

        //Allow the view helper to access the constants
        "constants": constants,

        //Complete a quest
        completeQuest: function(quest) {
            completeQuest(quest);
        },

        //Get the game state
        getGameState: function() {
            return game.state;
        },

        //Set the game state
        setGameState: function(state) {
            if ($scope.hero.name !== null) {
                game.state = state;
            }
        },

        //Verify that the player name is valid
        verifyPlayerName: function(name) {
            if (name.length > 0) {
                $scope.hero.name = name;
                this.setGameState(constants.game.state.PLAY);
                gameFloors.gotoFloor(1);
                gameFloors.currentFloor.begin();
            }
        },

        //Get the current floor name
        getFloorName: function() {
            if (gameFloors.currentFloor !== null) {
                return gameFloors.currentFloor.name;
            } else {
                return "null";
            }
        },

        //Return true if the specified skill can be used, and false otherwise
        checkSkillUnlock: function(skill) {
            if (skill.unlocksAt.floor > gameFloors.currentFloor.index) {
                return false;
            }

            if (skill.unlocksAt.strength > $scope.hero.stats.strength) {
                return false;
            }

            if (skill.unlocksAt.agility > $scope.hero.stats.agility) {
                return false;
            }

            if (skill.unlocksAt.intelligence > $scope.hero.stats.intelligence) {
                return false;
            }

            return true;
        },

        skillToggle: function(skill) {
            if (skill.active === true) {
                skill.active = false;
                $scope.hero.nextSkill = null;
            } else {
                for (var s in $scope.skills) {
                    $scope.skills[s].active = false;
                }
                skill.active = true;
                $scope.hero.nextSkill = skill;
            }
        },

        //Get the mana bar percentage
        getManaBarPercent: function() {
            return Math.ceil(($scope.hero.stats.mana / $scope.hero.stats.manaMax) * 100);
        },

    };

    //These helpers can be used to support various tooltip requirements
    $scope.tooltipHelpers = {
        getFloorHTML: function(requiredFloor) {
            if (requiredFloor <= gameFloors.currentFloor.index) {
                return "<font color='" + constants.html.colour.GREEN + "'>Requires Floor " + requiredFloor + "</font>";
            } else {
                return "<font color='" + constants.html.colour.RED + "'> Requires Floor " + requiredFloor + "</font>";
            }
        },

        getStatHTML: function(stat, requiredStat) {
            if (requiredStat <= $scope.hero.stats[stat]) {
                return "<font color='" + constants.html.colour.GREEN + "'>" + requiredStat + "</font>";
            } else {
                return "<font color='" + constants.html.colour.RED + "'>" + requiredStat + "</font>";
            }
        },

        swapItems: function(sourceSlot, targetSlot) {

            console.log(sourceSlot, targetSlot);
            var temp = this.itemTarget;
            console.log("SOURCE = ", temp);
            switch(targetSlot) {
                case "head":
                    if (sourceSlot === "inventory") {
                        var itemIndex = _.indexOf($scope.hero.inventory, this.itemSource);

                        this.unequipItem("head");
                        this.equipItem(this.itemSource, "head"); //TODO: Verify the type first!
                        $scope.hero.inventory[itemIndex] = temp;
                        console.log(temp);
                    }
                    break;

                case "inventory":
                    if (sourceSlot === "inventory") {
                        var itemIndexSource = _.indexOf($scope.hero.inventory, this.itemSource);
                        var itemIndexTarget = _.indexOf($scope.hero.inventory, this.itemTarget);

                        $scope.hero.inventory[itemIndexTarget] = this.itemSource;
                        $scope.hero.inventory[itemIndexSource] = temp;
                        console.log(temp);
                    }
                    break;
            }
        },

        "itemSource": null,

        "itemTarget": null,

        setItemSource: function(source) {
            this.itemSource = source;
        },

        setItemTarget: function(target) {
            this.itemTarget = target;
        },

        unequipItem: function(type) {
            //TODO
        },

        equipItem: function(item, slot) {
            //TODO
            $scope.hero.equipment[slot] = item;
        }
    };










    /*
    ----------------------------------------------------------------------------------------------------
    ----- Temporary Code

    ######## ######## ##     ## ########   #######  ########     ###    ########  ##    ##     ######   #######  ########  ########
       ##    ##       ###   ### ##     ## ##     ## ##     ##   ## ##   ##     ##  ##  ##     ##    ## ##     ## ##     ## ##      
       ##    ##       #### #### ##     ## ##     ## ##     ##  ##   ##  ##     ##   ####      ##       ##     ## ##     ## ##      
       ##    ######   ## ### ## ########  ##     ## ########  ##     ## ########     ##       ##       ##     ## ##     ## ######  
       ##    ##       ##     ## ##        ##     ## ##   ##   ######### ##   ##      ##       ##       ##     ## ##     ## ##      
       ##    ##       ##     ## ##        ##     ## ##    ##  ##     ## ##    ##     ##       ##    ## ##     ## ##     ## ##      
       ##    ######## ##     ## ##         #######  ##     ## ##     ## ##     ##    ##        ######   #######  ########  ########

    ----------------------------------------------------------------------------------------------------
    */

    //DEBUG
    $scope.viewHelpers.verifyPlayerName("Jeff");

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
        dropItems(treasureClasses.tc1, "");

        var enemyChoices = levelEnemies[1].enemyPool;
        var enemy = enemyChoices[Math.floor(Math.random() * enemyChoices.length)];
        spawnEnemy(enemy);
        //$scope.heroItems.head = $scope.heroItems.chest;
        //$scope.swapItems($scope.heroItems.head, $scope.heroItems.amulet);
    };

    $scope.buttonClick2 = function() {
        $scope.increment(1);
        $scope.checkUnlocks();
        dropItems(treasureClasses.tc1, "");

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

    //Remove classes?
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
            "baseAPS": 10,
            "skills": []
        }
    };

    var mods = {
        armourMod: function(source, amount) {
            //Does the mod's functionality go here, or should the mods object only contain codes or something?
            
        }
    };
}]);
