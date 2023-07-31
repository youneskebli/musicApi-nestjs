/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../repositories/user.repository";
import { AuthConstants } from "src/commons/constants/auth-constants";
import { JwtPayload } from "src/commons/interfaces/jwt-interface";
import { User } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly userRepository:UserRepository){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:AuthConstants.secretKey,

        });
    }

    async validate(payload:JwtPayload):Promise<User>{
        const {email} = payload;
        const user = await this.userRepository.findByEmail(email);
        if(!user){
            throw new UnauthorizedException('user not authorize')
        }
        return user;
    }
}