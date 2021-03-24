import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
import { User } from 'src/user/models/user.interface';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService{
    constructor(
        private readonly jwtService: JwtService
    ){}

    generateJWT(user:User):Observable<String>{
        //jwtService.signAsync(): returns the JsonWebToken as string
        return from(this.jwtService.signAsync({user}))
    }

    /**
     * hash算法加密password
     * @param password 
     * @returns 
     */
    hashPassword(password:string):Observable<String>{
        return from<String>(bcrypt.hash(password, 12))
    }

    /**
     * 不知道。。。
     * @param newPassword 
     * @param passwortHash 
     * @returns 
     */
    comparePasswords(newPassword: string, passwortHash: string): Observable <any | boolean> {
        return of<any | boolean>(bcrypt.compare(newPassword, passwortHash));
    }

}