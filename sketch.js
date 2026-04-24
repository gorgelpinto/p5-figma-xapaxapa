let layers = []
let images = {}

let externalControls = {

x1:{
enabled:true,
rotation:0,
spacing:340,
size:720,
transparency:225,
x:0,
y:40
},

x2:{
enabled:true,
rotation:-22,
spacing:550,
size:950,
transparency:225,
x:-60,
y:80
},

x3:{
enabled:true,
rotation:60,
spacing:140,
size:220,
transparency:255,
x:0,
y:0
}

}

let order = ["x3","x1","x2"]

function preload(){
images["x1"] = loadImage("img1.png")
images["x2"] = loadImage("img2.png")
images["x3"] = loadImage("img3.png")
}

/* 🔥 RESPONSIVE SIZE */
function getCanvasSize(){
  const container = document.getElementById("sketch-container")
  const w = container.offsetWidth
  const h = container.offsetHeight
  // fallback caso altura ainda não esteja definida
  if(h === 0){
    return {
      w,
      h: w * 0.5625 // fallback temporário
    }
  }
  return { w, h }
}

function setup(){

  const { w, h } = getCanvasSize()

  setAttributes('alpha', true)

  const canvas = createCanvas(w, h)
  canvas.parent("sketch-container")

  layers = [
    new Layer("x1"),
    new Layer("x2"),
    new Layer("x3")
  ]

  noLoop()

  // 🔥 força resize após layout estabilizar
  setTimeout(() => {
    windowResized()
  }, 100)

  setTimeout(sendInitialState,300)
}

function draw(){

  clear() // 🔥 real transparency

  order.forEach(key=>{
    const layer = layers.find(l => l.key === key)
    if(!layer) return
    layer.update()
    layer.display()
  })
}

/* 🔥 RESIZE */
function windowResized(){
  const { w, h } = getCanvasSize()
  resizeCanvas(w, h)
  redraw()
}

function sendInitialState(){
window.parent.postMessage({
type:"initialState",
controls:externalControls
},"*")
}

/* 🔥 MESSAGE LISTENER */
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

/* 🔥 EXPORT */
function exportPNG(size){

const buffer = createGraphics(size,size)
buffer.clear() // 🔥 transparent export background

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

const bufferLimit = size + spacing

for(let x=-bufferLimit; x<=size+bufferLimit; x+=spacing){
for(let y=-bufferLimit; y<=size+bufferLimit; y+=spacing){

buffer.push()

buffer.translate(x + offsetX, y + offsetY)
buffer.rotate(rotation)
buffer.tint(255,c.transparency)
buffer.imageMode(CENTER)

buffer.image(img, 0, 0, sizeImg, sizeImg)

buffer.pop()

}
}

})

save(buffer,"xapa.png")
}

/* 🔥 LAYER */
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

/* 🔥 FIX: FULL COVERAGE */
const buffer = Math.max(width, height)

for(let x=-buffer; x<=width+buffer; x+=this.spacing){
for(let y=-buffer; y<=height+buffer; y+=this.spacing){

push()

translate(x + this.offsetX, y + this.offsetY)
rotate(this.rotation)
tint(255,this.transparency)
imageMode(CENTER)

image(this.image, 0, 0, this.size, this.size)

pop()

}
}

}

}
