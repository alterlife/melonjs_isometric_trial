game.PlayerEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings);
        this.setVelocity(3,3);
        this.updateColRect(47, 30, 85, 22);
        this.loadAnimations(100, 50, 100);
        this.currentdirection = this.newdirection = 's';
        this.currentstate = this.newstate = 'walk';
        this.speed = 1.5;
        this.renderable.setCurrentAnimation(this.currentstate + this.currentdirection);

        me.input.bindKey(me.input.KEY.M, "m");
        me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.M);
    },

    intToDirection: function(directionInteger) {
        var directionString = ["w", "nw", "n", "ne", "e", "se", "s", "sw"];
        return directionString[directionInteger];
    },

    loadAnimations: function(walkdelay, rundelay, attackdelay) {
        for(i = 0; i < 8; i++) {
            baseIndex = i * 24;
            this.renderable.addAnimation("idle" + this.intToDirection(i), [baseIndex + 0, baseIndex + 1, baseIndex + 2, baseIndex + 3, baseIndex + 3, baseIndex + 3, baseIndex + 2, baseIndex + 1, baseIndex + 0, baseIndex + 0, baseIndex + 0], 100);
            this.renderable.addAnimation("run" + this.intToDirection(i), [baseIndex + 4,baseIndex + 5,baseIndex + 6,baseIndex + 7,baseIndex + 8,baseIndex + 9,baseIndex + 10,baseIndex + 11], rundelay);
            this.renderable.addAnimation("walk" + this.intToDirection(i), [baseIndex + 4,baseIndex + 5,baseIndex + 6,baseIndex + 7,baseIndex + 8,baseIndex + 9,baseIndex + 10,baseIndex + 11], walkdelay);
            this.renderable.addAnimation("attack" + this.intToDirection(i), [baseIndex + 12,baseIndex + 13,baseIndex + 14,baseIndex + 15,baseIndex + 16,baseIndex + 17], attackdelay);
            this.renderable.addAnimation("die" + this.intToDirection(i), [baseIndex + 18,baseIndex + 19,baseIndex + 20,baseIndex + 21,baseIndex + 22,baseIndex + 23], 50);
            this.renderable.addAnimation("hit" + this.intToDirection(i), [baseIndex + 18,baseIndex + 19,baseIndex + 20,baseIndex + 19,baseIndex + 18], 50);
            this.renderable.addAnimation("dead" + this.intToDirection(i), [baseIndex + 23], 5000);
        }
    },
    updateDirection: function() {
        var dx = this.pos.x - me.input.mouse.pos.x + 47;
        var dy = this.pos.y - me.input.mouse.pos.y + 95;
        var max = Math.max(Math.abs(dx), Math.abs(dy));
        dx = dx / max;
        dy = dy / max;

        if(dy == 1 && dx > -.5 && dx < .5) newdirection = 'n';
        else if(dy == -1 && dx > -.5 && dx < .5) newdirection = 's';
        else if(dx == 1 && dy > -.5 && dy < .5) newdirection = 'w';
        else if(dx == -1 && dy > -.5 && dy < .5) newdirection = 'e';
        else if((dx == -1 && dy <= -.5) || (dy == -1 && dx <= -.5)) newdirection = 'se';
        else if((dx >= .5 && dy == -1) || (dx == 1 && dy <= -.5)) newdirection = 'sw';
        else if((dx == -1 && dy >= .5) || (dy == 1 && dx <= -.5) ) newdirection = 'ne'
        else newdirection = 'nw';

        this.newdirection = newdirection;
    },

    doMove: function() {

        movey = {n: -1, nw: -.707, w: 0,sw:.707 ,s:1 ,se:.707 , e:0,ne:-.707};
        movex = {n: 0, nw: -.707, w: -1,sw:-.707 ,s:0 ,se:.707 , e:1,ne: .707};
        this.pos.y += movey[this.currentdirection] * this.speed;
        this.pos.x += movex[this.currentdirection] * this.speed;
    },
    updateAnimation: function() {
        currentcall = new Date;

        if((!this.lastUpdateAnimation || currentcall - this.lastUpdateAnimation  > 200) && (this.currentdirection != this.newdirection || this.currentstate != this.newstate)) {
            this.lastUpdateAnimation = currentcall;
            this.currentdirection = this.newdirection;
            this.currentstate = this.newstate;
            this.renderable.setCurrentAnimation(this.currentstate + this.currentdirection);
        }
    },
    update: function() {
        if (me.input.isKeyPressed('m')) { /* A mouse event occoured */
            this.updateDirection();
            if(this.currentstate == 'idle') {
                this.newstate = 'walk';
            }
            this.updateAnimation();
            this.doMove();
        } else {
            this.newstate = 'idle';
            this.updateAnimation();
        }
        this.updateMovement();

        this.parent(); /* Advance the frame */
        return false;
    }
});



