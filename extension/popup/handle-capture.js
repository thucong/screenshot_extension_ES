
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  switch (request.msg) {
    case "getPage":
      let size = {
        width: Math.max(
          document.documentElement.clientWidth,
          document.body.scrollWidth,
          document.documentElement.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.offsetWidth
        ),
        height: Math.max(
          document.documentElement.clientHeight,
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        ),
      };
      chrome.runtime.sendMessage({
        "msg": "setPage",
        "size": size,
        "heightOfBrowser": window.innerHeight,
      });
      break;

    case "scrollPage":
      let lastCapture = false;
      if(request.scrollToPage > 0){
        let elements = document.body.getElementsByTagName("*");
        for (i = 0; i < elements.length; i++) {
          let styleOfElement = window.getComputedStyle(elements[i]);
          if (
            styleOfElement.getPropertyValue("position") == "fixed" ||
            styleOfElement.getPropertyValue("position") == "sticky"
          ) {
            elements[i].style.setProperty("position", "static", "important");
          }
        }
      }
     
      window.scrollTo(0, request.scrollToPage);

      if (request.size.height <= request.scrollToPage) {
        lastCapture = true;
        request.scrollToPage = request.size.height - request.heightOfBrowser;
      }

      chrome.runtime.sendMessage({
        "msg": "capturePage",
        "position": request.scrollToPage,
        "lastCapture": lastCapture,
      });
      break;

    case "resetPage":
      window.scrollTo(0, 0);
      break;
    case "chooseArea":
      document.body.style.cursor = 'crosshair';
      document.addEventListener('mousedown', mouseDown);
      break;
  }
});
let newElement, startPos, startY, newStartY,xCoordinate, selectedArea, yCoordinate;
const mouseDown = (e) => {
	e.preventDefault();
	startPos = {x: e.pageX, y: e.pageY};
  startY = e.y;
	newElement = document.createElement('div');
	newElement.style.background = '#DDDDDD';
	newElement.style.opacity = '0.5';
	newElement.style.position = 'absolute';
	newElement.style.width = "0px";
	newElement.style.height = "0px";
	newElement.style.zIndex = "1";
	document.body.appendChild(newElement);
  console.log("mousedown")
	document.addEventListener('mousemove', mouseMove)
}


const mouseMove = (e) => {
  e.preventDefault();
  console.log("mousemove")
	let nowPos = {x: e.pageX, y: e.pageY};
  if(nowPos.x > startPos.x && nowPos.y > startPos.y){
    newElement.style.left = startPos.x + 'px';
	  newElement.style.top = startPos.y + 'px';
    selectedArea = {x: nowPos.x - startPos.x, y: nowPos.y - startPos.y};
    xCoordinate = startPos.x;
    yCoordinate = startY
    
  }else if (nowPos.x < startPos.x && nowPos.y < startPos.y){
    newElement.style.left = nowPos.x + 'px';
	  newElement.style.top = nowPos.y + 'px';
    selectedArea = {x: startPos.x - nowPos.x, y: startPos.y - nowPos.y};
    xCoordinate = nowPos.x;
    yCoordinate = e.y
    
  }else if (nowPos.x > startPos.x && nowPos.y < startPos.y){
    newElement.style.left = startPos.x + 'px';
	  newElement.style.top = nowPos.y + 'px';
    selectedArea = {x: nowPos.x - startPos.x, y: startPos.y - nowPos.y};
    xCoordinate = startPos.x;
    yCoordinate = e.y
  }else if (nowPos.x < startPos.x && nowPos.y > startPos.y){
    newElement.style.left = nowPos.x + 'px';
	  newElement.style.top = startPos.y + 'px';
    selectedArea = {x: startPos.x - nowPos.x, y: nowPos.y - startPos.y};
    xCoordinate = nowPos.x;
    yCoordinate = startY
  }
	newElement.style.width = selectedArea.x + 'px';
	newElement.style.height = selectedArea.y + 'px';
	document.addEventListener('mouseup', mouseUp);
}
 
const mouseUp = (e) => {
	e.preventDefault();
  console.log("mouseup")
	let nowPos = {x: e.pageX, y: e.pageY};
  if(nowPos.x > startPos.x && nowPos.y > startPos.y){
    newElement.style.left = startPos.x + 'px';
	  newElement.style.top = startPos.y + 'px';
    selectedArea = {x: nowPos.x - startPos.x, y: nowPos.y - startPos.y};
    xCoordinate = startPos.x;
    yCoordinate = startY
    
  }else if (nowPos.x < startPos.x && nowPos.y < startPos.y){
    newElement.style.left = nowPos.x + 'px';
	  newElement.style.top = nowPos.y + 'px';
    selectedArea = {x: startPos.x - nowPos.x, y: startPos.y - nowPos.y};
    xCoordinate = nowPos.x;
    yCoordinate = e.y
    
  }else if (nowPos.x > startPos.x && nowPos.y < startPos.y){
    newElement.style.left = startPos.x + 'px';
	  newElement.style.top = nowPos.y + 'px';
    selectedArea = {x: nowPos.x - startPos.x, y: startPos.y - nowPos.y};
    xCoordinate = startPos.x;
    yCoordinate = e.y
  }else if (nowPos.x < startPos.x && nowPos.y > startPos.y){
    newElement.style.left = nowPos.x + 'px';
	  newElement.style.top = startPos.y + 'px';
    selectedArea = {x: startPos.x - nowPos.x, y: nowPos.y - startPos.y};
    xCoordinate = nowPos.x;
    yCoordinate = startY
  }
  document.body.style.cursor = 'default';
	newElement.parentNode.removeChild(newElement);
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mousedown',mouseDown)
  document.removeEventListener('mouseup',mouseUp)
  setTimeout(() => {
    let area = {
      w: selectedArea.x,
      h: selectedArea.y,
      x: xCoordinate,
      y: yCoordinate
    };
    chrome.runtime.sendMessage({
      "msg": "captureSelectedArea",
      "area": area,
    });
    console.log('sending message with captureSelectedArea');
  },50)
 
}