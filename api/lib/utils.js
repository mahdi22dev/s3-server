const crypto = require('crypto');


module.exports= function generateUniqueFileName(originalName) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = originalName.split('.').pop(); // Get the file extension
    return `${timestamp}_${randomString}.${extension}`;
  }

