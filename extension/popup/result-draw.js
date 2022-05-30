let canvas = document.getElementById("result-draw");
let ctx = canvas.getContext("2d");
const displayResultDraw = () => {
  let img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
  img.src = localStorage.getItem("draw-image");
};

displayResultDraw();


document.querySelector(".download").onclick = () => {
  var link = document.createElement("a");
  link.download = Date.now() + ".png";
  link.href = canvas.toDataURL();
  link.click();
};
