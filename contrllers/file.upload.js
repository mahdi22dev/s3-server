const uploadFileToS3 = ()=>{
    upload.single('file'), async (req, res) => {
        const file = req.file;
        if (!file) {
          return json({success:false,message:"File not uploaded"}).status(201);
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
      }
}