import express from 'express';
import {
  FailureResponse, HandlerResponse, InternalErrorResponse, OkResponse, RedirectResponse, Response,
  Route
} from 'open_route';


/**
 * This is an example routeradapter which receives Routes and add their handlers to an express router
 */
export class ExampleExpressRouterAdapter {

  constructor(private router: express.Router) { }

  /** adds route to express */
  addRoute(route: Route<any, any>) {
    this.router[route.method](  // for the method defined on route
      route.path,  // for path defined on route
      this.toExpressHandler(route)  // use the handle method of said route
    );
  }

  /** transforms route.handle to an express handler */
  protected toExpressHandler(route: Route<any, any>) {
    return async (expressRequest: express.Request, expressResponse: express.Response) => {
      try {
        const response = await route.handle(expressRequest);
        this.handleResponse(response, expressResponse);
      } catch (e) {
        console.error(e);
        expressResponse.sendStatus(500);
      }
    }
  }

  /** given a open route response, call the appropriate  */
  protected handleResponse(response: HandlerResponse<any>, expressResponse: express.Response) {

    if (response instanceof OkResponse) {
      console.log('sending: ', response.body);
      expressResponse.send(response.body);
    } else if (response instanceof RedirectResponse) {
      expressResponse.redirect(response.location);
    } else if (response instanceof FailureResponse) {
      expressResponse.status(response.statusCode).send({ failure: response.failure });
    } else if (response instanceof InternalErrorResponse) {
      expressResponse.sendStatus(500);
    }
  }

}

