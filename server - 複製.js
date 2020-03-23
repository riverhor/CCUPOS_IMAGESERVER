
const express = require('express')
const cloudinary = require('cloudinary')
const formData = require('express-form-data')
const cors = require('cors')
const fileUpload = require('express-fileupload');


const app = express()

cloudinary.config({ 
  cloud_name: 'ccupos', 
  api_key: '879121525816849', 
  api_secret: 's7ThW94N9WQ2Mxt5DLodRL48jao'
})
  

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

app.use(cors({ 
  origin: 'http://140.123.97.42:5000'
})) 

app.use(formData.parse())

app.get('/wake-up', (req, res) => res.send('👌'))

app.post('/image-upload', (req, res) => {
  try {
    if(!req.files) {
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        let data = []; 

        //loop all files
        _.forEach(_.keysIn(req.files.photos), (key) => {
            let photo = req.files.photos[key];
            
            //move photo to uploads directory
            photo.mv('./uploads/' + photo.name);

            //push file details
            data.push({
                name: photo.name,
                mimetype: photo.mimetype,
                size: photo.size
            });
        });

        //return response
        res.send({
            status: true,
            message: 'Files are uploaded',
            data: data
        });
    }
} catch (err) {
    res.status(500).send(err);
}

  /*
  const values = Object.values(req.files)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))
  
  Promise
    .all(promises)
    .then(results => res.json(results))
    .catch((err) => res.status(400).json(err))
    */
})

app.listen(8080, () => console.log('Image server start'))