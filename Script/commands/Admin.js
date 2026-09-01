const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "admin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "FAHAD",
  description: "Show Owner Info",
  commandCategory: "info",
  usages: "admin",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {

  const time = moment()
    .tz("Asia/Dhaka")
    .format("DD/MM/YYYY hh:mm:ss A");

  const imageUrl = "https://i.imgur.com/goMgxBd.jpeg";

  const imagePath = __dirname + "/cache/owner.jpg";

  // Download owner image
  request(imageUrl)
    .pipe(fs.createWriteStream(imagePath))
    .on("close", () => {

      const message = `
┌───────────────⭓
│ 𝗢𝗪𝗡𝗘𝗥 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
├───────────────
│👤 𝐍𝐚𝐦𝐞 : FAHAD
│🚹 𝐆𝐞𝐧𝐝𝐞𝐫 : Male
│❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : Single
│🎂 𝐀𝐠𝐞 : 18
│🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : Islam
│🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : SSC (2026)
│🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : Shatkhira, Khulna
└───────────────⭓

┌───────────────⭓
│ 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦
├───────────────
│📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:
│...........
│💬 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:
│...........
└───────────────⭓

┌───────────────⭓
│ 🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗧𝗶𝗺𝗲
├───────────────
│ ${time}
└───────────────⭓
`;

      api.sendMessage(
        {
          body: message,
          attachment: fs.createReadStream(imagePath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      );

    })
    .on("error", (err) => {
      console.error("Image download error:", err);

      api.sendMessage(
        "❌ Owner image load করা যাচ্ছে না!",
        event.threadID
      );
    });
};
