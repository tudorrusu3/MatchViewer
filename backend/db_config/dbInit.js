var admin = require("firebase-admin");

var serviceAccount = require("./proiecttic-74a0e-firebase-adminsdk-fbsvc-a110198b22.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});