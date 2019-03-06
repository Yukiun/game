class GameImage {
    constructor(o) {
        let image = this.imageFromPath(o.path)
        this.image = image
        this.x = o.x
        this.y = o.y
        this.width = o.width
        this.height = o.height
    }

    imageFromPath (path) {
        var img = new Image()
        img.src = path
        return img
    }

    changePath(path) {
        this.image = this.imageFromPath(path)
    }
}

class RedPackets extends GameImage{
    constructor(o, speed){
        super(o)
        this.speed = speed
        this.clicked = false
    }

    fall() {
        if(!this.clicked) {
            this.y += this.speed
        }
    }

}

class CanvasGame {
    //constructor
    constructor(width, height) {
        let self = this
        self.canvas = document.querySelector("#canvas")
        self.ctx = this.canvas.getContext('2d')
        self.canvas.width = width
        self.canvas.height = height
        //background
        let background = {
            "path" : './img/homePage.png',
            "x" : 0,
            "y" : 0,
            "speed" : 0,
            "width" : width,
            "height" : height,
        }
        let bg = new GameImage(background)
        self.images = {
            bg: bg,
        }
        self.num = 0
        self.score = 0
        self.p = false
        self.actions = {}
        self.keydowns = {}
        window.addEventListener('keydown', function(event) {
            game.keydowns[event.key] = true
        })
        window.addEventListener('keyup', function(event){
            game.keydowns[event.key] = false
        })
    }
    registerAction(key, callback) {
        let self = this
        self.actions[key] = callback
    }

    animate() {
        let self = this
        setInterval(()=>{
            var actions = Object.keys(self.actions)
            for (var i = 0; i < actions.length; i++) {
                var key = actions[i]
                if(self.keydowns[key]) {
                    // 如果按键被按下, 调用注册的 action
                    self.actions[key]()
                }
            }
            self.update()
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
            self.draw(this.images)
        }, 1000/60)
    }

    update() {
        for (var x in this.images) {
            if (this.images.hasOwnProperty(x)) {
                if(x !== "bg"){
                    if( this.p == false){
                        this.images[x].fall()
                    }
                }
            }
        }
    }

    drawImage(image) {
        this.ctx.drawImage(image.image, image.x, image.y, image.width, image.height)
    }

    draw(images) {
        let self = this
        let keys = Object.keys(images)
        for (let i = 0; i<keys.length; i++){
            let key = keys[i]
            let image = images[key]
            if (self.canvas.height - image.y - 100 > 0 && !image.clicked ) {//100是红包基础高度
                self.drawImage(image)
            }else {
                delete  images[key]
            }

        }
    }

    setTimer(t) {
        /*
        setTimer(t)
        t秒 0.01级倒计时
        */
        let ms = 1000
        let time = ms * t
        let level = 10
        let self = this
        let intv = setInterval(function() {
            if (time === 10){
                clearInterval(intv)
            }
            if (Math.floor(time/100) == time/100){
                self.drawRedpackets()
            }
            /*10毫秒*/
            time -= level
            var timeStr = '' + Math.floor(time / ms) + ':' + ((time - Math.floor(time / ms) * ms) / 10) + 's' //除以保留两位
            let date = document.querySelector('.date')
            date.innerHTML = timeStr

        }, level)

    }


}

var __main = function() {
    var width = window.innerWidth
    var height = window.innerHeight

    game = new CanvasGame(width, height)
    game.animate()

    var start = function(t) {
        let btn = document.querySelector('.btn')
        btn.addEventListener('click', (event) => {
            game.images['bg'].changePath('./img/15s.png')
            btn.style = "display:none"
            setTime3s(t)
        })
    }

    var setTime3s = function(t) {
        let time = 3
        let s = setInterval(function() {
            if(time == 0){
                clearInterval(s)
            }
            console.log(time)
            time -= 1
        },  1000)
        setTimeout(()=>{
            console.log('GO!')
            setTimer(t)
            drawRedpackets()
        }, 3000)
    }

    var setTimer = function(t) {
        /*
        setTimer(t)
        t秒 0.01级倒计时
        */
        let ms = 1000
        let time = ms * t
        let level = 10
        let self = this
        let intv = setInterval(function() {
            if (time === 10){
                clearInterval(intv)
            }
            if (Math.floor(time/100) == time/100){
                drawRedpackets()
            }
            /*10毫秒*/
            time -= level
            var timeStr = '' + Math.floor(time / ms) + ':' + ((time - Math.floor(time / ms) * ms) / 10) + 's' //除以保留两位
            let date = document.querySelector('.date')
            date.innerHTML = timeStr

        }, level)

    }

    var drawRedpackets = function() {
        let self = this
        let minWidth = 50
        let l = Math.floor(Math.random() * minWidth) + minWidth
        let img = new Image()
        let path = "./img/redpackets.png"
        img.src = path

        let ratio = img.width/img.height
        let keys = Object.keys(game.images)
        /*images中多一个bg参数，所以长度+1*/
        let id = keys.length
        let name = 'redpackets-' + id

        if (!game.images[name]) {
            game.images[name] = new RedPackets(
                {
                    "path" : path,
                    "x" : Math.random() * (game.canvas.width - l),
                    "y" : 100,
                    "width" : l,
                    "height" : l / ratio,
                },
                10 /*speed*/
            )
            game.num++
            console.log(game.num);
        }
    }

    game.canvas.addEventListener("click", function(event) {
        let x = event.offsetX
        let y = event.offsetY
        let keys = Object.keys(game.images)
        for (var i = 0; i < keys.length; i++) {
            if(keys[i] !== 'bg'){
                let img = game.images
                let imgX = img[keys[i]].x
                let imgY = img[keys[i]].y
                let imgW = img[keys[i]].width
                let imgH = img[keys[i]].height

                if( imgX <= x &&
                    x<= (imgX + imgW) &&
                    imgY <= y &&
                    y <= (imgY + imgH)) {
                        img[keys[i]].clicked = true
                        game.score++
                        console.log("score:", game.score)
                    }
            }
        }
    })

    game.registerAction('p', function() {
        game.p = !game.p
    })
    start(15)

}

__main()
