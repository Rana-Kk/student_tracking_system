import { ApiError } from '../utils/ApiError.js'

// Last middleware in the chain (4 args = Express recognizes it as an error handler).
// Any `next(err)` call, or an error thrown/rejected inside asyncHandler, ends up here.
export default function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  // MySQL duplicate entry (e.g. UNIQUE email) -> a clean 409 instead of a raw DB error.
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'A record with this value already exists' })
  }

  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `No route: ${req.method} ${req.originalUrl}` })
}
