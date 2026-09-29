import 'dotenv/config';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import { handleMessage } from './handlers/message.js';

const sessionDir = process.env.SESSION_DIR || './session';
const logLevel = process.env.LOG_LEVEL || 'info';
const phoneNumber = (process.env.PHONE_NUMBER || '').replace(/\D/g, '');
const logger = pino({ level: logLevel });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    browser: ['WhatsApp Bot Base', 'Chrome', '1.0.0'],
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: false
  });

  sock.ev.on('creds.update', saveCreds);

  if (!state.creds.registered && phoneNumber) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(`\nPairing code: ${code}\n`);
        console.log('Di WhatsApp buka Perangkat tertaut > Tautkan perangkat > Tautkan dengan nomor telepon.');
      } catch (error) {
        logger.error({ error }, 'Gagal membuat pairing code');
      }
    }, 3_000);
  }

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr && !phoneNumber) {
      console.log('\nScan QR berikut dari WhatsApp > Perangkat tertaut:\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'open') {
      console.log('Bot WhatsApp terhubung.');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.error('Koneksi terputus.', {
        statusCode,
        reconnect: shouldReconnect
      });

      if (shouldReconnect) {
        setTimeout(startBot, 3_000);
      } else {
        console.error('Sesi logout. Hapus folder session lalu jalankan ulang untuk login kembali.');
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const message of messages) {
      if (message.key.fromMe || !message.message) continue;

      try {
        await handleMessage(sock, message);
      } catch (error) {
        logger.error({ error }, 'Gagal memproses pesan');
      }
    }
  });
}

startBot().catch((error) => {
  logger.error({ error }, 'Bot gagal dijalankan');
  process.exitCode = 1;
});
