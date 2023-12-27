const express = require("express");
const multer = require("multer");
const cors = require("cors");
const client = require("./lib/S3Client");
const crypto = require("crypto");
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("s3 client");
});

const s3 = client;

// Endpoint for file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return json({ success: false, message: "File not valid" }).status(201);
  }
  const randomString = crypto.randomBytes(8).toString("hex");
  const generatedFileKey = randomString + "_" + file.originalname;
  const params = {
    Bucket: "tmp-files", // Replace with your bucket name
    Key: generatedFileKey,
    Body: file.buffer,
    Metadata: {
      originalFilename: file.originalname,
    },
  };
  try {
    await s3.upload(params).promise();
    console.log("File uploaded to S3:", decodeURIComponent(file.originalname));
    res
      .json({
        success: true,
        message: "File uploaded successfully.",
        fileName: generatedFileKey,
      })
      .status(201);
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// get files
app.get("/get-file/:name", async (req, res) => {
  try {
    const fileName = decodeURIComponent(req.params.name);
    const params = {
      Bucket: "tmp-files", // Replace with your bucket name
      Key: fileName,
    };
    // Create a read stream for the requested file
    const fileStream = s3.getObject(params).createReadStream();

    if (!fileStream) {
      res.status(400).send("file not found");
    }
    // Set the appropriate headers for the response
    res.setHeader("Content-disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-type", "application/octet-stream");

    // Pipe the file stream to the response
    fileStream.pipe(res);

    // Handle errors
    fileStream.on("error", (error) => {
      console.error("Error retrieving file from S3:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/file-meta/:name", async (req, res) => {
  try {
    const fileName = decodeURIComponent(req.params.name);
    const params = {
      Bucket: "tmp-files", // Replace with your bucket name
      Key: fileName,
    };
    // Create a read stream for the requested file
    const metadata = await s3.headObject(params).promise();

    if (metadata) {
      const fileMetadata = {
        name: metadata.originalFilename || fileName,
        size: metadata.ContentLength,
        lastModified: metadata.LastModified,
        contentType: metadata.ContentType,
      };

      res
        .json({ success: true, message: "file metadata", fileMetadata })
        .status(200);
    } else {
      res
        .json({
          success: false,
          message: "no metadata found",
          fileMetadata: null,
        })
        .status(400);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
