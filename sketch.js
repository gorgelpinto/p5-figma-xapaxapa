let layers = []
let images = {}

let externalControls = {

x1:{ // folhas verdes
enabled:true,
rotation:0,
spacing:360,
size:720,
transparency:255,
x:0,
y:40
},

x2:{ // dominós
enabled:true,
rotation:-20,
spacing:420,
size:900,
transparency:230,
x:-60,
y:80
},

x3:{ // gotas castanhas
enabled:true,
rotation:0,
spacing:140,
size:220,
transparency:255,
x:0,
y:0
}

}

let order = ["x1","x2","x3"]

function preload(){

images["x1"] = loadImage("img1.png")
images["x2"] = loadImage("img2.png")
images["x3"] = loadImage("img3.png")

}

function setup(){

const container = document.getElementById("sketch-container")

const canvas = createCanvas(
container.offsetWidth,
container.offsetHeight
)

canvas.parent("sketch-container")

layers.push(new Layer("x1"))
layers.push(new Layer("x2"))
layers.push(new Layer("x3"))

noLoop()

setTimeout(sendInitialState,300)

}

function draw(){

background(255)

order.forEach(key=>{

const layer = layers.find(l => l.key === key)

if(!layer) return

layer.update()
layer.display()

})

}

function windowResized(){

const container = document.getElementById("sketch-container")

resizeCanvas(
container.offsetWidth,
container.offsetHeight
)

redraw()

}

function sendInitialState(){

window.parent.postMessage({
type:"initialState",
controls:externalControls
},"*")

}

window.addEventListener("message",(event)=>{

const data = event.data

if(data.type==="updateXapa"){

externalControls[data.xapa] = {
...externalControls[data.xapa],
...data.values
}

redraw()

}

if(data.type==="updateOrder"){

order = data.order
redraw()

}

if(data.type==="uploadImage"){

loadImage(data.data,img=>{
images[data.xapa]=img
redraw()
})

}

if(data.type==="exportPNG"){

exportPNG(data.size)

}

})

function exportPNG(size){

const buffer = createGraphics(size,size)

buffer.pixelDensity(1)
buffer.background(255)

/* número fixo de repetições */
const GRID = 12   // metade do padrão ampliado

order.forEach(key=>{

const c = externalControls[key]
const img = images[key]

if(!c.enabled || !img) return

const rotation = radians(c.rotation)

/* escala proporcional ao tamanho do ficheiro */
const scaleFactor = size / width

const spacing = c.spacing * scaleFactor
const sizeImg = c.size * scaleFactor
const offsetX = c.x * scaleFactor
const offsetY = c.y * scaleFactor

buffer.imageMode(CENTER)

for(let ix=-GRID; ix<=GRID; ix++){
for(let iy=-GRID; iy<=GRID; iy++){

buffer.push()

buffer.translate(
ix * spacing + offsetX + size/2,
iy * spacing + offsetY + size/2
)

buffer.rotate(rotation)

buffer.tint(255,c.transparency)

buffer.image(
img,
0,
0,
sizeImg,
sizeImg
)

buffer.pop()

}
}

})

save(buffer,"xapa.png")

}

class Layer{

constructor(key){
this.key = key
}

update(){

const c = externalControls[this.key]

this.enabled = c.enabled
this.rotation = radians(c.rotation)
this.spacing = c.spacing
this.size = c.size
this.transparency = c.transparency
this.offsetX = c.x
this.offsetY = c.y

this.image = images[this.key]

}

display(){

if(!this.enabled || !this.image) return

const buffer = this.spacing*2

for(let x=-buffer;x<width+buffer;x+=this.spacing){
for(let y=-buffer;y<height+buffer;y+=this.spacing){

push()

translate(
x + this.offsetX,
y + this.offsetY
)

rotate(this.rotation)

tint(255,this.transparency)

imageMode(CENTER)

image(
this.image,
0,
0,
this.size,
this.size
)

pop()

}
}

}

}
