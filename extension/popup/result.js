let btnDone = document.querySelector(".done");
btnDone.onclick = () => {
  localStorage.setItem('draw-image', canvas.toDataURL())
  chrome.tabs.update({url: 'popup/result-draw.html'})
}


let canvas = document.getElementById("result");
let ctx = canvas.getContext("2d");


const displayResult = () => {
  let img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.src = localStorage.getItem("data");
};

displayResult();

let paint = false;
let startPos = {
  x: 0,
  y: 0,
};
let color = '';

let toolbar = document.getElementById('toolbar');
toolbar.addEventListener('change', e => {
  if(e.target.id === 'color') {
      color = e.target.value;
  }
});
const getPosition = (e) => {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

const startPosition = (e) => {
  paint = true
};

const draw = (e) => {
  let mousePos = getPosition(e);
  if (paint) {
    drawLine(startPos, mousePos);
  }
  startPos = mousePos;
};

const finishedPosition = (e) => {
  paint = false;
  saveState()
};

const drawLine = (startPos, mousePos) => {
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startPos.x, startPos.y);
  ctx.lineTo(mousePos.x, mousePos.y);
  ctx.stroke();

};


document.querySelector(".draw").onclick = () => {
  canvas.removeEventListener("click",clickWriteText)
  canvas.removeEventListener("mousedown", startRect)
  canvas.removeEventListener("mouseup",endRect)
  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", finishedPosition);
  canvas.addEventListener("mousemove", draw);
  canvas.classList.remove('display-cursor-text')
  canvas.classList.remove("display-cursor-rect")
  canvas.classList.add('display-cursor-paint')
  
};

let mouseX = 0;
let mouseY = 0;
let undoList = []
let redoList = []


const saveState = () => {
    undoList.push(canvas.toDataURL())
}

const undo = () => {
  if(undoList.length > 0){
    redoList.push(undoList[undoList.length - 1])
  }
    console.table(redoList)
    undoList.pop()
    if(undoList.length === 0){
      displayResult()
    } 
    var imgData = undoList[undoList.length - 1];
    var image = new Image();
    image.src = imgData
    image.onload = () => {
        ctx.drawImage(image, 0,0)
    }
}

const redo = () => {
  if(redoList.length > 0){
    undoList.push(redoList[redoList.length - 1])
  }
  var img = new Image();
  img.src = redoList[redoList.length - 1]
  img.onload = () => {
    ctx.drawImage(img, 0,0)
  }
  redoList.pop()
  console.table(redoList)
}
let displayInput = false
document.querySelector(".text").onclick = (e) => {
  canvas.removeEventListener("mousedown",startPosition)
  canvas.removeEventListener("mouseup", finishedPosition)
  canvas.removeEventListener("mousemove", draw)
  canvas.removeEventListener("mousedown", startRect)
  canvas.removeEventListener("mouseup",endRect)
  canvas.addEventListener("click", clickWriteText)
  canvas.classList.remove('display-cursor-paint')
  canvas.classList.remove("display-cursor-rect")
  canvas.classList.add('display-cursor-text')
}
const clickWriteText = (e) => {
  if(displayInput) return;
  addInput(e.clientX, e.clientY)
}
let input, startTextX, startTextY;
const addInput = (x,y) => {
  input = document.createElement('input');
  input.type ='text';
  input.style.position = 'fixed';
  input.style.left = x + 'px'
  input.style.top = y +'px'
  input.style.border = `1px dashed ${color}`
  input.style.color = color
  input.onkeydown = handleEnter;
  document.body.appendChild(input)
  input.focus();
  displayInput = true
  var rect = canvas.getBoundingClientRect();
  startRectX = x - rect.left,
  startRectY = y - rect.top
}
const handleEnter = (e) => {
  let keyCode = e.keyCode;
  if(keyCode === 13){
    writeText(input.value, startRectX,startRectY);
    document.body.removeChild(input)
    displayInput = false
  }
}
const writeText = (text, x, y) => {
  ctx.textBaseline = 'top';
  ctx.textAlign ='left';
  ctx.font = "italic 25px Arial"
  ctx.fillStyle = color
  ctx.fillText(text, x ,y )
  saveState()
}

document.querySelector(".rectangle").onclick = (e) => {
  canvas.removeEventListener("click",clickWriteText)
  canvas.removeEventListener("mousedown",startPosition)
  canvas.removeEventListener("mouseup", finishedPosition)
  canvas.removeEventListener("mousemove", draw)
  canvas.addEventListener("mousedown", startRect)
  canvas.addEventListener("mouseup",endRect)
  canvas.classList.remove('display-cursor-paint')
  canvas.classList.remove('display-cursor-text')
  canvas.classList.add("display-cursor-rect")
}

let startRectX, startRectY, endRectX, endRectY,rectY
const startRect = (e) => {
  startRectX = e.pageX;
  startRectY = e.pageY;
  var rect = canvas.getBoundingClientRect();
  rectY = e.clientY - rect.top
}
const endRect = (e) => {
  endRectX = e.pageX
  endRectY = e.pageY
  drawRect()
  saveState()
}
const drawRect = (e) => {
  ctx.beginPath();
  ctx.rect(startRectX,rectY ,endRectX-startRectX,endRectY-startRectY);
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.stroke();
}
document.querySelector(".undo").onclick = () => {
    undo()
}

document.querySelector(".redo").onclick = () => {
  redo()
}

let navbar = document.querySelector(".flex-tool").querySelectorAll("img")
navbar.forEach(element => {
  element.addEventListener("click", () => {
    navbar.forEach(nav => nav.classList.remove("active"))
    element.classList.add("active")
  })
})

const scroll = () => {
  window.addEventListener("scroll", listenScrollEvent);
}

const listenScrollEvent = (event) => {
  let header = document.querySelector(".flex-navbar")
  if(window.scrollY > 100){
    header.classList.add("sticky")
  }else{
    header.classList.remove("sticky")
  }
}
scroll()