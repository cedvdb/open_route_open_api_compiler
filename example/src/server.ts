

import cors from 'cors';
import express from 'express';
import { compileOpenApiDocument } from 'open_route_open_api_compiler';
import swaggerUi from 'swagger-ui-express';
import { ExampleExpressRouterAdapter } from './express_router_adapter';
import { multipartMiddleware } from './multipart/multipart_middleware';
import { FileUploadRoute } from './routes/file_upload_route';
import { CreateAccountRoute } from './routes/json_route';
import { GiveCatFoodRoute } from './routes/multipart_demo_route';

const app = express();
app.use(cors());
app.use(multipartMiddleware);
app.use(express.json({}));

const expressRouter = express.Router();
app.use(expressRouter);


// use an express adapter to add routes to express
// feel free to use fastify, koa, or any server.
const openRouter = new ExampleExpressRouterAdapter(expressRouter);
openRouter.addRoute(new FileUploadRoute());
openRouter.addRoute(new GiveCatFoodRoute());
openRouter.addRoute(new CreateAccountRoute());

// generate openapi specs and add a swagger page
console.log('compiling, wait a second...');
const openapi = compileOpenApiDocument([
  // we pass the current file path to tell the compiler
  // to start looking at routes from here, it will
  // find the routes used
  'src/server.ts',
]);

// add a route to get the generated document as json
expressRouter.get('/docs-json', (req, resp) => resp.json(openapi));
// use swagger ui to view documentation
expressRouter.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(openapi as any),
);


const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
  console.log('access localhost:3000/docs to view swagger ui');
  console.log('access localhost:3000/docs-json to view open api as json');
});


