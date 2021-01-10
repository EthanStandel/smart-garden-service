import * as express from "express";
import { controller, httpGet, interfaces } from "inversify-express-utils";

@controller("/authentication")
export class AuthenticationController implements interfaces.Controller {

    @httpGet("/validate-token")
    public validateToken(req: express.Request) {
        console.log(req);
    }

}
