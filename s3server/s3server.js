const s3rver = require("s3rver");

const s3Server = new s3rver({
  port: 4569,
  silent: false,
  directory: "/tmp/s3rver_test_directory",
  configureBuckets: [
    {
      name: "tmp-files", // Replace with your desired bucket name
      configureKey: false,
    },
    {
      name: "test-bucket", // Replace with your desired bucket name
      configureKey: false,
    },
  ],
});
s3Server.run();
console.log("s3 mock server start");
