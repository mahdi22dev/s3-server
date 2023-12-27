const express = require('express');
const multer = require('multer');
const cors = require("cors")
const client = require('./lib/S3Client');
const s3Server = require('./lib/S3server');
const app = express();
const port = 5000;
app.use(express.json())
app.use(cors())




// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/",(req,res)=>{
  res.send("s3 server")
})


const s3serverinstance = s3Server
s3serverinstance.run();
const s3 = client


// Endpoint for file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return json({success:false,message:"File not valid"}).status(201);
  }
  const params = {
    Bucket: 'tmp-files', // Replace with your bucket name
    Key: file.originalname,
    Body: file.buffer,
  };
  try {
    await s3.upload(params).promise();
    console.log('File uploaded to S3:', file.originalname);
    res.json({ success: true, message: 'File uploaded successfully.' }).status(201);
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    res.status(500).send('Internal Server Error');
  }
});

// get files
app.get('/get-file/:name' ,async (req,res)=>{
try {
  console.log(req?.params?.name);
const fileName = req.params.name;
  const params = {
    Bucket: 'tmp-files', // Replace with your bucket name
    Key: "Mud (2012) [1080p] [BluRay] [YTS.MX].torrent",
  };
  // Create a read stream for the requested file
  const fileStream = s3.getObject(params).createReadStream();
if (!fileStream) {
  res.status(400).send('file not found');
  
}
  // Set the appropriate headers for the response
  res.setHeader('Content-disposition', `attachment; filename=Mud (2012) [1080p] [BluRay] [YTS.MX].torrent`);
  res.setHeader('Content-type', 'application/octet-stream');

  // Pipe the file stream to the response
  fileStream.pipe(res);

  // Handle errors
  fileStream.on('error', (error) => {
    console.error('Error retrieving file from S3:', error);
    res.status(500).send('Internal Server Error');
  });
} catch (error) {
  res.status(500).send('Internal Server Error');
}
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
