const s3rver = require("s3rver");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5001;
app.use(express.json());
app.use(cors());

const s3Server = new s3rver({
  port: 4570,
  silent: false,
  directory: "/tmp/s3rver_test_directory",
  configureBuckets: [
    {
      name: "tmp-files", // Replace with your desired bucket name
      configureKey: false,
    },
  ],
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
s3Server.run();
console.log("s3 mock server start");
