
export function authMiddleware(...userRoles: string[]) {
    return (req, resp, next) => {
      const user = req.session.user;
      if (!user) {
        return resp.sendStatus(401);
      }
      const hasPermission = userRoles.some(role => {
        if (user.userRole === role) {
          return true;
        } else {
          return false;
        }
      })
      if (hasPermission) {
        next();
      } else {
        return resp.sendStatus(403);
      }
    }
  }