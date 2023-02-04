const cloudinary = require('cloudinary').v2;
const fs = require('fs');
// console.log(cloudinary.config())
// console.log(process.env.CLOUDINARY_URL);
const imageUpload = (imageFile) => {
    fs.writeFileSync('./temp' , imageFile.buffer);
    return cloudinary.uploader.upload('./temp');
    fs.unlink('./temp');    
    return toReturn;
}
const videoUpload = (videoFile) => {
    fs.writeFileSync('./temp' , videoFile.buffer);
    return cloudinary.uploader.upload('./temp' , {resource_type:"video"});
}
const pdfUpload = (pdfFile) => {
    fs.writeFileSync('./temp' , pdfFile.buffer);
    return cloudinary.uploader.upload('./temp', {resource_type: "raw", use_filename: true, unique_filename: false});
}
module.exports = {
    imageUpload , 
    videoUpload , 
    pdfUpload
}