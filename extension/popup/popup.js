let btnDisplayCapture = document.querySelector(".btn-capture");
let btnDisplayRecord = document.querySelector(".btn-record");

const handleDisplayCapture = (isShow = true) => {
  document.querySelector(".display-capture").style.display = isShow ? "block" : "none";
  document.querySelector(".btn-capture").style.background = isShow ? "white" : "rgba(109, 95, 201, 0.1)"
  document.querySelector(".color-cornflower-blue1").style.color = isShow ? "#6D5FC9" : "rgba(33, 27, 66, 0.6)"
  document.querySelector(".color-icon-capture").style.fill = isShow ? "#6D5FC9" : ""
  document.querySelector(".color-icon-capture").style.fillOpacity = isShow ? "1" : " 0.6"
 
};

const handleDisplayRecord = (isShow = true) => {
  document.querySelector(".display-record").style.display = isShow ? "block" : "none";
    document.querySelector(".btn-record").style.background = isShow ? "white" : "rgba(109, 95, 201, 0.1)"
    document.querySelector(".color-cornflower-blue2").style.color = isShow ? "#6D5FC9" : "rgba(33, 27, 66, 0.6)"
    document.querySelector(".color-icon-record").style.fill = isShow ? "#6D5FC9" : ""
    document.querySelector(".color-icon-record").style.fillOpacity = isShow ? "1" : " 0.6"
};

btnDisplayCapture.onclick = () => {
  handleDisplayCapture(true);
  handleDisplayRecord(false);
};
btnDisplayRecord.onclick = () => {
  handleDisplayCapture(false);
  handleDisplayRecord(true);
};

handleDisplayCapture(true);
handleDisplayRecord(false);


document.querySelector(".visible-part").onclick = () => {
  chrome.tabs.captureVisibleTab(null, {}, function (dataUrl) {
    localStorage.setItem("data", dataUrl);
    chrome.tabs.create({url: 'popup/result.html'})
})}


let heightOfBrowser = 0
let size = {
  width: 0,
  height:0
}
let screenshotCanvas = null
let screenshotContext = null
let tabId = 0

const handleButtonFullpage = () => {
  let btn = document.querySelector(".full-page");
  btn.onclick = () => {
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, (tabs) => {
      tabId = tabs[0].id
      chrome.tabs.sendMessage(tabs[0].id, {
        "msg" : "getPage"
      })
    });
  };
}



chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  if (request.msg === "setPage") {
    size = request.size;
    heightOfBrowser = request.heightOfBrowser;
    // set width & height of canvas element
    screenshotCanvas.width = size.width;
    screenshotCanvas.height = size.height;
    scrollToPage(0);
  } else if (request.msg === "capturePage") {
    captureFullpage(request.position, request.lastCapture);
  } 
})

const scrollToPage = (position) => {
  chrome.tabs.sendMessage(tabId, {
    "msg" : "scrollPage",
    "size" : size,
    "heightOfBrowser": heightOfBrowser,
    "scrollToPage" : position
  })
}

const initialize = () => {
  screenshotCanvas = document.createElement("canvas");
  screenshotContext = screenshotCanvas.getContext("2d");
  handleButtonFullpage()
}

const captureFullpage = (position, lastCapture) => {
  setTimeout(() => {
    chrome.tabs.captureVisibleTab(null,{},function(dataUrl){
    let  image = new Image();
    if(dataUrl){
      image.onload = () => {
        screenshotContext.drawImage(image, 0, position);
        if(lastCapture){
          resetPage();
          localStorage.setItem("data",screenshotCanvas.toDataURL("image"));
          chrome.tabs.create({url: 'popup/result.html'})
        }else{
          scrollToPage(position + heightOfBrowser);
        }
      }
      image.src = dataUrl
     
    }else{
      alert("error")
    }
  })
  },1000)
}

const resetPage = () =>  {
  chrome.tabs.sendMessage(tabId, {
    "msg": "resetPage"
  });
}

initialize();


document.querySelector(".selected-area").onclick = async () => {
  let queryOptions = { active: true, currentWindow: true };
  await chrome.tabs.query(queryOptions, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      "msg" : "chooseArea"
    })
  });
};
