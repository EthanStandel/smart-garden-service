import express from "express";
import { GoogleTokenClaims } from "../models/GoogleTokenClaims";

export namespace TokenUtils {

    const tokenPrefixLength = "Bearer ".length;

    // This assumes that we can trust the token
    export const getClaims = (req: express.Request, res: express.Response): GoogleTokenClaims => {
        if (!!res.locals.claims) {
            return res.locals.claims;
        } else {
            try {
                const token = req.headers.authorization!.substring(tokenPrefixLength);
                const [, encodedClaims] = (token.split("."));
                const unencodedClaims = Buffer.from(encodedClaims, "base64").toString();
                res.locals.claims = JSON.parse(unencodedClaims);
                return res.locals.claims;
            } catch {
                throw new Error("Bad token format");
            }
        }
    }

}
