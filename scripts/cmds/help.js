const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "rayd",
    countDown: 2,
    role: 0,
    shortDescription: {
      en: "Get information about the bot"
    },
    category: "utility",
    guide: {
      en: "help <command> — get command info"
    }
  },
  onStart: async function ({ message, args, event, usersData }) {
    try {
      if (!args || args.length === 0) {
        return showAllCommands(message);
      }

      const query = args[0].toLowerCase();
      const command = commands.get(query) || commands.get(aliases.get(query));

      if (!command) {
        return message.reply(`❌ Unknown command "${query}" 😔`);
      }

      return showCommandDetails(message, command);
    } catch (err) {
      console.error("HELP CMD ERROR:", err);
      return message.reply(`⚠️ Oops, something went wrong! 😔`);
    }
  }
};

async function showAllCommands(message) {
  let body = `🌹 RAYD BOT COMMANDS 🌹\n\n📚 Command List 📚\n\n`;
  const categories = {};

  for (let [name, cmd] of commands) {
    const cat = cmd.config.category || "Misc";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(name);
  }

  for (const cat of Object.keys(categories).sort()) {
    const list = categories[cat].sort().map(c => `• ${c}`).join(" ");
    body += `😈 ${cat} 📂\n${list || "No commands 😔"}\n\n`;
  }

  body += `📊 Total Commands: ${commands.size} 🎉\n`;
  body += `🔧 Get info: .help <command> 📚\n`;

  return message.reply(body);
}

async function showCommandDetails(message, command) {
  const cfg = command.config || {};
  const roleMap = {
    0: "Everyone 👥",
    1: "Admins 👑",
    2: "Moderators 🤖"
  };

  const card = [
    `🌹 RAYD BOT COMMANDS 🌹\n\n🔍 Command: ${cfg.name} 🔍`,
    `📝 Description: ${cfg.shortDescription.en} 📚`,
    `📂 Category: ${cfg.category || "Misc"} 📂`,
    `🛡️ Role: ${roleMap[cfg.role] || "Unknown"} | ⏱️ Cooldown: ${cfg.countDown || 1}s 🕒`,
    `🚀 Version: ${cfg.version || "1.0"} | 👨‍💻 Author: ${cfg.author} 😊`,
    `💡 Usage: .${cfg.name} 📚`
  ].join("\n");

  return message.reply(card);
      }
