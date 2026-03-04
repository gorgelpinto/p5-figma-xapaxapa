let layers = [];
let images = {};

let externalControls = {

x1:{
enabled:true,
rotation:100,
spacing:80,
size:2000,
transparency:255,
x:-80,
y:60
},

x2:{
enabled:true,
rotation:140,
spacing:120,
size:180,
transparency:255,
x:40,
y:80
},

x3:{
enabled:true,
rotation:200,
spacing:160,
size:200,
transparency:255,
x:20,
y:60
}

};



function preload(){

images[1] = loadImage("img1.png");
images[2] = loadImage("img3.png");
images[3] = loadImage("img2.png");

}



function setup(){

const container = document.getElementById("sketch-container");

const canvas = createCanvas(
container.offsetWidth,
container.offsetHeight
);

canvas.parent("sketch-container");

layers.push(new Layer(1,"x1"));
layers.push(new Layer(2,"x2"));
layers.push(new Layer(3,"x3"));

noLoop();

}



function draw(){

background(255);

layers.forEach(layer=>{
layer.update();
layer.display();
});

}



function windowResized(){

const container = document.getElementById("sketch-container");

resizeCanvas(
container.offsetWidth,
container.offsetHeight
);

redraw();

}



/* ---------- MESSAGE LISTENER ---------- */

window.addEventListener("message",(event)=>{

const data = event.data;



if(data.type==="updateXapa"){

externalControls[data.xapa] = {
...externalControls[data.xapa],
...data.values
};

redraw();

}



if(data.type==="uploadImage"){

loadImage(data.imageData,img=>{

const index =
data.xapa==="x1" ? 0 :
data.xapa==="x2" ? 1 :
2;

layers[index].image = img;

redraw();

});

}



if(data.type==="setOrder"){

const newLayers=[];

data.order.forEach(key=>{

const layer = layers.find(l=>l.prefix===key);

if(layer) newLayers.push(layer);

});

layers=newLayers;

redraw();

}



if(data.type==="exportPNG"){

exportPNG(data.size);

}

});



/* ---------- EXPORT ---------- */

function exportPNG(size){

let g = createGraphics(size,size);

g.background(255);

layers.forEach(layer=>{
layer.update();
layer.display(g);
});

save(g,"xapa.png");

}



/* ---------- LAYER CLASS ---------- */

class Layer{

constructor(index,prefix){

this.image = images[index];
this.prefix = prefix;

}



update(){

const c = externalControls[this.prefix];

this.isActive = c.enabled;
this.rotationAngle = radians(c.rotation);
this.spacing = c.spacing;
this.imageSize = c.size;
this.transparency = c.transparency;
this.horizontalOffset = c.x;
this.verticalOffset = c.y;

}



display(target){

if(!this.isActive) return;

const ctx = target || window;

const buffer = this.spacing * 2;

for(let x=-buffer; x<width+buffer; x+=this.spacing){

for(let y=-buffer; y<height+buffer; y+=this.spacing){

ctx.push();

ctx.translate(
x + this.horizontalOffset,
y + this.verticalOffset
);

ctx.rotate(this.rotationAngle);
ctx.tint(255,this.transparency);
ctx.imageMode(CENTER);

ctx.image(
this.image,
0,
0,
this.imageSize,
this.imageSize
);

ctx.pop();

}

}

}

}
