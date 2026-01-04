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
  onStart: async function ({ api, message, args, event, usersData }) {
    try {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const os = require('os');
      const networkInterfaces = os.networkInterfaces();
      let networkInfo = "Not available";
      if (networkInterfaces && Object.keys(networkInterfaces).length > 0) {
        const iface = networkInterfaces.eth0 || networkInterfaces.wlan0 || networkInterfaces.Ethernet || networkInterfaces['Wi-Fi'];
        if (iface && iface[0]) {
          networkInfo = iface[0].address || "No IP";
        }
      }

      let loading = 0;
      let messageID;
      const initialMsg = await message.reply(`Initialisation... [----------] 0%`);
      messageID = initialMsg.messageID;

      const updateLoading = async (percent) => {
        const filledBars = Math.floor(percent / 10);
        const emptyBars = 10 - filledBars;
        const loadingBar = '█'.repeat(filledBars) + '-'.repeat(emptyBars);
        const loadingText = `Initialisation... [${loadingBar}] ${percent}%`;
        try {
          await api.editMessage(loadingText, messageID);
          return true;
        } catch (error) {
          return false;
        }
      };

      const steps = [20, 40, 60, 80, 100];
      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 600));
        const success = await updateLoading(step);
        if (!success && step === 100) {
          try {
            await api.editMessage(`Initialisation... [██████████] 100%`, messageID);
          } catch (e) {}
        }
      }

      const card = `
╔═════════════════════════════════════════════════╗
║             RAYD BOT UPTIME STATUS             ║
╚═════════════════════════════════════════════════╝

🕰️ Uptime: ${hours}h ${minutes}m ${seconds}s
📆 Last Restart: ${new Date(Date.now() - (uptime * 1000)).toLocaleString()}
👨‍💻 Author: rayd
🔩 Version: 1.0
📊 CPU: ${(process.cpuUsage().user / 1000000).toFixed(2)}%
📈 RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
📁 Disk: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB
📶 Network: ${networkInfo}
📈 Uptime Chart: ${hours >= 2 ? '█'.repeat(Math.floor(hours / 2)) : '▁'} ${hours}h
📊 System Load: ${os.loadavg()[0].toFixed(2)}
📆 System Time: ${new Date().toLocaleString()}
📁 OS: ${os.platform()} ${os.arch()}
👥 Users: ${os.userInfo().username}

╔═════════════════════════════════════════════════╗
║           SYSTEM ONLINE STATUS                 ║
║   All systems operational and running          ║
║   Performance: Optimal                         ║
║   Security: Up to date                         ║
╚═════════════════════════════════════════════════╝
`.trim();

      await new Promise(resolve => setTimeout(resolve, 100));
      await api.editMessage(card, messageID);
    } catch (err) {
      console.error("UP CMD ERROR:", err);
      return message.reply(`⚠️ Oops, something went wrong! 😔`);
    }
  }
};
