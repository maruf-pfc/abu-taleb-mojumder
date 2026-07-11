export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    const access_key = process.env.WEB3FORMS_ACCESS_KEY;
    if (!access_key) {
      return res.status(500).json({ message: 'Server configuration error: Web3Forms access key is missing.' });
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key,
        name,
        email,
        subject: subject || 'যোগাযোগ ফর্ম থেকে নতুন বার্তা',
        message
      })
    });

    const data = await response.json();

    const isAjax = req.headers.accept && req.headers.accept.includes('application/json');

    if (response.ok) {
      if (isAjax) {
        return res.status(200).json(data);
      } else {
        return res.redirect(303, '/contact.html?success=true');
      }
    } else {
      if (isAjax) {
        return res.status(response.status).json(data);
      } else {
        return res.redirect(303, `/contact.html?error=${encodeURIComponent(data.message || 'Error occurred')}`);
      }
    }
  } catch (error) {
    const isAjax = req.headers.accept && req.headers.accept.includes('application/json');
    if (isAjax) {
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } else {
      return res.redirect(303, `/contact.html?error=${encodeURIComponent(error.message)}`);
    }
  }
}
