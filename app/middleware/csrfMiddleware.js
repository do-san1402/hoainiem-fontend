import csurf from 'csurf';

const csrfProtection = csurf({ cookie: true });

export function csrfMiddleware(handler) {
  return async (req, res) => {
    await csrfProtection(req, res, () => {});
    return handler(req, res);
  };
}
