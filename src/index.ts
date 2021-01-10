import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from 'inversify-express-utils';

// Controllers
import "./controllers/AuthenticationValidator";

// Middleware
import cors from "cors";
import * as bodyParser from "body-parser";
import { AuthenticationValidator } from "./middleware/AuthenticationValidator";

const container = new Container();

const server = new InversifyExpressServer(container);

server.setConfig(app => {
    app.use(cors({ origin: "http://localhost:3000", allowedHeaders: "*" }))
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(AuthenticationValidator.middleware);
});

const app = server.build();
app.listen(4000);
