import * as express from "express";
import axios from "axios";

/**
 * Determines if the token can be trusted by the provided.
 * If this middleware continues to next() then all middleware
 * after knows that we can trust the claims on the token for
 * identity.
 */
export namespace AuthenticationValidator {

    export const middleware = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const { authorization, authenticator } = req.headers;
        if (!!authorization && !!authenticator) {
            const accessToken = authorization.substring(authHeaderPrefixSize);
            
            // TODO - Add more authentication options
            const isValid = (authenticator === Authenticator.Google) ?
                await Authenticators.Google(accessToken)
                : false;

            if (isValid) {
                next();
            } else {
                res.status(401).json({ error: "Bad token" });
            }
        } else {
            res.status(401).json({
                error: !authorization ? "No token" : "Undefined authenticator"
            });
        }
    }

    const authHeaderPrefixSize = "Bearer ".length;

    enum Authenticator {
        Google = "Google"
    }

    namespace Authenticators {
        export const Google = async (accessToken: string): Promise<boolean> => {
            const validation_url = "https://oauth2.googleapis.com/tokeninfo";
            
            const response = await axios.get(validation_url, {
                params: {
                    id_token: accessToken
                }
            });
    
            return response.status === 200;
        }
    }

}
