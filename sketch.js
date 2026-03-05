let layers = []
let images = {}

let externalControls = {

x1:{
enabled:true,
rotation:-20,
spacing:450,
size:1000,
transparency:225,
x:-80,
y:75
},

x2:{
enabled:true,
rotation:-30,
spacing:600,
size:850,
transparency:250,
x:40,
y:150
},

x3:{
enabled:true,
rotation:150,
spacing:50,
size:50,
transparency:210,
x:20,
y:95
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

buffer.background(255)

order.forEach(key=>{

const c = externalControls[key]
const img = images[key]

if(!c.enabled || !img) return

drawPattern(buffer,c,img,size,size)

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
this.controls = c
this.image = images[this.key]

}

display(){

if(!this.enabled || !this.image) return

drawPattern(window,this.controls,this.image,width,height)

}

}

function drawPattern(target,c,img,w,h){

const spacing = c.spacing
const rotation = radians(c.rotation)
const sizeImg = c.size
const offsetX = c.x
const offsetY = c.y
const transparency = c.transparency

const cols = Math.ceil(w/spacing)+4
const rows = Math.ceil(h/spacing)+4

const startX = -cols/2 * spacing
const startY = -rows/2 * spacing

target.push()

target.translate(w/2,h/2)

for(let i=0;i<cols;i++){
for(let j=0;j<rows;j++){

const x = startX + i*spacing + offsetX
const y = startY + j*spacing + offsetY

target.push()

target.translate(x,y)
target.rotate(rotation)
target.tint(255,transparency)
target.imageMode(CENTER)

target.image(
img,
0,
0,
sizeImg,
sizeImg
)

target.pop()

}
}

target.pop()

}
