class Router {
  constructor() {
    this.routes = {
      GET: new Map(),
      POST: new Map(),
      PUT: new Map(),
      DELETE: new Map(),
    };
  }

  get(path, handler) {
    this.routes.GET.set(path, handler);
  }
  post(path, handler) {
    this.routes.POST.set(path, handler);
  }
  put(path, handler) {
    this.routes.PUT.set(path, handler);
  }
  delete(path, handler) {
    this.routes.DELETE.set(path, handler);
  }

  findHandler(method, path) {
    if (!this.routes[method]) {
      return null;
    }

    if (this.routes[method].has(path)) {
      return this.routes[method].get(path);
    }

    for (let [routePath, handler] of this.routes[method].entries()) {
      const match = this.matchPath(routePath, path);
      if (match) {
        return (req, res) => {
          req.params = match;
          return handler(req, res);
        };
      }
    }
    return null;
  }

  matchPath(routePath, requestPath) {
    const routeParts = routePath.split("/");
    const requestParts = requestPath.split("/");

    if (routeParts.length !== requestParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        const paramName = routeParts[i].slice(1);
        params[paramName] = requestParts[i];
      } else if (routeParts[i] !== requestParts[i]) {
        return null;
      }
    }
    return params;
  }

  middleware() {
    return (req, res, next) => {
      const method = req.method.toUpperCase();
      const path = req.path || req.url;
      if (!this.routes[method]) {
        return next();
      }
      const handler = this.findHandler(method, path);
      if (handler) {
        return handler(req, res);
      }
      next();
    };
  }
}

module.exports = Router;
