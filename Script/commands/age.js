module.exports = {
  config: {
    name: "age",
    version: "3.0.0",
    author: "FAHAD",
    hasPermission: 0,
    commandCategory: "utility",
    cooldowns: 5,
    description: "Calculate age and zodiac sign from birth date",
    usage: "[DD/MM/YYYY]",
    dependencies: {
      "moment-timezone": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  run: async function ({ api, event, args }) {
    const fs = require("fs-extra");
    const moment = require("moment-timezone");
    const axios = require("axios");

    try {
      if (!args[0]) {
        return api.sendMessage(
          "আপনার জন্ম তারিখ দিন।\n\nফরম্যাট: DD/MM/YYYY\nউদাহরণ: age 01/04/2006",
          event.threadID
        );
      }

      const input = args[0];
      const dateParts = input.split("/");

      if (dateParts.length !== 3) {
        return api.sendMessage(
          "ভুল তারিখের ফরম্যাট।\nঅনুগ্রহ করে DD/MM/YYYY ফরম্যাট ব্যবহার করুন।",
          event.threadID
        );
      }

      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const year = parseInt(dateParts[2]);

      if (
        isNaN(day) ||
        isNaN(month) ||
        isNaN(year) ||
        day < 1 ||
        day > 31 ||
        month < 1 ||
        month > 12 ||
        year < 1000 ||
        year > new Date().getFullYear()
      ) {
        return api.sendMessage(
          "ভুল জন্ম তারিখ। অনুগ্রহ করে সঠিক তারিখ দিন।",
          event.threadID
        );
      }

      const birthDate = moment.tz(
        {
          year: year,
          month: month - 1,
          day: day
        },
        "Asia/Dhaka"
      );

      const now = moment.tz("Asia/Dhaka");

      if (!birthDate.isValid()) {
        return api.sendMessage(
          "এই তারিখটি সঠিক নয়। অনুগ্রহ করে একটি বাস্তব তারিখ দিন।",
          event.threadID
        );
      }

      if (birthDate.isAfter(now)) {
        return api.sendMessage(
          "ভবিষ্যতের তারিখ জন্ম তারিখ হতে পারে না।",
          event.threadID
        );
      }

      const duration = moment.duration(now.diff(birthDate));

      const years = duration.years();
      const months = duration.months();
      const days = duration.days();

      const totalMonths = Math.floor(now.diff(birthDate, "months"));
      const totalDays = Math.floor(now.diff(birthDate, "days"));
      const totalHours = Math.floor(now.diff(birthDate, "hours"));
      const totalMinutes = Math.floor(now.diff(birthDate, "minutes"));
      const totalSeconds = Math.floor(now.diff(birthDate, "seconds"));

      // Zodiac / Rashi
      function getZodiac(day, month) {

        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
          return {
            name: "মেষ",
            symbol: "♈",
            traits:
              "সাহসী, আত্মবিশ্বাসী, উদ্যমী, নেতৃত্বপ্রবণ, স্বাধীনচেতা, প্রতিযোগিতাপ্রিয়, দ্রুত সিদ্ধান্ত নিতে পছন্দ করে, নতুন কিছু করতে আগ্রহী, পরিশ্রমী এবং নিজের লক্ষ্য অর্জনে দৃঢ়প্রতিজ্ঞ।"
          };
        }

        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
          return {
            name: "বৃষ",
            symbol: "♉",
            traits:
              "শান্ত, ধৈর্যশীল, বিশ্বস্ত, বাস্তববাদী, দায়িত্বশীল, পরিশ্রমী এবং নিজের সিদ্ধান্তে দৃঢ়। আরাম ও স্থিরতা পছন্দ করে, সম্পর্কের ক্ষেত্রে বিশ্বস্ত এবং সহজে হাল ছেড়ে দেয় না।"
          };
        }

        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
          return {
            name: "মিথুন",
            symbol: "♊",
            traits:
              "বুদ্ধিমান, কৌতূহলী, প্রাণবন্ত, কথা বলতে পছন্দ করে, দ্রুত শেখে, নতুন মানুষের সঙ্গে সহজে মিশতে পারে, সৃজনশীল এবং পরিস্থিতির সঙ্গে নিজেকে মানিয়ে নিতে পারে।"
          };
        }

        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
          return {
            name: "কর্কট",
            symbol: "♋",
            traits:
              "আবেগপ্রবণ, যত্নশীল, সংবেদনশীল, পরিবারপ্রিয়, বিশ্বস্ত, সহানুভূতিশীল এবং আপনজনদের প্রতি অত্যন্ত দায়িত্বশীল। কাছের মানুষদের সুখকে অনেক গুরুত্ব দেয়।"
          };
        }

        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
          return {
            name: "সিংহ",
            symbol: "♌",
            traits:
              "আত্মবিশ্বাসী, সাহসী, উদার, নেতৃত্ব দিতে পছন্দ করে, সৃজনশীল, প্রাণবন্ত এবং নিজের প্রতি বিশ্বাসী। প্রশংসা পছন্দ করে এবং প্রিয় মানুষদের জন্য অনেক কিছু করতে চায়।"
          };
        }

        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
          return {
            name: "কন্যা",
            symbol: "♍",
            traits:
              "বুদ্ধিমান, পরিশ্রমী, দায়িত্বশীল, গোছানো, বাস্তববাদী, বিশ্লেষণী ক্ষমতাসম্পন্ন এবং ছোট বিষয়েও মনোযোগী। কাজ নিখুঁতভাবে করতে চেষ্টা করে এবং অন্যদের সাহায্য করতে পছন্দ করে।"
          };
        }

        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
          return {
            name: "তুলা",
            symbol: "♎",
            traits:
              "শান্তিপ্রিয়, বন্ধুত্বপূর্ণ, ভদ্র, ন্যায়পরায়ণ, কূটনৈতিক, ভারসাম্যপূর্ণ এবং সৌন্দর্যপ্রিয়। ঝগড়া এড়িয়ে চলতে পছন্দ করে এবং সবার সঙ্গে ভালো সম্পর্ক বজায় রাখার চেষ্টা করে।"
          };
        }

        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
          return {
            name: "বৃশ্চিক",
            symbol: "♏",
            traits:
              "গভীর চিন্তাশীল, দৃঢ়প্রতিজ্ঞ, সাহসী, আবেগপ্রবণ, রহস্যময়, বিশ্বস্ত এবং লক্ষ্যপূরণে অত্যন্ত মনোযোগী। কাউকে বিশ্বাস করলে তার পাশে দৃঢ়ভাবে থাকে।"
          };
        }

        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
          return {
            name: "ধনু",
            symbol: "♐",
            traits:
              "আশাবাদী, স্বাধীনচেতা, সাহসী, ভ্রমণপ্রিয়, সৎ, প্রাণবন্ত, জ্ঞান অর্জনে আগ্রহী এবং নতুন অভিজ্ঞতা পছন্দ করে। স্বাধীনভাবে নিজের জীবন পরিচালনা করতে ভালোবাসে।"
          };
        }

        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
          return {
            name: "মকর",
            symbol: "♑",
            traits:
              "পরিশ্রমী, দায়িত্বশীল, ধৈর্যশীল, বাস্তববাদী, শৃঙ্খলাপরায়ণ, উচ্চাকাঙ্ক্ষী এবং লক্ষ্যভেদী। ধীরে ধীরে হলেও নিজের লক্ষ্য অর্জনের জন্য কঠোর পরিশ্রম করে।"
          };
        }

        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
          return {
            name: "কুম্ভ",
            symbol: "♒",
            traits:
              "স্বাধীনচেতা, বুদ্ধিমান, সৃজনশীল, নতুন চিন্তাধারার, মানবিক, বন্ধুত্বপূর্ণ এবং নিজের মতো করে চলতে পছন্দ করে। প্রচলিত চিন্তার বাইরে নতুন কিছু ভাবতে ভালোবাসে।"
          };
        }

        return {
          name: "মীন",
          symbol: "♓",
          traits:
            "দয়ালু, আবেগপ্রবণ, কল্পনাপ্রবণ, সহানুভূতিশীল, সৃজনশীল, কোমলমনের এবং অন্যের অনুভূতি সহজে বুঝতে পারে। আপনজনদের জন্য অনেক যত্নশীল এবং সাহায্য করতে পছন্দ করে।"
        };
      }

      const zodiac = getZodiac(day, month);

      // Profile picture
      const cacheDir = `${__dirname}/cache`;

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const avatarPath = `${cacheDir}/${event.senderID}.jpg`;

      const avatarUrl =
        `https://graph.facebook.com/${event.senderID}/picture` +
        `?width=512&height=512` +
        `&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      let attachment = null;

      try {
        const response = await axios.get(avatarUrl, {
          responseType: "stream",
          timeout: 10000
        });

        const writer = fs.createWriteStream(avatarPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        attachment = fs.createReadStream(avatarPath);

      } catch (avatarError) {
        console.log("Profile picture could not be downloaded.");
      }

      const message = {
        body:
`┏━━━━━━━━━━━━━━━━━━━━❂
┃       বয়স ক্যালকুলেটর
┣━━━━━━━━━━━━━━━━━━━━❂
┃ জন্ম তারিখ: ${day}/${month}/${year}
┃
┃ বর্তমান বয়স:
┃ ${years} বছর ${months} মাস ${days} দিন
┣━━━━━━━━━━━━━━━━━━━━❂
┃       মোট সময়
┣━━━━━━━━━━━━━━━━━━━━❂
┃ ${totalMonths} মাস
┃ ${totalDays} দিন
┃ ${totalHours} ঘণ্টা
┃ ${totalMinutes} মিনিট
┃ ${totalSeconds} সেকেন্ড
┣━━━━━━━━━━━━━━━━━━━━❂
┃          রাশি
┣━━━━━━━━━━━━━━━━━━━━❂
┃ ${zodiac.symbol} ${zodiac.name} রাশি
┃
┃ রাশির বৈশিষ্ট্য:
┃ ${zodiac.traits}
┣━━━━━━━━━━━━━━━━━━━━❂
┃ তৈরি করেছে: FAHADS-BOT
┗━━━━━━━━━━━━━━━━━━━━❂`,
        ...(attachment ? { attachment } : {})
      };

      await api.sendMessage(message, event.threadID);

      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }

    } catch (error) {
      console.error("Error in age command:", error);

      api.sendMessage(
        "আপনার তথ্য প্রসেস করার সময় একটি সমস্যা হয়েছে।",
        event.threadID
      );
    }
  }
};
