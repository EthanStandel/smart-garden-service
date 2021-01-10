import * as express from "express";
import { Container } from "inversify";
import { User } from "../models/User";
import { UserService } from "../services/UserService";
import { TokenUtils } from "../utils/TokenUtils";

export namespace UserManagement {

    export const middleware = (container: Container): express.RequestHandler => {
        const userService = container.get<UserService>(UserService.name);
        
        return async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ): Promise<void> => {
            const { email, name } = TokenUtils.getClaims(req, res);
            const fetchedUser = await userService.fetch("email", email);

            if (!fetchedUser) {
                await userService.store({ email, name });
            }

            next();
        }
    }
}
