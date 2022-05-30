const CaptureRepository = require("../repositories/CaptureRepository")

let createCapture = async (req,res) => {
        let data = await CaptureRepository.createCapture(req.body);
        return res.send(data)
}

let getImage = async (req,res) => {
  
        let data = await CaptureRepository.getImage();
        return res.send(data)

}

module.exports = {
    createCapture,
    getImage
}