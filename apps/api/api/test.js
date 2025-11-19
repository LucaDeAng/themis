export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
}
