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
    const routes = this.routes[method];
    const exactMatch = routes.get(path);
    if (exactMatch) return { handler: exactMatch };

    for (const [routePath, handler] of routes) {
      const params = this.matchPath(routePath, path);
      if (params) {
        return { handler, params };
      }
    }
    return null;
  }

  matchPath(routePath, requestPath) {
    const routeParts = routePath.split("/");
    const requestParts = requestPath.split("/");

    if (routeParts.length !== requestParts.length) return null;

    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        params[routeParts[i].slice(1)] = requestParts[i];
      } else if (routeParts[i] !== requestParts[i]) {
        return null;
      }
    }
    return params;
  }

  middleware() {
    return (req, res, next) => {
      const result = this.findHandler(req.method, req.path);
      if (result) {
        req.params = result.params;
        return result.handler(req, res, next);
      }
      next();
    };
  }
}

module.exports = Router;
