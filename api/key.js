module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const access_key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!access_key) {
    return res.status(500).json({ message: 'Server configuration error: Web3Forms access key is missing.' });
  }

  return res.status(200).json({ key: access_key });
};
