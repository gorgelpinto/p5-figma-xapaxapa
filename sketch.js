let layers = []
let images = {}

let externalControls = {

x1:{ // folhas verdes
enabled:true,
rotation:0,
spacing:340,
size:720,
transparency:225,
x:0,
y:40
},

x2:{ // dominós laranja (camada superior)
enabled:true,
rotation:-22,
spacing:550,
size:950,
transparency:225,
x:-60,
y:80
},

x3:{ // folhas castanhas (fundo)
enabled:true,
rotation:45,
spacing:140,
size:220,
transparency:255,
x:0,
y:0
}

}

let order = ["x3","x1","x2"]

function preload(){

images["x1"] = loadImage("img1.png") // folhas verdes
images["x2"] = loadImage("img2.png") // dominós
images["x3"] = loadImage("img3.png") // gotas

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

const scale = size / width

order.forEach(key=>{

const c = externalControls[key]
const img = images[key]

if(!c.enabled || !img) return

const spacing = c.spacing * scale
const rotation = radians(c.rotation)
const sizeImg = c.size * scale
const offsetX = c.x * scale
const offsetY = c.y * scale

const bufferSpacing = spacing * 2

for(let x=-bufferSpacing; x<size+bufferSpacing; x+=spacing){
for(let y=-bufferSpacing; y<size+bufferSpacing; y+=spacing){

buffer.push()

buffer.translate(
x + offsetX,
y + offsetY
)

buffer.rotate(rotation)

buffer.tint(255,c.transparency)

buffer.imageMode(CENTER)

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
