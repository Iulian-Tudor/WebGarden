export default class RequestType {
    static GET = 0;
    static POST = 1;
    static PUT = 2;
    static DELETE = 3;

    static fromString(type) {
        switch(type) {
            case 'GET': return this.GET;
            case 'POST': return this.POST;
            case 'PUT': return this.PUT;
            case 'DELETE': return this.DELETE;
        }
    }
}
