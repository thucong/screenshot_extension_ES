const Capture = require("../models/CaptureModel")

// var data = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAA..kJggg==';

let createCapture =  (data) => {
    let image = data.image
    var matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

  response.type = matches[1];
//   console.log(response.type)
  response.data = Buffer.from(matches[2], 'base64');
//   console.log( response.data)
  let decodedImg = response
  let imageBuffer = decodedImg.data;
  var type = decodedImg.type;
  var extension = type.split('/')[1];
  var fileName =  Date.now()+'.' + extension;
  try{
      require("fs").writeFileSync("images/" + fileName, imageBuffer, 'utf-8');
      return new Promise(async (resolve, reject) => {
        try {
                let newData = await Capture.create({
                    image: fileName
                })
                resolve(newData)
        }catch (e){
            reject(e)
        }
    })
    }catch(e){
        console.log(e)
    }
}

let getImage = () => {
    return new Promise( async (resolve, reject) => {
        try{
            let image = await Capture.findAll({ limit: 1,  order: [ ['id', 'DESC']],})
            resolve(image)
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createCapture,
    getImage
}