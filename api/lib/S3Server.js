const s3rver = require("s3rver");
const s3Server = new s3rver({
  port: 4569,
  silent: false,
  directory: "/tmp/s3rver_test_directory",
  configureBuckets: [
    {
      name: "my-bucket", // Replace with your desired bucket name
      configureKey: false,
    },
  ],
});
module.exports = s3Server;
