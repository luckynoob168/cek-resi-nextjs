import type { NextApiRequest, NextApiResponse } from 'next';

// Define the type of the response data
interface Courier {
  code: string;
  description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = 'f2d80ed5d91868481b30d3189ae0b642af8ca5ccaae952617fe8bb7bbd3e60b3';
  const url = `https://api.binderbyte.com/v1/list_courier?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ error: 'Failed to fetch couriers.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from the external API.' });
  }
}
