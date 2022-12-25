import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";


export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any){
        
        if(!req.cookies.Authentication) throw new UnauthorizedException();
        //const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        //console.log(refreshToken);
        const refreshToken = req.cookies.Authentication;
        return { ...payload, refreshToken };
    }
}