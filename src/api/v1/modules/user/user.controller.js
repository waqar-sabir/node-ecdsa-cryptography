const catchAsync = require('../../../../utils/catchAsync');
const userService = require('./user.services');
const { ec } = require('elliptic');
const CryptoJS = require('crypto-js');
const redis = require('redis');
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

exports.submitEncryptData = catchAsync(async (req, res) => {
  const { publicKey, encryptedData, signature } = req.body;

  // Step 1: Prepare the ECDSA signature object
  const ecKeyPair = ec('secp256k1').keyFromPublic(publicKey, 'hex');
  const signatureDER = Buffer.from(signature, 'hex');

  // Step 2: Hash the encrypted data for signature verification
  const encryptedDataHash = CryptoJS.SHA256(encryptedData).toString();

  // Step 3: Verify the signature using the public key and the hashed encrypted data
  const isSignatureValid = ecKeyPair.verify(encryptedDataHash, signatureDER);

  // Step 4: If the signature is valid, process the encrypted data
  if (isSignatureValid) {
    const user = await userService.create({ encrypted_data: encryptedData });
    const userData = user.encrypted_data;

    // Set data in the cache
    // const cacheExpirationSeconds = 3600; // Cache data for 1 hour
    // redisClient.set(`user:${user.id}`, cacheExpirationSeconds, JSON.stringify(userData));
    res.send(userData);
  } else {
    return res.status(400).json({ error: 'Invalid signature.' });
  }
});

exports.findOne = catchAsync(async (req, res) => {
  // Get data from the cache:
  const userId = req.params.id;
  redisClient.get(`user:${userId}`, async (err, cachedUserData) => {
    if (err) {
      // Handle error
      console.error('Error fetching data from Redis:', err);
    } else {
      if (cachedUserData) {
        // Data found in the cache, parse it back into an object
        const userData = JSON.parse(cachedUserData);
        console.log('User data from cache:', userData);
        return res.send(userData);
      } else {
        console.log('Data not found in cache. Fetch from database or source.');
        const result = await userService.findOne(req.params.id);
        res.send(result);
      }
    }
  });
});

