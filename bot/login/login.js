/**
 * Login handler – SAFE VERSION (Render compatible)
 */

const fs = require("fs-extra");
const path = require("path");
const log = require("../../logger/log.js");

module.exports = async function loginHandler() {
	let account = {};

	/* ===== READ account.dev.txt SAFELY ===== */
	try {
		const accountPath = global.client?.dirAccount;
		if (!accountPath || !fs.existsSync(accountPath)) {
			console.log("⚠️ account.dev.txt introuvable — login ignoré");
			return;
		}

		const raw = fs.readFileSync(accountPath, "utf8").trim();
		if (!raw) {
			console.log("⚠️ account.dev.txt vide — login ignoré");
			return;
		}

		account = JSON.parse(raw);
	} catch (err) {
		console.log("❌ account.dev.txt invalide — login ignoré");
		return;
	}

	/* ===== SAFE DESTRUCTURING ===== */
	const { email, password } = account ?? {};

	if (!email || !password) {
		console.log("❌ Email ou mot de passe manquant dans account.dev.txt");
		return;
	}

	/* ===== START LOGIN ===== */
	try {
		const startLogin = require("./startLogin.js"); // fichier original GoatBot
		await startLogin({ email, password });
	} catch (err) {
		log.error("LOGIN", err);
	}
};
