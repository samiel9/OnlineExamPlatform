module.exports = function (roles = []) {
    // roles param can be a single role string (e.g., 'enseignant') 
    // or an array of roles (e.g., ['enseignant', 'admin'])
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      if (!req.user || (roles.length && !roles.includes(req.user.role))) {
        // User role not allowed
        return res.status(403).json({ msg: 'Access forbidden: Insufficient role' });
      }
      next();
    };
  };