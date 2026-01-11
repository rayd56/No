/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere.
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 */

process.on("unhandledRejection", err => console.log(err));
process.on("uncaughtException", err => console.log(err));

/* ================= RENDER KEEP-ALIVE SERVER ================= */
const http = require("http");

const PORT = process.env.PORT || 1000;

http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("GoatBot is running 🐐🔥");
}).listen(PORT, () => {
	console.log(`🌐 Render HTTP server running on port ${PORT}`);
});
/* ============================================================ */

const axios = require("axios");
const fs = require("fs-extra");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const { execSync } = require("child_process");
const log = require("./logger/log.js");
const path = require("path");

process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

/* ================= CONFIG LOAD ================= */
function getConfigPath(baseName, ext = ".json") {
	const devPath = path.join(__dirname, `${baseName}.dev${ext}`);
	const normalPath = path.join(__dirname, `${baseName}${ext}`);

	if (fs.existsSync(devPath)) {
		console.log(`⚙️ Loaded ${baseName}.dev${ext}`);
		return devPath;
	}
	if (fs.existsSync(normalPath)) {
		console.log(`⚙️ Loaded ${baseName}${ext}`);
		return normalPath;
	}
	throw new Error(`❌ Missing ${baseName}${ext}`);
}

function validJSON(pathDir) {
	if (!fs.existsSync(pathDir)) throw new Error(`File "${pathDir}" not found`);
	execSync(`npx jsonlint "${pathDir}"`, { stdio: "pipe" });
	return true;
}

const dirConfig = getConfigPath("config");
const dirConfigCommands = getConfigPath("configCommands");
const dirAccount = getConfigPath("account", ".txt");

for (const pathDir of [dirConfig, dirConfigCommands]) {
	try {
		validJSON(pathDir);
	} catch (err) {
		log.error("CONFIG", err.message);
		process.exit(0);
	}
}

const config = require(dirConfig);
const configCommands = require(dirConfigCommands);

/* ================= GLOBAL INIT ================= */
global.GoatBot = {
	startTime: Date.now(),
	commands: new Map(),
	eventCommands: new Map(),
	aliases: new Map(),
	onReply: new Map(),
	onReaction: new Map(),
	config,
	configCommands,
	reLoginBot() {},
	Listening: null,
	fcaApi: null,
	botID: null
};

global.client = {
	dirConfig,
	dirConfigCommands,
	dirAccount,
	commandBanned: configCommands.commandBanned
};

const utils = require("./utils.js");
global.utils = utils;

/* ================= AUTO RESTART ================= */
if (config.autoRestart?.time > 0) {
	setTimeout(() => {
		console.log("🔁 Auto restart...");
		process.exit(2);
	}, config.autoRestart.time);
}

/* ================= MAIN START ================= */
(async () => {
	/* ===== Gmail OAuth (SAFE – no crash on Render) ===== */
	const credentials = config.credentials ?? {};
	const gmailAccount = credentials.gmailAccount ?? null;

	if (gmailAccount) {
		try {
			const OAuth2 = google.auth.OAuth2;
			const OAuth2_client = new OAuth2(
				gmailAccount.clientId,
				gmailAccount.clientSecret
			);

			OAuth2_client.setCredentials({
				refresh_token: gmailAccount.refreshToken
			});

			const accessToken = await OAuth2_client.getAccessToken();

			const transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					type: "OAuth2",
					user: gmailAccount.email,
					clientId: gmailAccount.clientId,
					clientSecret: gmailAccount.clientSecret,
					refreshToken: gmailAccount.refreshToken,
					accessToken
				}
			});

			global.utils.transporter = transporter;
			console.log("📧 Gmail OAuth initialisé");
		} catch (e) {
			console.log("⚠️ Gmail OAuth ignoré :", e.message);
		}
	} else {
		console.log("⚠️ Gmail OAuth non configuré — bot continue sans email");
	}

	/* ===== Version check ===== */
	try {
		const { data } = await axios.get(
			"https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/package.json"
		);

		const currentVersion = require("./package.json").version;
		if (data.version !== currentVersion) {
			console.log(`🆕 New version available: ${data.version}`);
		}
	} catch {
		console.log("⚠️ Version check ignoré");
	}

	/* ===== Start bot ===== */
	require("./bot/login/login.js");
})();
