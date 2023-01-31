const cloudinary = require('cloudinary').v2;
const fs = require('fs');
console.log(cloudinary.config())
console.log(process.env.CLOUDINARY_URL);
const imageUpload = (imageFile) => {
    fs.writeFileSync('./temp' , imageFile.buffer);
    return cloudinary.uploader.upload('./temp');
    fs.unlink('./temp');    
    return toReturn;
}
const videoUpload = (videoFile) => {
    return cloudinary.uploader.upload_large(videoFile , {resource_type:"video"});
}
const pdfUpload = (pdfFile) => {
    return cloudinary.uploader.upload(pdfFile , {resource_type: "raw", use_filename: true, unique_filename: false});
}
module.exports = {
    imageUpload , 
    videoUpload , 
    pdfUpload
}