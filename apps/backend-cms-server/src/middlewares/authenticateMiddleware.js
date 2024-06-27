let authenticateUser = {
  isLoggedIn: async (req, res, next) => {
    if (req.session.user) {
      return next();
    } else {
      if (req.xhr) {
        return res.status(401).json({ message: 'Unauthenticated.' });
      } else {
        return res.redirect('/login');
      }
    }
  },

  guest: async (req, res, next) => {
    if (req.session.user) {
      res.redirect('/home');
    } else {
      return next();
    }
  }
};

module.exports = { authenticateUser };
