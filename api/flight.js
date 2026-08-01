export default async function handler(req, res) {
  const {number} = req.query;
  if (!number) return res.status(400).json({ error: 'Missing flight number' });

  const apiRes =await fetch(
    'https://aeroboxdata.p.rapidapi.com/flights/number/${encodeURLComponent(number)}',
    {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, 
        'X-RapidAPI-Host': 'aeroboxdata.p.rapidapi.com'
      }
    }
  );
  const data = await apiRes.json();
  res.status(apiRes.status).json(data);
}
        
  
