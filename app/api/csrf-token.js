import { csrfMiddleware } from '@/middleware/csrfMiddleware';

async function handler(req, res) {
  res.status(200).json({ csrfToken: req.csrfToken() });
}

export default csrfMiddleware(handler);
