chrome.runtime.onMessage.addListener(function (request, sender, callback) {
   if (request.msg === "captureSelectedArea"){
      console.log("capture")
      captureSelectedArea(request.area)
    }
  })


const captureSelectedArea = (area) => {
    chrome.tabs.captureVisibleTab(null, { }, function (dataUrl) {
        var img = new Image();
        if(dataUrl){
        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = area.w;
            canvas.height = area.h;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(
            img,
            area.x,
            area.y,
            area.w,
            area.h,
            0,
            0,
            area.w,
            area.h
            );
            localStorage.setItem("data",canvas.toDataURL("image"));
            chrome.tabs.create({url: 'popup/result.html'})
        };
        img.src = dataUrl;
        }
        
    });
}