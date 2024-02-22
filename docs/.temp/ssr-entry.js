"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const server = require("react-dom/server");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const jsxRuntime__namespace = /* @__PURE__ */ _interopNamespaceDefault(jsxRuntime);
const React__namespace = /* @__PURE__ */ _interopNamespaceDefault(React);
const Fragment = jsxRuntime__namespace.Fragment;
const jsx$1 = jsxRuntime__namespace.jsx;
const jsxs$1 = jsxRuntime__namespace.jsxs;
const originJsx = jsx$1;
const originJsxs = jsxs$1;
const data = {
  islandProps: [],
  islandToPathMap: {}
};
const internalJsx = (jsx2, type, props, ...args) => {
  if (props && props.__island) {
    data.islandProps.push(props);
    const id = type.name;
    data["islandToPathMap"][id] = props.__island;
    delete props.__island;
    return jsx2("div", {
      __island: `${id}:${data.islandProps.length - 1}`,
      children: jsx2(type, props, ...args)
    });
  }
  return jsx2(type, props, ...args);
};
const jsx = (...args) => internalJsx(originJsx, ...args);
const jsxs = (...args) => internalJsx(originJsxs, ...args);
const __uno = "";
const base = "";
const vars = "";
const doc = "";
const link$1 = "_link_1ulgx_1";
const socialLinkIcon = "_socialLinkIcon_1ulgx_10";
const nav = "_nav_1ulgx_27";
const styles$7 = {
  link: link$1,
  socialLinkIcon,
  "switch": "_switch_1ulgx_19",
  nav
};
/**
 * @remix-run/router v1.15.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined")
      console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function matchRoutes(routes2, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes2);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i], decoded);
  }
  return matches;
}
function flattenRoutes(routes2, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index2, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index2,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes2.forEach((route, index2) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index2);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index2, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0)
    return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a2, b2) => a2.score !== b2.score ? b2.score - a2.score : compareIndexes(a2.routesMeta.map((meta) => meta.childrenIndex), b2.routesMeta.map((meta) => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s) => s === "*";
function computeScore(path, index2) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index2) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a2, b2) {
  let siblings = a2.length === b2.length && a2.slice(0, -1).every((n, i) => n === b2[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a2[a2.length - 1] - b2[b2.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    if (!match)
      return null;
    Object.assign(matchedParams, match.params);
    let route = meta.route;
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match)
    return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index2) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index2] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index2];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else
    ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/")
    return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
/**
 * React Router v6.22.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
const DataRouterContext = /* @__PURE__ */ React__namespace.createContext(null);
if (process.env.NODE_ENV !== "production") {
  DataRouterContext.displayName = "DataRouter";
}
const DataRouterStateContext = /* @__PURE__ */ React__namespace.createContext(null);
if (process.env.NODE_ENV !== "production") {
  DataRouterStateContext.displayName = "DataRouterState";
}
const AwaitContext = /* @__PURE__ */ React__namespace.createContext(null);
if (process.env.NODE_ENV !== "production") {
  AwaitContext.displayName = "Await";
}
const NavigationContext = /* @__PURE__ */ React__namespace.createContext(null);
if (process.env.NODE_ENV !== "production") {
  NavigationContext.displayName = "Navigation";
}
const LocationContext = /* @__PURE__ */ React__namespace.createContext(null);
if (process.env.NODE_ENV !== "production") {
  LocationContext.displayName = "Location";
}
const RouteContext = /* @__PURE__ */ React__namespace.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
if (process.env.NODE_ENV !== "production") {
  RouteContext.displayName = "Route";
}
const RouteErrorContext = /* @__PURE__ */ React__namespace.createContext(null);
if (process.env.NODE_ENV !== "production") {
  RouteErrorContext.displayName = "RouteError";
}
function useInRouterContext() {
  return React__namespace.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? process.env.NODE_ENV !== "production" ? invariant(
    false,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useLocation() may be used only in the context of a <Router> component."
  ) : invariant(false) : void 0;
  return React__namespace.useContext(LocationContext).location;
}
function useRoutes(routes2, locationArg) {
  return useRoutesImpl(routes2, locationArg);
}
function useRoutesImpl(routes2, locationArg, dataRouterState, future) {
  !useInRouterContext() ? process.env.NODE_ENV !== "production" ? invariant(
    false,
    // TODO: This error is probably because they somehow have 2 versions of the
    // router loaded. We can help them understand how to avoid that.
    "useRoutes() may be used only in the context of a <Router> component."
  ) : invariant(false) : void 0;
  let {
    navigator
  } = React__namespace.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = React__namespace.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  if (process.env.NODE_ENV !== "production") {
    let parentPath = parentRoute && parentRoute.path || "";
    warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ('"' + parentPathname + '" (under <Route path="' + parentPath + '">) but the ') + `parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

` + ('Please change the parent <Route path="' + parentPath + '"> to <Route ') + ('path="' + (parentPath === "/" ? "*" : parentPath + "/*") + '">.'));
  }
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? process.env.NODE_ENV !== "production" ? invariant(false, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, the location pathname must begin with the portion of the URL pathname that was " + ('matched by all parent routes. The current pathname base is "' + parentPathnameBase + '" ') + ('but pathname "' + parsedLocationArg.pathname + '" was given in the `location` prop.')) : invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes2, {
    pathname: remainingPathname
  });
  if (process.env.NODE_ENV !== "production") {
    process.env.NODE_ENV !== "production" ? warning(parentRoute || matches != null, 'No routes matched location "' + location.pathname + location.search + location.hash + '" ') : void 0;
    process.env.NODE_ENV !== "production" ? warning(matches == null || matches[matches.length - 1].route.element !== void 0 || matches[matches.length - 1].route.Component !== void 0 || matches[matches.length - 1].route.lazy !== void 0, 'Matched leaf route at location "' + location.pathname + location.search + location.hash + '" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.') : void 0;
  }
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterState, future);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ React__namespace.createElement(LocationContext.Provider, {
      value: {
        location: _extends({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let codeStyles = {
    padding: "2px 4px",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  if (process.env.NODE_ENV !== "production") {
    console.error("Error handled by React Router default ErrorBoundary:", error);
    devInfo = /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ React__namespace.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ React__namespace.createElement("code", {
      style: codeStyles
    }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ React__namespace.createElement("code", {
      style: codeStyles
    }, "errorElement"), " prop on your route."));
  }
  return /* @__PURE__ */ React__namespace.createElement(React__namespace.Fragment, null, /* @__PURE__ */ React__namespace.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ React__namespace.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /* @__PURE__ */ React__namespace.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /* @__PURE__ */ React__namespace.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends React__namespace.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ React__namespace.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ React__namespace.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = React__namespace.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ React__namespace.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState2;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _dataRouterState;
    if ((_dataRouterState = dataRouterState) != null && _dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = (_dataRouterState2 = dataRouterState) == null ? void 0 : _dataRouterState2.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m) => m.route.id && (errors == null ? void 0 : errors[m.route.id]));
    !(errorIndex >= 0) ? process.env.NODE_ENV !== "production" ? invariant(false, "Could not find a matching route for errors on route IDs: " + Object.keys(errors).join(",")) : invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors: errors2
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index2) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index2 === 0) {
          warningOnce("route-fallback", false, "No `HydrateFallback` element provided to render during initial hydration");
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index2) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index2 + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ React__namespace.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ React__namespace.createElement(RenderedRoute, {
        match,
        routeContext: {
          outlet,
          matches: matches2,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index2 === 0) ? /* @__PURE__ */ React__namespace.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches2,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterStateHook = /* @__PURE__ */ function(DataRouterStateHook2) {
  DataRouterStateHook2["UseBlocker"] = "useBlocker";
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook2["UseRouteId"] = "useRouteId";
  return DataRouterStateHook2;
}(DataRouterStateHook || {});
function getDataRouterConsoleError(hookName) {
  return hookName + " must be used within a data router.  See https://reactrouter.com/routers/picking-a-router.";
}
function useDataRouterState(hookName) {
  let state = React__namespace.useContext(DataRouterStateContext);
  !state ? process.env.NODE_ENV !== "production" ? invariant(false, getDataRouterConsoleError(hookName)) : invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = React__namespace.useContext(RouteContext);
  !route ? process.env.NODE_ENV !== "production" ? invariant(false, getDataRouterConsoleError(hookName)) : invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? process.env.NODE_ENV !== "production" ? invariant(false, hookName + ' can only be used on routes that contain a unique "id"') : invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteError() {
  var _state$errors;
  let error = React__namespace.useContext(RouteErrorContext);
  let state = useDataRouterState(DataRouterStateHook.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook.UseRouteError);
  if (error !== void 0) {
    return error;
  }
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}
const alreadyWarned = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
    process.env.NODE_ENV !== "production" ? warning(false, message) : void 0;
  }
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? process.env.NODE_ENV !== "production" ? invariant(false, "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.") : invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = React__namespace.useMemo(() => ({
    basename,
    navigator,
    static: staticProp,
    future: _extends({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = React__namespace.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  process.env.NODE_ENV !== "production" ? warning(locationContext != null, '<Router basename="' + basename + '"> is not able to match the URL ' + ('"' + pathname + search + hash + '" because it does not start with the ') + "basename, so the <Router> won't render anything.") : void 0;
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ React__namespace.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ React__namespace.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
new Promise(() => {
});
function B$1() {
  return /* @__PURE__ */ jsx("div", { children: "Hello, route B" });
}
const b$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: B$1
}, Symbol.toStringTag, { value: "Module" }));
function A() {
  return /* @__PURE__ */ jsx("div", { children: "Hello, route A" });
}
const a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: A
}, Symbol.toStringTag, { value: "Module" }));
function B() {
  return /* @__PURE__ */ jsx("div", { children: "Hello, route B" });
}
const b = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: B
}, Symbol.toStringTag, { value: "Module" }));
function C() {
  return /* @__PURE__ */ jsx("div", { children: "Hello, route C" });
}
const c = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: C
}, Symbol.toStringTag, { value: "Module" }));
const frontmatter$1 = void 0;
const toc$1 = [{
  "id": "框架定位",
  "text": "框架定位",
  "depth": 2
}, {
  "id": "上手体验",
  "text": "上手体验",
  "depth": 2
}, {
  "id": "优劣势分析",
  "text": "优劣势分析",
  "depth": 2
}, {
  "id": "源码实现",
  "text": "源码实现",
  "depth": 2
}, {
  "id": "小结",
  "text": "小结",
  "depth": 2
}];
function _createMdxContent$1(props) {
  const _components = Object.assign({
    h1: "h1",
    a: "a",
    p: "p",
    strong: "strong",
    h2: "h2",
    img: "img",
    div: "div",
    span: "span",
    pre: "pre",
    code: "code",
    ul: "ul",
    li: "li",
    blockquote: "blockquote"
  }, props.components);
  return jsxs$1(Fragment, {
    children: [jsxs$1(_components.h1, {
      id: "新一代全栈框架-fresh",
      children: [jsx$1(_components.a, {
        className: "header-anchor",
        href: "#新一代全栈框架-fresh",
        children: "#"
      }), "新一代全栈框架 Fresh"]
    }), "\n", jsxs$1(_components.p, {
      children: ["大家好，我是三元。今天给大家介绍一个新的框架 Fresh，由 Deno 作者出品，在最近发布了 1.0 的正式版本，宣布支持了生产环境，并且在 Github 上热度也比较高，现在是时候给大家详细地介绍一下这个方案了。接下来会从", jsx$1(_components.strong, {
        children: "框架定位"
      }), "、", jsx$1(_components.strong, {
        children: "上手体验"
      }), "、", jsx$1(_components.strong, {
        children: "优劣势评估"
      }), "和", jsx$1(_components.strong, {
        children: "源码实现"
      }), "这几个方面来给大家深入解读 Fresh 框架。"]
    }), "\n", jsxs$1(_components.h2, {
      id: "框架定位",
      children: [jsx$1(_components.a, {
        className: "header-anchor",
        href: "#框架定位",
        children: "#"
      }), "框架定位"]
    }), "\n", jsxs$1(_components.p, {
      children: ["首先，从定位上来看，Fresh 属于 ", jsx$1(_components.strong, {
        children: "Web 全栈开发框架"
      }), "。是不是对于这个词非常眼熟呢？相信你已经想到了，像现在大名鼎鼎的 Next.js 以及新出的 Remix 都是走的这个路线。那么作为 Next.js 和 Remix 的竞品， Fresh 有哪些值得一提的亮点，或者说有哪些差异点呢？主要包括如下的几个方面:"]
    }), "\n", jsx$1(_components.p, {
      children: "首先，Fresh 基于 Deno 运行时，由 Deno 原班人马开发，享有 Deno 一系列工具链和生态的优势，比如内置的测试工具、支持 http import 等等。"
    }), "\n", jsx$1(_components.p, {
      children: "其次是渲染性能方面，Fresh 整体采用 Islands 架构(之前介绍的 Astro 也是类似)，实现了客户端按需 Hydration，有一定的渲染性能优势。"
    }), "\n", jsx$1(_components.p, {
      children: "当然，还有一个比较出色的点是构建层做到了 Bundle-less，即应用代码不需要打包即可直接部署上线，后文会介绍这部分的具体实现。"
    }), "\n", jsx$1(_components.p, {
      children: "最后，不同于 Next.js 和 Remix，Fresh 的前端渲染层由 Preact 完成，包括 Islands 架构的实现也是基于 Preact，且不支持其它前端框架。"
    }), "\n", jsxs$1(_components.h2, {
      id: "上手体验",
      children: [jsx$1(_components.a, {
        className: "header-anchor",
        href: "#上手体验",
        children: "#"
      }), "上手体验"]
    }), "\n", jsx$1(_components.p, {
      children: "在使用 Fresh 之前，需要在机器上先安装 Deno:"
    }), "\n", jsx$1(_components.p, {
      children: jsx$1(_components.img, {
        src: "https://www.denojs.cn/img/logo.png",
        alt: "deno"
      })
    }), "\n", jsxs$1(_components.p, {
      children: ["如何没有安装的话可以先去 Deno 官方安装一下: ", jsx$1(_components.a, {
        href: "https://deno.land/%E3%80%82",
        children: "https://deno.land/。"
      })]
    }), "\n", jsx$1(_components.p, {
      children: "接下来可以输入如下的命令初始化项目:"
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "deno"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " run"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " -"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "A"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " -"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "r"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " https"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "//fresh.deno.dev my-project"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsx$1(_components.p, {
      children: jsx$1(_components.img, {
        src: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/182e83f8877340b3ae35030aee6cd776~tplv-k3u1fbpfcp-zoom-1.image",
        alt: ""
      })
    }), "\n", jsxs$1(_components.p, {
      children: ["项目的工程化脚本在 ", jsx$1(_components.code, {
        children: "deno.json"
      }), " 文件中:"]
    }), "\n", jsxs$1(_components.div, {
      className: "language-json",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "json"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: '  "'
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: "tasks"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: '"'
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "    // -A 表示允许 Deno 读取环境变量"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: '    "'
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: "start"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: '"'
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ' "'
            }), jsx$1(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "deno run -A --watch=static/,routes/ dev.ts"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: '"'
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "  },"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: '  "'
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: "importMap"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: '"'
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ' "'
            }), jsx$1(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "./import_map.json"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: '"'
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsxs$1(_components.p, {
      children: ["接下来你可以执行", jsx$1(_components.code, {
        children: "deno task start"
      }), " 命令启动项目:"]
    }), "\n", jsx$1(_components.p, {
      children: jsx$1(_components.img, {
        src: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0162891907e2416e900c12d3309dfca5~tplv-k3u1fbpfcp-zoom-1.image",
        alt: ""
      })
    }), "\n", jsx$1(_components.p, {
      children: "终端里面显示 Fresh 从文件目录中扫描出了 3 个路由和 1 个 island 组件，我们可以来观察一下项目的目录结构:"
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "README"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "md"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "components"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "│   └── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "Button"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "tsx"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "deno"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "json"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "dev"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "ts"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "fresh"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "gen"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "ts"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "import_map"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "json"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "islands"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "│   └── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "Counter"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "tsx"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "main"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "ts"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "routes"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "│   ├── ["
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "name"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "]"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "tsx"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "│   ├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "api"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "│   │   └── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "joke"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "ts"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "│   └── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "index"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "tsx"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "static"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "│   ├── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "favicon"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "ico"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "│   └── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "logo"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "svg"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "└── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "utils"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "    └── "
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "twind"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "ts"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsxs$1(_components.p, {
      children: ["你可以关注 ", jsx$1(_components.code, {
        children: "routes"
      }), " 和 ", jsx$1(_components.code, {
        children: "islands"
      }), " 两个目录，", jsx$1(_components.code, {
        children: "[name].tsx"
      }), "、", jsx$1(_components.code, {
        children: "api/joke.ts"
      }), " 和 ", jsx$1(_components.code, {
        children: "index.tsx"
      }), " 分别对应三个路由，而 islands 目录下的每个文件则对应一个 island 组件。"]
    }), "\n", jsx$1(_components.p, {
      children: "而开发者并不需要手写路由文件，Fresh 可以自动地生成服务端的路由到文件的映射关系。很明显 Fresh 实现了约定式路由的功能，跟 Next.js 类似。"
    }), "\n", jsxs$1(_components.p, {
      children: ["每个 ", jsx$1(_components.code, {
        children: "island 组件"
      }), "需要有一个 default 导出，用来将组件暴露出去，使用比较简单，就不展开介绍了。而", jsx$1(_components.code, {
        children: "路由组件"
      }), "则更加灵活，既可以作为一个 API 服务，也可以作为一个组件进行渲染。接下来，我们以脚手架项目的几个文件示例来分析一下。"]
    }), "\n", jsxs$1(_components.p, {
      children: ["首先是 ", jsx$1(_components.code, {
        children: "api/joke.ts"
      }), " 文件，这个文件的作用是提供服务端的数据接口，并不承载任何的前端渲染逻辑，你只需要在这个文件里面编写一个 handler 函数即可，如下代码所示:"]
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "// api/joke.ts"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "import"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " HandlerContext"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " }"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " from"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " '"
            }), jsx$1(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "$fresh/server.ts"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line"
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " JOKES"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " ["
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "  // 省略具体内容"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "]"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "export"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " const"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "_req"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " Request"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " _ctx"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " HandlerContext"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " Response"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " =>"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "  // 随机返回一个 joke 字符串"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "  return"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " new"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " Response"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "body"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsxs$1(_components.p, {
      children: ["当你访问", jsx$1(_components.code, {
        children: "/api/joke"
      }), " 路由时，可以拿到 handler 返回的数据:"]
    }), "\n", jsx$1(_components.p, {
      children: jsx$1(_components.img, {
        src: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f41639defbb842218737a1e45b63cf29~tplv-k3u1fbpfcp-zoom-1.image",
        alt: ""
      })
    }), "\n", jsxs$1(_components.p, {
      children: ["接下来是", jsx$1(_components.code, {
        children: "index.tsx"
      }), "和", jsx$1(_components.code, {
        children: "[name].tsx"
      }), " 两个文件，第一个文件对应根路由即", jsx$1(_components.code, {
        children: "/"
      }), "，访问效果如下:"]
    }), "\n", jsx$1(_components.p, {
      children: jsx$1(_components.img, {
        src: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c21b54e64a545a684329e2e0fa7a656~tplv-k3u1fbpfcp-zoom-1.image",
        alt: ""
      })
    }), "\n", jsx$1(_components.p, {
      children: "后者则为动态路由，可以拿到路由传参进行渲染:"
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "export"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " default"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " function"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " Greet"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "props"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " PageProps"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "  return"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " <"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: "div"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ">"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "Hello"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "props.params."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "name"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "</"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "div"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ">"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsx$1(_components.p, {
      children: "访问效果如下:"
    }), "\n", jsx$1(_components.p, {
      children: jsx$1(_components.img, {
        src: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/660c0eade8f14e5c96806cbcc81d95a6~tplv-k3u1fbpfcp-zoom-1.image",
        alt: ""
      })
    }), "\n", jsx$1(_components.p, {
      children: "同时，你也可以在路由组件同时编写前端组件和 handler 函数，如下代码所示:"
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "// 修改 [name].tsx 的内容如下"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "/** "
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "@"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "jsx"
            }), jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: " h */"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "import"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " h"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " }"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " from"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " '"
            }), jsx$1(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "preact"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "import"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " HandlerContext"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " PageProps"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " }"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " from"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " '"
            }), jsx$1(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "$fresh/server.ts"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line"
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "export"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " function"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "req"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " Request"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " ctx"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " HandlerContext"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "  const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " title"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " '"
            }), jsx$1(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "一些标题数据"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "  return"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " ctx"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "render"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " title"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " }"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "export"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " default"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " function"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " Greet"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "props"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " PageProps"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "  return"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " <"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: "div"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ">"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "获取数据"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ": "
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "props.data."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "title"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "</"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "div"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ">"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsx$1(_components.p, {
      children: "从 handler 的第二个参数(ctx 对象)中，我们可以取出 render 方法，传入组件需要的数据，手动调用完成渲染。效果如下:"
    }), "\n", jsx$1(_components.p, {
      children: jsx$1(_components.img, {
        src: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18e6ffe5b23d4e7cbeb1a2140750dd47~tplv-k3u1fbpfcp-zoom-1.image",
        alt: ""
      })
    }), "\n", jsxs$1(_components.p, {
      children: ["以上我们就体验了 Fresh 的几个核心的功能，包括", jsx$1(_components.code, {
        children: "项目初始化"
      }), "、", jsx$1(_components.code, {
        children: "路由组件开发"
      }), "、", jsx$1(_components.code, {
        children: "服务端接口开发"
      }), "、", jsx$1(_components.code, {
        children: "组件数据获取"
      }), "以及", jsx$1(_components.code, {
        children: "约定式路由"
      }), "，相信从中你也能体会到 Fresh 的简单与强大了。"]
    }), "\n", jsxs$1(_components.h2, {
      id: "优劣势分析",
      children: [jsx$1(_components.a, {
        className: "header-anchor",
        href: "#优劣势分析",
        children: "#"
      }), "优劣势分析"]
    }), "\n", jsx$1(_components.p, {
      children: "那么，就如 Fresh 官网所说，Fresh 能否成为下一代 Web 全栈框架呢？"
    }), "\n", jsx$1(_components.p, {
      children: jsx$1(_components.img, {
        src: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27f3abeffd484428bba392ce5d83f559~tplv-k3u1fbpfcp-zoom-1.image",
        alt: ""
      })
    }), "\n", jsx$1(_components.p, {
      children: "我们不妨来盘点一下 Fresh 的优势和不足。"
    }), "\n", jsx$1(_components.p, {
      children: "使用 Fresh 的优势可以总结如下:"
    }), "\n", jsxs$1(_components.ul, {
      children: ["\n", jsxs$1(_components.li, {
        children: ["\n", jsx$1(_components.p, {
          children: "享受 Deno 带来的开发优势，从安装依赖、开发、测试、部署直接使用 Deno 的工具链，降低工程化的成本；"
        }), "\n"]
      }), "\n", jsxs$1(_components.li, {
        children: ["\n", jsx$1(_components.p, {
          children: "基于 Island 架构，带来更小的客户端运行时开销，渲染性能更好；"
        }), "\n"]
      }), "\n", jsxs$1(_components.li, {
        children: ["\n", jsx$1(_components.p, {
          children: "无需打包即可开发、部署应用，带来更少的构建成本，更加轻量；"
        }), "\n"]
      }), "\n"]
    }), "\n", jsx$1(_components.p, {
      children: "而劣势也比较明显，包含如下的几个方面:"
    }), "\n", jsxs$1(_components.ul, {
      children: ["\n", jsxs$1(_components.li, {
        children: ["\n", jsx$1(_components.p, {
          children: "仅支持 Preact 框架，不支持 React，这一点是比较致命的；"
        }), "\n"]
      }), "\n", jsxs$1(_components.li, {
        children: ["\n", jsx$1(_components.p, {
          children: "由于架构的原因，开发阶段没有 HMR 的能力，只能 page reload；"
        }), "\n"]
      }), "\n", jsxs$1(_components.li, {
        children: ["\n", jsxs$1(_components.p, {
          children: ["对于 Island 组件，必须要放到 islands 目录，对于比较复杂的应用而言，", jsx$1("span", {
            "data-word-id": "53156824",
            children: "心智"
          }), "负担会比较重，而 Astro 在这一方面要做的更优雅一些，通过组件指令即可指定 island 组件，如", jsx$1(_components.code, {
            children: "<Component client:load />"
          }), "。"]
        }), "\n"]
      }), "\n"]
    }), "\n", jsx$1(_components.p, {
      children: "一方面 Fresh 能解决的问题，如 Hydration 性能问题，其它的框架也能解决(Astro)，并且比它做的更好，另一方面 Fresh 的部分劣势也比较致命，况且 Deno 如今也很难做到真正地普及，所以我认为 Fresh 并不是一个未来能够大范围流行的 Web 框架，但对于 Deno 和 Preact 的用户而言，我认为 Fresh 足以撼动 Next.js 这类框架原有的地位。"
    }), "\n", jsxs$1(_components.h2, {
      id: "源码实现",
      children: [jsx$1(_components.a, {
        className: "header-anchor",
        href: "#源码实现",
        children: "#"
      }), "源码实现"]
    }), "\n", jsx$1(_components.p, {
      children: "Fresh 的内部实现并不算特别复杂，虽然说我们并一定用的上 Fresh，但我觉得 Fresh 的代码还是值得一读的，从中可以学习到不少东西。"
    }), "\n", jsxs$1(_components.blockquote, {
      children: ["\n", jsxs$1(_components.p, {
        children: ["Github 地址: ", jsx$1(_components.a, {
          href: "https://github.com/denoland/fresh",
          children: "https://github.com/denoland/fresh"
        })]
      }), "\n"]
    }), "\n", jsxs$1(_components.p, {
      children: ["你可以先去仓库 examples/counter 查看示例项目，通过 ", jsx$1(_components.code, {
        children: "deno task start"
      }), " 命令启动。入口文件为", jsx$1(_components.code, {
        children: "dev.ts"
      }), "，其中会调用 Fresh 进行路由文件和 islands 文件的搜集，生成 Manifest 信息。"]
    }), "\n", jsxs$1(_components.p, {
      children: ["接下来进入核心环节——创建 Server，具体逻辑在", jsx$1(_components.code, {
        children: "server/mod.ts"
      }), "中:"]
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "export"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " async"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " function"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " start"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "routes"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " Manifest"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " opts"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " StartOptions"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {})"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "  const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " ctx"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " await"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " ServerContext"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "fromManifest"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "routes"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " opts"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "  await"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " serve"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "ctx"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "()"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " opts"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsxs$1(_components.p, {
      children: [jsx$1(_components.code, {
        children: "fromManifest"
      }), "为一个工厂方法，目的是根据之前扫描到的 Manifest 信息生成服务端上下文对象(ServerContext)，因此 Server 的实现核心也就在于 ServerContext:"]
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "class"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " ServerContext"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "  static"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " async"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " fromManifest"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "manifest"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " Manifest"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " opts"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " FreshOptions"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "    // 省略中间的处理逻辑"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "    return"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " new"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " ServerContext"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "()"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "  }"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsx$1(_components.p, {
      children: "fromManifest 实际上就是进一步处理(normalize) manifest 信息，生成 Route 对象和 Island 对象，以供 ServerContext 的实例初始化。"
    }), "\n", jsx$1(_components.p, {
      children: "接下来，Fresh 会调用 ServerContext 的 handler 方法，交给标准库 http/server 的 serve 方法进行调用。因此，handler 方法也是整个服务端的核心实现，其中有两大主要的实现部分:"
    }), "\n", jsxs$1(_components.ul, {
      children: ["\n", jsxs$1(_components.li, {
        children: ["\n", jsxs$1(_components.p, {
          children: ["中间件机制的实现，也就是实现洋葱模型，具体逻辑在私有方法", jsx$1(_components.code, {
            children: "#composeMiddlewares"
          }), "中；"]
        }), "\n"]
      }), "\n", jsxs$1(_components.li, {
        children: ["\n", jsxs$1(_components.p, {
          children: ["页面渲染逻辑的实现，在私有方法", jsx$1(_components.code, {
            children: "#handlers()"
          }), "中。"]
        }), "\n"]
      }), "\n"]
    }), "\n", jsxs$1(_components.p, {
      children: ["前者不是本文的重点，感兴趣的同学可以在看完文章后继续研究。这里我们主要关注页面渲染的逻辑是如何实现的，", jsx$1(_components.code, {
        children: "#handlers()"
      }), "方法中定义了几乎所有路由的处理逻辑，包括", jsx$1(_components.code, {
        children: "路由组件渲染"
      }), "、", jsx$1(_components.code, {
        children: "404 组件渲染"
      }), "、", jsx$1(_components.code, {
        children: "Error 组件渲染"
      }), "、", jsx$1(_components.code, {
        children: "静态资源加载"
      }), "等等逻辑，我们可以把目光集中在", jsx$1(_components.code, {
        children: "路由组件渲染"
      }), "中，主要是这段逻辑:"]
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "for"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "const"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " ["
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "method"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "]"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " of"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " Object"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "entries"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "route"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")) "
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "  routes"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "["
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "`${"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "method"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            }), jsx$1(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "@"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "${"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "route"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "pattern"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}`"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "] "
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "="
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "req"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " ctx"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " params"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " =>"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "    handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "req"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "      ..."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "ctx"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "      params"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "      render"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " createRender"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "req"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " params"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "      renderNotFound"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " createUnknownRender"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "req"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {}"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "    }"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsxs$1(_components.p, {
      children: ["而在路由对象", jsx$1(_components.code, {
        children: "normalize"
      }), "的过程(即", jsx$1(_components.code, {
        children: "fromManifest"
      }), " 方法)中，route.handler 的默认实现为:"]
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "let"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " }"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " module"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " as"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " RouteModule"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ??="
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {}"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "if"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "component"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " &&"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " typeof"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ==="
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " '"
            }), jsx$1(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "object"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " &&"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "GET"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ==="
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " undefined"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ") "
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "  // 划重点！"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "  handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "GET"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "_req"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " render"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " })"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " =>"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " render"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "()"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " route"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " Route"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "  pattern"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "  url"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "  name"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "  component"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "  handler"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "  csp"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " Boolean"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "config"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "?."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "csp"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ??"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " false"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsx$1(_components.p, {
      children: "因此，对于路由组件的处理最后都会进入 render 函数中，我们不妨来看看 render 函数是如何被创建的:"
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "// 简化后的代码"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "const"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " genRender"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "route"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " status"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " =>"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "  return"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " async"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "req"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " params"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " error"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " =>"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "    return"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " async"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "data"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " =>"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "      // 执行渲染逻辑"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "      const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " resp"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " await"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " internalRender"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "()"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "      const"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " ["
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "body"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "]"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " resp"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "      return"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " new"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " Response"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "body"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "    }"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "  }"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " createRender"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " genRender"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "route"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " Status"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "OK"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsx$1(_components.p, {
      children: "生成 render 函数这块逻辑个人认为比较抽象，需要静下心来理清各个函数的调用顺序，理解难度并不大。我们还是把关注点放到核心的渲染逻辑上，主要是 internalRender 函数的实现:"
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "import"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " render"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " as"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " internalRender"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " }"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " from"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " '"
            }), jsx$1(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "./render.tsx"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsxs$1(_components.p, {
      children: ["你可以去 ", jsx$1(_components.code, {
        children: "render.tsx"
      }), " 进一步阅读，这个文件主要做了如下的事情:"]
    }), "\n", jsxs$1(_components.ul, {
      children: ["\n", jsxs$1(_components.li, {
        children: ["\n", jsx$1(_components.p, {
          children: "记录项目中声明的所有 Islands 组件。"
        }), "\n"]
      }), "\n", jsxs$1(_components.li, {
        children: ["\n", jsx$1(_components.p, {
          children: "拦截 Preact 中 vnode 的创建逻辑，目的是为了匹配之前记录的 Island 组件，如果能匹配上，则记录 Island 组件的 props 信息，并将组件用 <!--frsh-id 值:数字--> 的注释标签来包裹，id 值为 Island 的 id，数字为该 Island 的 props 在全局 props 列表中的位置，方便 hydrate 的时候能够找到对应组件的 props。"
        }), "\n"]
      }), "\n", jsxs$1(_components.li, {
        children: ["\n", jsx$1(_components.p, {
          children: "调用 Preact 的 renderToString 方法将组件渲染为 HTML 字符串。"
        }), "\n"]
      }), "\n", jsxs$1(_components.li, {
        children: ["\n", jsx$1(_components.p, {
          children: "向 HTML 中注入客户端 hydrate 的逻辑。"
        }), "\n"]
      }), "\n", jsxs$1(_components.li, {
        children: ["\n", jsx$1(_components.p, {
          children: "拼接完整的 HTML，返回给前端。"
        }), "\n"]
      }), "\n"]
    }), "\n", jsxs$1(_components.p, {
      children: ["值得注意的是客户端 hydrate 方法的实现，传统的 ", jsx$1("span", {
        "data-word-id": "44772760",
        children: "SSR"
      }), " 一般都是直接对根节点调用 hydrate，而在 Islands 架构中，Fresh 对每个 Island 进行独立渲染，实现如下:"]
    }), "\n", jsxs$1(_components.blockquote, {
      children: ["\n", jsx$1(_components.p, {
        children: "hydrate 方法名也可以叫 revive"
      }), "\n"]
    }), "\n", jsxs$1(_components.div, {
      className: "language-ts",
      children: [jsx$1(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx$1(_components.pre, {
        className: "shiki nord",
        style: {
          backgroundColor: "#2e3440ff",
          color: "#d8dee9ff"
        },
        tabIndex: "0",
        children: jsxs$1(_components.code, {
          children: [jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "export"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " function"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " revive"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "islands"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " Record"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "<"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: "string"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " ComponentType"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ">,"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " props"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " any"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "[]"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "  function"
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: " walk"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " Node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " |"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " null"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " {"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "    // 1. 获取注释节点信息，解析出 Island 的 id"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "    const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " tag"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "      node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "!"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "nodeType"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ==="
            }), jsx$1(_components.span, {
              style: {
                color: "#B48EAD"
              },
              children: " 8"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " &&"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "      (("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " as"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " Comment"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "data"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "match"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "/"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "^"
            }), jsx$1(_components.span, {
              style: {
                color: "#EBCB8B"
              },
              children: "\\s"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "*"
            }), jsx$1(_components.span, {
              style: {
                color: "#EBCB8B"
              },
              children: "frsh-"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#EBCB8B"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "*"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ")"
            }), jsx$1(_components.span, {
              style: {
                color: "#EBCB8B"
              },
              children: "\\s"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "*$"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "/"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ") "
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "||"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " [])["
            }), jsx$1(_components.span, {
              style: {
                color: "#B48EAD"
              },
              children: "1"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "]"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "    let"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " endNode"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " Node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " |"
            }), jsx$1(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: " null"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " null"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "    if"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "tag"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ") "
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "      const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " startNode"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "!"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "      const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " children"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " []"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "      const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " parent"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "!"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "parentNode"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "      // 拿到当前 Island 节点的所有子节点"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "      while"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " (("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "!"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "nextSibling"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ") "
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "&&"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " node"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "nodeType"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " !=="
            }), jsx$1(_components.span, {
              style: {
                color: "#B48EAD"
              },
              children: " 8"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ") "
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "        children"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "push"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "node"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "      }"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "      startNode"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "parentNode"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "!"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "removeChild"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "startNode"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ") "
            }), jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "// remove start tag node"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line"
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "      const"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: " ["
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "id"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " n"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "]"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " tag"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "split"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            }), jsx$1(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: ":"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "      // 2. 单独渲染 Island 组件"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "      render"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "h"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "islands"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "["
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "id"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "]"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " props"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "["
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "Number"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "n"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")])"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ","
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " htmlElement"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "      endNode"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " node"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "    }"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "    // 3. 继续遍历 DOM 树，直到找到所有的 Island 节点"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "    const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " sib"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "!"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "nextSibling"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "    const"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " fc"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: " ="
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: " node"
            }), jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "!"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "firstChild"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "    if"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "endNode"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ") "
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "      endNode"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "parentNode"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "?."
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "removeChild"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "endNode"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ") "
            }), jsx$1(_components.span, {
              style: {
                color: "#616E88"
              },
              children: "// remove end tag node"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "    }"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "    if"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "sib"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ") "
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "walk"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "sib"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "    if"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " ("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "fc"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ") "
            }), jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "walk"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "fc"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "  }"
            })
          }), "\n", jsxs$1(_components.span, {
            className: "line",
            children: [jsx$1(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "  walk"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "("
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "document"
            }), jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "."
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "body"
            }), jsx$1(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: ")"
            })]
          }), "\n", jsx$1(_components.span, {
            className: "line",
            children: jsx$1(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx$1(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsx$1(_components.p, {
      children: "至此，服务端和客户端渲染的过程都完成了，回头看整个过程，为什么说 Fresh 的构建过程是 Bundle-less 的呢？"
    }), "\n", jsx$1(_components.p, {
      children: "我们不妨关注一下 Islands 组件是如何加载到客户端的。"
    }), "\n", jsx$1(_components.p, {
      children: jsx$1(_components.img, {
        src: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a689f0f22b574298a9a9bde98a61681e~tplv-k3u1fbpfcp-zoom-1.image",
        alt: ""
      })
    }), "\n", jsxs$1(_components.p, {
      children: ["首先，服务端通过拦截 vnode 实现可以感知到项目中用到了哪些 Island 组件，比如 Counter 组件，那么服务端就会注入对应的 import 代码，并挂在到全局，通过 ", jsx$1(_components.code, {
        children: '<script type="module">'
      }), " 的方式注入到 HTML 中。"]
    }), "\n", jsxs$1(_components.p, {
      children: ["浏览器执行这些代码时，会给服务端发起", jsx$1(_components.code, {
        children: "/islands/Counter"
      }), "的请求，服务端接收到请求，对 Counter 组件进行实时编译打包，然后将结果返回给浏览器，这样浏览器就能拿到 Esbuild 的编译产物并执行了。"]
    }), "\n", jsxs$1(_components.p, {
      children: ["所以这个过程是", jsx$1(_components.strong, {
        children: "完全发生在运行时"
      }), "的，也就是说，我们不需要在一开始启动项目的时候就打包完所有的组件，而是在运行时做到按需构建，并且得益于 Esbuild 极快的构建速度，一般能达到毫秒级别的构建速度，对于服务来说运行时的压力并不大。"]
    }), "\n", jsxs$1(_components.h2, {
      id: "小结",
      children: [jsx$1(_components.a, {
        className: "header-anchor",
        href: "#小结",
        children: "#"
      }), "小结"]
    }), "\n", jsxs$1(_components.p, {
      children: ["以上就是本文的全部内容，分别从", jsx$1(_components.strong, {
        children: "框架定位"
      }), "、", jsx$1(_components.strong, {
        children: "上手体验"
      }), "、", jsx$1(_components.strong, {
        children: "优劣势评估"
      }), "和", jsx$1(_components.strong, {
        children: "源码实现"
      }), "来介绍了如今比较火的 Fresh 框架。"]
    }), "\n", jsxs$1(_components.p, {
      children: ["最后需要跟大家说明的是，Fresh 中关于 Islands 架构的实现是基于 Preact 的，我本人也借鉴了 Fresh 的思路，通过拦截 React.createElement 方法在 React 当中也实现了 Islands 架构，代码放在了 ", jsx$1(_components.code, {
        children: "react-islands"
      }), "仓库中(地址: ", jsx$1(_components.a, {
        href: "https://github.com/sanyuan0704/react-islands)%EF%BC%8C%E4%BB%A3%E7%A0%81%E4%B8%8D%E5%A4%9A%EF%BC%8C%E7%9B%B8%E5%BD%93%E4%BA%8E",
        children: "https://github.com/sanyuan0704/react-islands)，代码不多，相当于"
      }), " Fresh 的简化版，感兴趣的小伙伴可以拉下来看看~"]
    })]
  });
}
function MDXContent$1(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx$1(MDXLayout, Object.assign({}, props, {
    children: jsx$1(_createMdxContent$1, props)
  })) : _createMdxContent$1(props);
}
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent$1,
  frontmatter: frontmatter$1,
  toc: toc$1
}, Symbol.toStringTag, { value: "Module" }));
const frontmatter = {
  "pageType": "home",
  "hero": {
    "name": "Island",
    "text": "基于 Vite & MDX 语法的静态站点生成器",
    "tagline": "简单、强大、高性能的现代化 SSG 方案",
    "image": {
      "src": "/island.png",
      "alt": "Island"
    },
    "actions": [{
      "theme": "brand",
      "text": "快速开始",
      "link": "/zh/guide/getting-started"
    }, {
      "theme": "alt",
      "text": "GitHub 地址",
      "link": "https://github.com/whale2002/ssg"
    }]
  },
  "features": [{
    "title": "Vite: 极速的开发响应速度",
    "details": "基于 Vite 构建，开发时的响应速度极快，即时的热更新，带给你极致的开发体验。",
    "icon": "🚀"
  }, {
    "title": "MDX: Markdown & React 组件来写内容",
    "details": "MDX 是一种强大的方式来写内容。你可以在 Markdown 中使用 React 组件。",
    "icon": "📦"
  }, {
    "title": "孤岛架构: 更高的生产性能",
    "details": "采用 Islands 架构，意味着更少的 JavaScript 代码、局部 hydration， 从而带来更好的首屏性能。",
    "icon": "✨"
  }, {
    "title": "功能丰富: 一站式解决方案",
    "details": "对全文搜索、国际化等常见功能可以做到开箱即用。",
    "icon": "🛠️"
  }, {
    "title": "TypeScript: 优秀的类型支持",
    "details": "使用 TypeScript 编写，提供了优秀的类型支持，让你的开发更加顺畅。",
    "icon": "🔑"
  }, {
    "title": "扩展性强: 提供多种自定义能力",
    "details": "通过其扩展机制，你可以轻松的扩展 Island 的主题 UI 和构建能力。",
    "icon": "🎨"
  }]
};
const toc = [];
function _createMdxContent(props) {
  return jsx$1(Fragment, {});
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx$1(MDXLayout, Object.assign({}, props, {
    children: jsx$1(_createMdxContent, props)
  })) : _createMdxContent();
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MDXContent,
  frontmatter,
  toc
}, Symbol.toStringTag, { value: "Module" }));
const routes = [
  { path: "/b", element: React.createElement(B$1), preload: () => Promise.resolve().then(() => b$1) },
  { path: "/guide/a", element: React.createElement(A), preload: () => Promise.resolve().then(() => a) },
  { path: "/guide/b", element: React.createElement(B), preload: () => Promise.resolve().then(() => b) },
  { path: "/guide/c", element: React.createElement(C), preload: () => Promise.resolve().then(() => c) },
  { path: "/guide/", element: React.createElement(MDXContent$1), preload: () => Promise.resolve().then(() => index$1) },
  { path: "/", element: React.createElement(MDXContent), preload: () => Promise.resolve().then(() => index) }
];
const Content = () => {
  const routeElement = useRoutes(routes);
  return routeElement;
};
const DataContext = React.createContext({});
const usePageData = () => React.useContext(DataContext);
const check = "_check_7ce45_15";
const icon = "_icon_7ce45_30";
const dark = "_dark_7ce45_26";
const sun = "_sun_7ce45_50";
const moon = "_moon_7ce45_53";
const styles$6 = {
  "switch": "_switch_7ce45_1",
  check,
  icon,
  dark,
  sun,
  moon
};
const APPEARANCE_KEY = "appearance";
const setClassList = (isDark = false) => {
  const classList = document.documentElement.classList;
  if (isDark) {
    classList.add("dark");
  } else {
    classList.remove("dark");
  }
};
const updateAppearance = () => {
  const userPreference = localStorage.getItem(APPEARANCE_KEY);
  setClassList(userPreference === "dark");
};
if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
  updateAppearance();
}
function toggle() {
  const classList = document.documentElement.classList;
  if (classList.contains("dark")) {
    setClassList(false);
    localStorage.setItem(APPEARANCE_KEY, "light");
  } else {
    setClassList(true);
    localStorage.setItem(APPEARANCE_KEY, "dark");
  }
}
function Switch(props) {
  return /* @__PURE__ */ jsx("button", { className: `${styles$6.switch} ${props.className}`, id: props.id ?? "", type: "button", role: "switch", ...props.onClick ? {
    onClick: props.onClick
  } : {}, children: /* @__PURE__ */ jsx("span", { className: styles$6.check, children: /* @__PURE__ */ jsx("span", { className: styles$6.icon, children: props.children }) }) });
}
function SwitchAppearance() {
  return /* @__PURE__ */ jsxs(Switch, { onClick: toggle, children: [
    /* @__PURE__ */ jsx("div", { className: styles$6.sun, children: /* @__PURE__ */ jsx("div", { className: "i-carbon-sun", w: "full", h: "full" }) }),
    /* @__PURE__ */ jsx("div", { className: styles$6.moon, children: /* @__PURE__ */ jsx("div", { className: "i-carbon-moon", w: "full", h: "full" }) })
  ] });
}
function MenuItem({
  item
}) {
  return /* @__PURE__ */ jsx("div", { className: "text-sm font-medium mx-3", children: /* @__PURE__ */ jsx("a", { href: item.link, className: styles$7.link, children: item.text }) });
}
function Nav() {
  const {
    siteData: siteData2
  } = usePageData();
  const nav2 = siteData2.themeConfig.nav || [];
  return /* @__PURE__ */ jsx("header", { fixed: "~", pos: "t-0 l-0", w: "full", z: "10", children: /* @__PURE__ */ jsxs("div", { flex: "~", items: "center", justify: "between", className: `${styles$7.nav} h-14 divider-bottom`, children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("a", { href: "/", hover: "opacity-60", className: "w-full h-full text-1rem font-semibold flex items-center", children: "Island.js" }) }),
    /* @__PURE__ */ jsxs("div", { flex: "~", children: [
      /* @__PURE__ */ jsx("div", { flex: "~", children: nav2.map((item) => /* @__PURE__ */ jsx(MenuItem, { item }, item.text)) }),
      /* @__PURE__ */ jsx("div", { className: styles$7.switch, flex: "~", children: /* @__PURE__ */ jsx(SwitchAppearance, {}) }),
      /* @__PURE__ */ jsx("div", { className: styles$7.socialLinkIcon, ml: "2", children: /* @__PURE__ */ jsx("a", { href: "/", children: /* @__PURE__ */ jsx("div", { className: "i-carbon-logo-github w-5 h-5 fill-current" }) }) })
    ] })
  ] }) });
}
const clip = "_clip_1185e_1";
const styles$5 = {
  clip
};
const link = "_link_umwp1_1";
const styles$4 = {
  link
};
const EXTERNAL_URL_RE = /^https?/;
function Link(props) {
  const {
    href = "/",
    children,
    className = ""
  } = props;
  const isExternal = EXTERNAL_URL_RE.test(href);
  const target = isExternal ? "_blank" : "";
  const rel = isExternal ? "noopener noreferrer" : void 0;
  return /* @__PURE__ */ jsx("a", { href, target, rel, className: `${styles$4.link} ${className}`, children });
}
const button = "_button_1dsim_1";
const medium = "_medium_1dsim_12";
const big = "_big_1dsim_18";
const brand = "_brand_1dsim_24";
const alt = "_alt_1dsim_40";
const styles$3 = {
  button,
  medium,
  big,
  brand,
  alt
};
function Button(props) {
  const {
    theme = "brand",
    size = "big",
    href = "/",
    external = false,
    className = ""
  } = props;
  let type = null;
  if (props.type === "button") {
    type = "button";
  } else if (props.type === "a") {
    type = external ? "a" : Link;
  }
  return React.createElement(type ?? "a", {
    className: `${styles$3.button} ${styles$3[theme]} ${styles$3[size]} ${className}`,
    href
  }, props.text);
}
function HomeHero(props) {
  const {
    hero
  } = props;
  return /* @__PURE__ */ jsx("div", { m: "auto", p: "t-20 x-16 b-16", children: /* @__PURE__ */ jsxs("div", { flex: "~", className: "max-w-1152px", m: "auto", children: [
    /* @__PURE__ */ jsxs("div", { text: "left", flex: "~ col", className: "max-w-592px", children: [
      /* @__PURE__ */ jsx("h1", { font: "bold", text: "6xl", className: "max-w-576px", children: /* @__PURE__ */ jsx("span", { className: styles$5.clip, children: hero.name }) }),
      /* @__PURE__ */ jsx("p", { text: "6xl", font: "bold", className: "max-w-576px", children: hero.text }),
      /* @__PURE__ */ jsx("p", { p: "t-3", text: "2xl text-2", font: "medium", className: "whitespace-pre-wrap max-w-576px", children: hero.tagline }),
      /* @__PURE__ */ jsx("div", { flex: "~ wrap", justify: "start", p: "t-8", children: hero.actions.map((action) => /* @__PURE__ */ jsx("div", { p: "1", children: /* @__PURE__ */ jsx(Button, { type: "a", text: action.text, href: action.link, theme: action.theme }) }, action.link)) })
    ] }),
    hero.image && /* @__PURE__ */ jsx("div", { w: "max-96", h: "max-96", flex: "center", m: "auto", children: /* @__PURE__ */ jsx("img", { src: hero.image.src, alt: hero.image.alt }) })
  ] }) });
}
function HomeFeature(props) {
  return /* @__PURE__ */ jsx("div", { className: "max-w-1152px", m: "auto", flex: "~ wrap", justify: "between", children: props.features.map((feature) => {
    const {
      icon: icon2,
      title: title2,
      details
    } = feature;
    return /* @__PURE__ */ jsx("div", { border: "rounded-md", p: "r-4 b-4", w: "1/3", children: /* @__PURE__ */ jsxs("article", { bg: "bg-soft", border: "~ bg-soft solid rounded-xl", p: "6", h: "full", children: [
      /* @__PURE__ */ jsx("div", { bg: "gray-light-4 dark:bg-white", border: "rounded-md", className: "mb-5 w-12 h-12 text-3xl flex-center", children: icon2 }),
      /* @__PURE__ */ jsx("h2", { font: "bold", children: title2 }),
      /* @__PURE__ */ jsx("p", { text: "sm text-2", font: "medium", className: "pt-2 leading-6", children: details })
    ] }) }, title2);
  }) });
}
function HomeLayout() {
  const {
    frontmatter: frontmatter2
  } = usePageData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(HomeHero, { hero: frontmatter2.hero }),
    /* @__PURE__ */ jsx(HomeFeature, { features: frontmatter2.features })
  ] });
}
const sidebar = "_sidebar_ltu0r_1";
const styles$2 = {
  sidebar
};
function Sidebar(props) {
  const {
    sidebarData,
    pathname
  } = props;
  const renderGroupItem = (item) => {
    const active = item.link === pathname;
    return /* @__PURE__ */ jsx("div", { ml: "5", children: /* @__PURE__ */ jsx("div", { p: "1", block: "~", text: "sm", "font-medium": "~", className: `${active ? "text-brand" : "text-text-2"}`, children: /* @__PURE__ */ jsx(Link, { href: item.link, children: item.text }) }) });
  };
  const renderGroup = (item) => {
    var _a;
    return /* @__PURE__ */ jsxs("section", { block: "~", "not-first": "divider-top mt-4", children: [
      /* @__PURE__ */ jsx("div", { flex: "~", justify: "between", items: "center", children: /* @__PURE__ */ jsx("h2", { m: "t-3 b-2", text: "1rem text-1", font: "bold", children: item.text }) }),
      /* @__PURE__ */ jsx("div", { mb: "1", children: (_a = item.items) == null ? void 0 : _a.map((item2) => /* @__PURE__ */ jsx("div", { children: renderGroupItem(item2) }, item2.link)) })
    ] }, item.text);
  };
  return /* @__PURE__ */ jsx("aside", { className: styles$2.sidebar, children: /* @__PURE__ */ jsx("nav", { children: sidebarData.map(renderGroup) }) });
}
const prev = "_prev_fcqg2_1";
const next = "_next_fcqg2_2";
const title = "_title_fcqg2_17";
const desc = "_desc_fcqg2_24";
const styles$1 = {
  prev,
  next,
  "pager-link": "_pager-link_fcqg2_5",
  title,
  desc
};
function usePrevNextPage() {
  var _a;
  const {
    pathname
  } = useLocation();
  const {
    siteData: siteData2
  } = usePageData();
  const sidebar2 = ((_a = siteData2.themeConfig) == null ? void 0 : _a.sidebar) || {};
  const flattenTitles = [];
  Object.keys(sidebar2).forEach((key) => {
    const groups = sidebar2[key] || [];
    groups.forEach((group) => {
      group.items.forEach((item) => {
        flattenTitles.push(item);
      });
    });
  });
  const pageIndex = flattenTitles.findIndex((item) => item.link === pathname);
  const prevPage = flattenTitles[pageIndex - 1] || null;
  const nextPage = flattenTitles[pageIndex + 1] || null;
  return {
    prevPage,
    nextPage
  };
}
function DocFooter() {
  const {
    prevPage,
    nextPage
  } = usePrevNextPage();
  return /* @__PURE__ */ jsx("footer", { mt: "8", children: /* @__PURE__ */ jsxs("div", { flex: "~", gap: "2", "divider-top": "~", pt: "6", children: [
    /* @__PURE__ */ jsx("div", { flex: "~ col", className: styles$1.prev, children: prevPage && /* @__PURE__ */ jsxs("a", { href: prevPage.link, className: styles$1.pagerLink, children: [
      /* @__PURE__ */ jsx("span", { className: styles$1.desc, children: "上一页" }),
      /* @__PURE__ */ jsx("span", { className: styles$1.title, children: prevPage.text })
    ] }) }),
    /* @__PURE__ */ jsx("div", { flex: "~ col", className: styles$1.next, children: nextPage && /* @__PURE__ */ jsxs("a", { href: nextPage.link, className: `${styles$1.pagerLink} ${styles$1.next}`, children: [
      /* @__PURE__ */ jsx("span", { className: styles$1.desc, children: "下一页" }),
      /* @__PURE__ */ jsx("span", { className: styles$1.title, children: nextPage.text })
    ] }) })
  ] }) });
}
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
const freeGlobal$1 = freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal$1 || freeSelf || Function("return this")();
const root$1 = root;
var Symbol$1 = root$1.Symbol;
const Symbol$2 = Symbol$1;
var objectProto$1 = Object.prototype;
var hasOwnProperty = objectProto$1.hasOwnProperty;
var nativeObjectToString$1 = objectProto$1.toString;
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
  var index2 = string.length;
  while (index2-- && reWhitespace.test(string.charAt(index2))) {
  }
  return index2;
}
var reTrimStart = /^\s+/;
function baseTrim(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var now = function() {
  return root$1.Date.now();
};
const now$1 = now;
var FUNC_ERROR_TEXT$1 = "Expected a function";
var nativeMax = Math.max, nativeMin = Math.min;
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now$1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now$1());
  }
  function debounced() {
    var time = now$1(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
var FUNC_ERROR_TEXT = "Expected a function";
function throttle(func, wait, options) {
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    "leading": leading,
    "maxWait": wait,
    "trailing": trailing
  });
}
const NAV_HEIGHT = 56;
let links = [];
function scrollToTarget(target, isSmooth) {
  const targetPadding = parseInt(window.getComputedStyle(target).paddingTop, 10);
  const targetTop = window.scrollY + target.getBoundingClientRect().top + targetPadding - NAV_HEIGHT;
  window.scrollTo({
    left: 0,
    top: targetTop,
    behavior: isSmooth ? "smooth" : "auto"
  });
}
function bindingAsideScroll() {
  const marker = document.getElementById("aside-marker");
  const aside = document.getElementById("aside-container");
  const headers = Array.from((aside == null ? void 0 : aside.getElementsByTagName("a")) || []).map((item) => decodeURIComponent(item.hash));
  if (!aside) {
    return;
  }
  const activate = (links2, index2) => {
    if (links2[index2]) {
      const id = links2[index2].getAttribute("href");
      const tocIndex = headers.findIndex((item) => item === id);
      const currentLink = aside == null ? void 0 : aside.querySelector(`a[href="#${id.slice(1)}"]`);
      if (currentLink) {
        marker.style.top = `${33 + tocIndex * 28}px`;
        marker.style.opacity = "1";
      }
    }
  };
  const setActiveLink = () => {
    links = Array.from(document.querySelectorAll(".island-doc .header-anchor")).filter((item) => {
      var _a;
      return ((_a = item.parentElement) == null ? void 0 : _a.tagName) !== "H1";
    });
    const isBottom = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight;
    if (isBottom) {
      activate(links, links.length - 1);
      return;
    }
    for (let i = 0; i < links.length; i++) {
      const currentAnchor = links[i];
      const nextAnchor = links[i + 1];
      const scrollTop = Math.ceil(window.scrollY);
      const currentAnchorTop = currentAnchor.parentElement.offsetTop - NAV_HEIGHT;
      if (!nextAnchor) {
        activate(links, i);
        break;
      }
      if (i === 0 && scrollTop < currentAnchorTop || scrollTop == 0) {
        activate(links, 0);
        break;
      }
      const nextAnchorTop = nextAnchor.parentElement.offsetTop - NAV_HEIGHT;
      if (scrollTop >= currentAnchorTop && scrollTop < nextAnchorTop) {
        activate(links, i);
        break;
      }
    }
  };
  const throttledSetActiveLink = throttle(setActiveLink, 100);
  window.addEventListener("scroll", throttledSetActiveLink);
  return () => {
    window.removeEventListener("scroll", throttledSetActiveLink);
  };
}
function useHeaders(initHeaders) {
  const [headers, setHeaders] = React.useState(initHeaders);
  React.useEffect(() => {
  }, []);
  return headers;
}
function Aside(props) {
  const {
    headers: rawHeaders = []
  } = props;
  const headers = useHeaders(rawHeaders);
  const hasOutline = headers.length > 0;
  const markerRef = React.useRef(null);
  React.useEffect(() => {
    const unbinding = bindingAsideScroll();
    return () => {
      unbinding();
    };
  }, []);
  const renderHeader = (header) => {
    return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: `#${header.id}`, className: "block leading-7 text-text-2 hover:text-text-1", transition: "color duration-300", style: {
      paddingLeft: (header.depth - 2) * 12
    }, onClick: (e) => {
      e.preventDefault();
      const target = document.getElementById(header.text);
      target && scrollToTarget(target, false);
    }, children: header.text }) }, header.id);
  };
  return /* @__PURE__ */ jsx("div", { flex: "~ col 1", style: {
    width: "var(--island-aside-width)"
  }, children: /* @__PURE__ */ jsx("div", { children: hasOutline && /* @__PURE__ */ jsxs("div", { id: "aside-container", className: "relative divider-left pl-4 text-13px font-medium", children: [
    /* @__PURE__ */ jsx("div", { ref: markerRef, id: "aside-marker", className: "absolute top-33px opacity-0 w-1px h-18px bg-brand", style: {
      left: "-1px",
      transition: "top 0.25s cubic-bezier(0, 1, 0.5, 1), background-color 0.5s, opacity 0.25s"
    } }),
    /* @__PURE__ */ jsx("div", { "leading-7": "~", text: "13px", font: "semibold", children: "ON THIS PAGE" }),
    /* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsx("ul", { relative: "~", children: headers.map(renderHeader) }) })
  ] }) }) });
}
const content = "_content_1vif6_1";
const docContent = "_docContent_1vif6_7";
const asideContainer = "_asideContainer_1vif6_12";
const styles = {
  content,
  docContent,
  asideContainer
};
function DocLayout() {
  var _a;
  const {
    siteData: siteData2,
    toc: toc2
  } = usePageData();
  const sidebarData = ((_a = siteData2.themeConfig) == null ? void 0 : _a.sidebar) || {};
  const {
    pathname
  } = useLocation();
  const matchedSidebarKey = Object.keys(sidebarData).find((key) => {
    if (pathname.startsWith(key)) {
      return true;
    }
  });
  const matchedSidebar = sidebarData[matchedSidebarKey] || [];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Sidebar, { sidebarData: matchedSidebar, pathname }),
    /* @__PURE__ */ jsxs("div", { className: styles.content, flex: "~", children: [
      /* @__PURE__ */ jsxs("div", { className: styles.docContent, children: [
        /* @__PURE__ */ jsx("div", { className: "island-doc", children: /* @__PURE__ */ jsx(Content, {}) }),
        /* @__PURE__ */ jsx(DocFooter, {})
      ] }),
      /* @__PURE__ */ jsx("div", { className: styles.asideContainer, children: /* @__PURE__ */ jsx(Aside, { headers: toc2, __island: "../../components/Aside/index!!ISLAND!!C:/Users/Dev/Desktop/ssg/src/theme-default/Layout/DocLayout/index.tsx" }) })
    ] })
  ] });
}
function Layout() {
  const pageData = usePageData();
  const {
    pageType
  } = pageData;
  const getContent = () => {
    switch (pageType) {
      case "home":
        return /* @__PURE__ */ jsx(HomeLayout, {});
      case "doc":
        return /* @__PURE__ */ jsx(DocLayout, {});
      default:
        return /* @__PURE__ */ jsx("div", { children: "404" });
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("section", { style: {
      paddingTop: "var(--island-nav-height)"
    }, children: getContent() })
  ] });
}
const siteData = { "title": "ssg site", "description": "SSG Framework", "themeConfig": { "nav": [{ "text": "主页", "link": "/" }, { "text": "指南", "link": "/guide/" }], "sidebar": { "/guide": [{ "text": "教程", "items": [{ "text": "快速上手", "link": "/guide/a" }, { "text": "如何安装", "link": "/guide/b" }, { "text": "如何使用", "link": "/guide/c" }] }] } }, "vite": {} };
async function initPageData(routePath) {
  var _a;
  const matched = matchRoutes(routes, routePath);
  if (matched) {
    const moduleInfo = await matched[0].route.preload();
    return {
      pageType: ((_a = moduleInfo.frontmatter) == null ? void 0 : _a.pageType) ?? "doc",
      siteData,
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath,
      toc: moduleInfo.toc
    };
  }
  return {
    pageType: "404",
    siteData,
    pagePath: routePath,
    frontmatter: {}
  };
}
function App() {
  return /* @__PURE__ */ jsx(Layout, {});
}
function StaticRouter({
  basename,
  children,
  location: locationProp = "/",
  future
}) {
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let action = Action.Pop;
  let location = {
    pathname: locationProp.pathname || "/",
    search: locationProp.search || "",
    hash: locationProp.hash || "",
    state: locationProp.state || null,
    key: locationProp.key || "default"
  };
  let staticNavigator = getStatelessNavigator();
  return /* @__PURE__ */ React__namespace.createElement(Router, {
    basename,
    children,
    location,
    navigationType: action,
    navigator: staticNavigator,
    future,
    static: true
  });
}
function getStatelessNavigator() {
  return {
    createHref,
    encodeLocation,
    push(to) {
      throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
    },
    replace(to) {
      throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
    },
    go(delta) {
      throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
    },
    back() {
      throw new Error(`You cannot use navigator.back() on the server because it is a stateless environment.`);
    },
    forward() {
      throw new Error(`You cannot use navigator.forward() on the server because it is a stateless environment.`);
    }
  };
}
function createHref(to) {
  return typeof to === "string" ? to : createPath(to);
}
function encodeLocation(to) {
  let href = typeof to === "string" ? to : createPath(to);
  href = href.replace(/ $/, "%20");
  let encoded = ABSOLUTE_URL_REGEX.test(href) ? new URL(href) : new URL(href, "http://localhost");
  return {
    pathname: encoded.pathname,
    search: encoded.search,
    hash: encoded.hash
  };
}
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
async function render(pagePath) {
  const pageData = await initPageData(pagePath);
  return server.renderToString(/* @__PURE__ */ jsx(DataContext.Provider, { value: pageData, children: /* @__PURE__ */ jsx(StaticRouter, { location: pagePath, children: /* @__PURE__ */ jsx(App, {}) }) }));
}
exports.render = render;
exports.routes = routes;
