import type { NextApiRequest, NextApiResponse } from 'next';

const TRACK_API_URL = 'https://api.binderbyte.com/v1/track';
const API_KEY = 'f2d80ed5d91868481b30d3189ae0b642af8ca5ccaae952617fe8bb7bbd3e60b3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { awb, courier } = req.query;

  // Validate query parameters
  if (typeof awb !== 'string' || typeof courier !== 'string') {
    return res.status(400).json({ status: 400, message: 'Invalid request. AWB and courier must be strings.' });
  }

  try {
    // Construct the API URL
    const apiUrl = `${TRACK_API_URL}?api_key=${API_KEY}&courier=${courier}&awb=${awb}`;
    console.log(`Fetching data from: ${apiUrl}`); // Log the API URL for debugging

    // Fetch data from the tracking API
    const response = await fetch(apiUrl);
    
    // Check if the response is okay
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return res.status(response.status).json({ status: response.status, message: 'Failed to fetch data from tracking API.' });
    }

    // Parse JSON response
    const data = await response.json();
    console.log('API response data:', data); // Log API response for debugging

    // Check for success status in the API response
    if (data.status === 200) {
      return res.status(200).json(data);
    } else {
      return res.status(data.status || 500).json(data);
    }
  } catch (error) {
    console.error('Error in track API route:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
}
