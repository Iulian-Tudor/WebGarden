import RequestType from "./RequestType.js";

export default class Router {
    constructor() {
        this.routes = new Map();
    }

    register(route, requestType, handler) {
        this.routes.set(this.getRouteId(route, requestType), handler);
    }

    get(route, handler) {
        this.register(route, RequestType.GET, handler);
    }

    post(route, handler) {
        this.register(route, RequestType.POST, handler);
    }

    put(route, handler) {
        this.register(route, RequestType.PUT, handler);
    }

    delete(route, handler) {
        this.register(route, RequestType.DELETE, handler);
    }

    exists(route, requestType){
        return this.routes.has(this.getRouteId(route, requestType));
    }

    handle(route, requestType, req, res) {
        return this.routes.get(this.getRouteId(route, requestType))(req, res);
    }

    getRouteId(route, requestType) {
        return JSON.stringify([route, requestType]);
    }
}
