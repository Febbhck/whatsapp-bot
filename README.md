# WhatsApp Bot Base

Starter kosong bot WhatsApp menggunakan [Baileys](https://github.com/WhiskeySockets/Baileys).

## Menjalankan

```bash
cp .env.example .env
npm install
npm start
```

Isi `PHONE_NUMBER` di file `.env` dengan format internasional tanpa tanda `+` atau spasi. Contoh:

```env
PHONE_NUMBER=6281234567890
```

Jalankan bot, lalu masukkan **pairing code** yang tampil di terminal melalui **WhatsApp → Perangkat tertaut → Tautkan perangkat → Tautkan dengan nomor telepon**.

Jika `PHONE_NUMBER` dikosongkan, bot otomatis menampilkan QR sebagai fallback.

Sesi login disimpan di folder `session/`, sehingga setelah login berikutnya tidak perlu scan QR lagi. Untuk logout total, hapus isi folder `session/` lalu jalankan ulang.

## Menambahkan command

Edit `src/handlers/message.js`. Contoh command sederhana:

```js
if (text === '!ping') {
  await sock.sendMessage(message.key.remoteJid, { text: 'pong' });
}
```

## Catatan

- Ini hanya base kosong: belum ada database, command, admin role, atau fitur media.
- Gunakan akun dan automasi sesuai aturan WhatsApp serta hindari spam.
- Baileys mengakses WhatsApp Web secara tidak resmi; perubahan dari WhatsApp dapat memerlukan penyesuaian dependency.
