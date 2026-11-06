// Gera o QR code do quiz: usado na tela inicial (public/) e para impressão (qrcode/).
// Uso: pnpm qrcode [url]
import QRCode from 'qrcode';

const url = process.argv[2] ?? 'https://quiz.jogaro.com.br';
const opts = {
  errorCorrectionLevel: 'M',
  margin: 2,
  color: { dark: '#0b2a6f', light: '#ffffff' },
};

await QRCode.toFile('public/qrcode.svg', url, { ...opts, type: 'svg' });
await QRCode.toFile('qrcode/quiz-qrcode.svg', url, { ...opts, type: 'svg' });
await QRCode.toFile('qrcode/quiz-qrcode.png', url, { ...opts, type: 'png', width: 1200 });

console.log(`QR code gerado para ${url}`);
