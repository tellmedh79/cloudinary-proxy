import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  try {
    const { file, fileName } = req.body;

    if (!file || !fileName) {
      return res.status(400).json({ error: 'Missing file or fileName' });
    }

    const form = new URLSearchParams();
    form.append('file', file);
    form.append('upload_preset', 'unsigned_preset');

    const cloudName = 'dzcqocpiz';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: form,
    });

    const data = await response.json();

    return res.status(200).json({ secure_url: data.secure_url });
  } catch (e) {
    console.error('❌ Upload Error:', e);
    return res.status(500).json({ error: 'Upload failed', detail: e.message });
  }
}
