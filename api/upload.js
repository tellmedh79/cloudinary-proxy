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

    // base64 앞부분 제거: data:image/png;base64,... → ...
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');

    console.log('🧩 fileName:', fileName);
    console.log('🧬 base64 (preview):', base64Data.slice(0, 50));

    const form = new URLSearchParams();
    form.append('file', `data:image/png;base64,${base64Data}`);
    form.append('upload_preset', 'unsigned_preset');

    const cloudName = 'dzcqocpiz';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: form,
    });

    const data = await response.json();

    if (data.secure_url) {
      console.log('✅ Upload success:', data.secure_url);
      return res.status(200).json({ secure_url: data.secure_url });
    } else {
      console.error('❌ Cloudinary error response:', data);
      return res.status(500).json({ error: 'Upload failed', detail: data });
    }
  } catch (e) {
    console.error('❌ Upload Error:', e);
    return res.status(500).json({ error: 'Upload failed', detail: e.message });
  }
}

