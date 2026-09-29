/**
 * Tempat menambahkan logika command dan balasan bot.
 *
 * @param {import('@whiskeysockets/baileys').WASocket} sock
 * @param {import('@whiskeysockets/baileys').proto.IWebMessageInfo} message
 */
export async function handleMessage(sock, message) {
  const text = message.message?.conversation
    ?? message.message?.extendedTextMessage?.text
    ?? '';

  if (!text.trim()) return;

  // TODO: Tambahkan command bot di sini.
  // Contoh:
  // if (text === '!ping') await sock.sendMessage(message.key.remoteJid, { text: 'pong' });
}
