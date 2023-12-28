const AWS = require("aws-sdk");

const client = new AWS.S3({
  endpoint: "http://localhost:4569", // Point to your local s3rver instance
  s3ForcePathStyle: true,
  accessKeyId: "test",
  secretAccessKey: "test",
});

module.exports = client;
