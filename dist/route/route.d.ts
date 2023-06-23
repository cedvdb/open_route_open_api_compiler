import { HttpMethod } from './http_method';
import { HttpPath } from './http_path';
import { Response } from './response';
/**
 * Represents a single endpoint.
 */
export declare abstract class Route<Request, ResponseBody> {
    /** Example "/account" */
    abstract path: HttpPath;
    /** The http method to be used to access this endpoint */
    abstract method: HttpMethod;
    abstract handle(request: Request): Promise<Response<ResponseBody>>;
}
