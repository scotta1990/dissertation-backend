exports.rolePermissions = (roles) => {
  //Checks that the user has at least one of the required roles to access the endpoint
  return (req, res, next) => {
    if (!req.user.userRole)
      return res.status(403).send("Permissions are required for access");
    const granted = roles.includes(req.user.userRole);
    if (!granted) {
      return res
        .status(403)
        .send("You do not have the correct permission to access.");
    }
    next();
  };
};
