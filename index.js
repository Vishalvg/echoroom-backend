const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔥 Load Firebase Service Account from Environment Variable
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/sendNotification", async (req, res) => {

  const { token, title, body, senderId, chatId, messageId } = req.body;

  if (!token) {
    return res.status(400).send("Token missing");
  }

  const message = {
    token: token,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
