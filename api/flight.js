// Vercel serverless function — keeps your RapidAPI key server-side.
// Deploy this at: /api/flight.js in your repo (Vercel auto-detects it).
// Set RAPIDAPI_KEY in Vercel → Project → Settings → Environment Variables.
//
// Frontend calls: /api/flight?number=UA436
// This function calls AeroDataBox on the frontend's behalf and returns the JSON.

export default async function handler(req, res) {
  try {
    const { number } = req.query;
    if (!number) {
      return res.status(400).json({ error: 'Missing flight number. Use /api/flight?number=UA436' });
    }

    if (!process.env.RAPIDAPI_KEY) {
      return res.status(500).json({ error: 'RAPIDAPI_KEY environment variable is not set in Vercel.' });
    }

    const apiRes = await fetch(
      `https://aerodatabox.p.rapidapi.com/flights/number/${encodeURIComponent(number)}`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
      }
    );

    const text = await apiRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }

    return res.status(apiRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: (err && err.message) ? err.message : String(err) });
  }
}
