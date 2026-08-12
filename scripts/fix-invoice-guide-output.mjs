import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'guides', 'how-to-create-an-invoice', 'index.html');
if (!fs.existsSync(file)) process.exit(0);

let html = fs.readFileSync(file, 'utf8');
html = html.replaceAll('/logo.png', '/favicon.svg');
html = html.replaceAll('For a ₹10,000 item in Gujarat with 18% GST (5% + 5%): CGST = ₹900, SGST = ₹900, Total = ₹11,800', 'For a ₹10,000 item in Gujarat with 18% GST (9% + 9%): CGST = ₹900, SGST = ₹900, Total = ₹11,800');
fs.writeFileSync(file, html);
