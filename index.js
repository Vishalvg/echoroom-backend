```javascript
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ ping route
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

// 🔥 Firebase config
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔔 Notification API
app.post("/sendNotification", async (req, res) => {

  const { token, title, body, senderId, chatId, messageId } = req.body;

  if (!token) {
    return res.status(400).send("Token missing");
  }

  // ✅ UPDATED MESSAGE (HIGH PRIORITY FIX)
  const message = {
    token: token,

    android: {
      priority: "high",          // 🔥 CRITICAL FIX
      ttl: 3600 * 1000           // optional (1 hour)
    },

    data: {
      title: String(title),
      body: String(body),
      senderId: String(senderId),
      chatId: String(chatId),
      messageId: String(messageId)
    }
  };

  try {
    await admin.messaging().send(message);
    res.send("Notification sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending notification");
  }
});

// ✅ ONLY ONE listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
```
