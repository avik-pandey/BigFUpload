var express = require('express');
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');
var app = express();

const upload = require('express-fileupload');

app.set('view engine', 'ejs');
// app.use(upload());
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware


const uploadPath = path.join(__dirname, 'fu/'); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits

// var arr = [1,2,3,4,5];

// for(var i=0;i<arr.length;i++){
//     console.log(arr[i]);
// }
 app.get('/', function(req,res) {
    
     res.render('index');
     
 })

 app.post('/',(req,res)=>{
    req.pipe(req.busboy); // Pipe it trough busboy

    
    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);

        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        // Pipe it through
        file.pipe(fstream);

        // On finish of the upload
        fstream.on('close', () => {
            console.log(`Upload of '${filename}' finished`);
            res.redirect('back');
        });
    });
 })

//small file 
//  app.post('/', (req,res) => {
//        if(req.files){
//            console.log(req.files);
//            var file  =  req.files.upload;
          
//            var filename = file.name;
//            file.mv("./views/"+filename, function(err) {
//                if(err){
//                    console.log(err);
//                    res.send('error occurred');
//                }
//                else{
//                    res.send('done!');
//                }
//            })
//        }
//  })

app.listen(3000, function() {
    console.log("server started on");
  });