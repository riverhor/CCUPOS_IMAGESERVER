const express = require('express');
const cors = require('cors')
const fileUpload = require('express-fileupload');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const { exec } = require('child_process');
const fs = require('fs')
var https = require('https')



const PORT = 8080;
//app.use('/form', express.static(__dirname + '/index.html'));
app.use(express.static('uploads'));
// default options
app.use(fileUpload({
  createParentPath: true
}));
app.use(cors({ 
  origin: 'http://140.123.97.42:5000'
})) 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.get('/ping', function(req, res) {
  res.send('pong');
});

function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

app.post('/image-upload', function(req, res) {
  try {
    if(!req.files) {
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        let data = []; 
        let uuid=_uuid()
        console.log(uuid)
        //loop all files
        _.forEach(_.keysIn(req.files), (key) => {
            let photo = req.files[key]
            
            let newname=uuid +'.jpg'
            uploadPath = __dirname + '/uploads/images/'+ newname
            //move photo to uploads directory
            photo.mv( uploadPath);
            //console.log(uploadPath)
            //console.log(req.uid)
            //push file details
            data.push({
                secure_url: "http://140.123.97.42:8080/images/"+newname,
                public_id: uuid,
            });
        });
        var cmd = 'cd C:\\latte_art_program_web && python C:\\latte_art_program_web\\latte_art.py --file '+uuid
        exec(cmd, (error, stdout, stderr) => {
         
          //console.log(`stdout: ${stdout}`);
          //console.error(`stderr: ${stderr}`);
          var filepath = 'C:\\Users\\DUCK\\Desktop\\Image_server\\uploads\\json\\'+uuid+'.json'
          //return response
          
            if (fs.existsSync(filepath))
              res.send({
               status: true,
               message: 'Files are uploaded',
               data: data
              })
            else  
              res.status(502).send('draw_error');
          
        });

    }
} catch (err) {
    res.status(500).send(err);
}
});
/*
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(PORT, function () {
  console.log('Hi')
})
*/
app.listen(PORT, function() {
  console.log('Express server listening on port ', PORT); // eslint-disable-line
});