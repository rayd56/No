const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "up",
    version: "1.0",
    author: "rayd",
    countDown: 2,
    role: 0,
    shortDescription: {
      en: "Get bot uptime"
    },
    category: "utility",
    guide: {
      en: "up — get bot uptime"
    }
  },
  onStart: async function ({ message, args, event, usersData }) {
    try {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const card = `
🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟
🌟     RAYD BOT UPTIME     🌟
🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟

🕰️ Uptime: ${hours}h ${minutes}m ${seconds}s 💫
💎 Status: <Online> ✨
📆 Last Restart: ${new Date(Date.now() - (uptime * 1000)).toLocaleString()} 🌟
👨‍💻 Author: rayd 💻
🔩 Version: 1.0 🚀
📊 CPU: ${process.cpuUsage().user / 1000}% 🔋
📈 RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB 💾
📁 Disk: ${(require('os').totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB 💽
📶 Network: ${require('os').networkInterfaces()} 📡
📈 Uptime Chart: ${'█'.repeat(Math.floor(hours / 2))} ${hours}h
📊 System Load: ${require('os').loadavg()[0]} 🔥
📆 System Time: ${new Date().toLocaleString()} 🕰️
📁 OS: ${require('os').platform()} ${require('os').arch()} 💻
👥 Users: ${require('os').userInfo().username} 👤

🔴🔵🟢🟡🟣 SYSTEM ONLINE 🟣🟡🟢🔵🔴
      `;

      return message.reply(card);
    } catch (err) {
      console.error("UP CMD ERROR:", err);
      return message.reply(`⚠️ Oops, something went wrong! 😔`);
    }
  }
};
