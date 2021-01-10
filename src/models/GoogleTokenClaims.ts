export interface GoogleTokenClaims {
    email: string,
    email_verified: true,
    name: string,
    picture: string,
    given_name: string,
    family_name: string,
    locale: string,
    iat: number,
    exp: number,
}
