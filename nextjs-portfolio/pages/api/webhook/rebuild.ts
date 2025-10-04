import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify the request is from Supabase (optional security)
  const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Log the webhook trigger
    console.log('Data changed, triggering rebuild...');
    
    // You can add logic here to trigger a GitHub Action or Vercel deployment
    // For now, just acknowledge the webhook
    
    return res.status(200).json({ 
      message: 'Webhook received',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
