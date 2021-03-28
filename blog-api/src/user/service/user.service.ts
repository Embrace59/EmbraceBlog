import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import { AuthService } from 'src/auth/services/auth.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CreateUserDto } from '../models/dto/CreateUser.dto';


@Injectable()
export class UserService {
    constructor(
        //const userRepository = getRepository(User); 
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) { }
    
    create(user: User): Observable<User>{
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash:string) => {
                const newUser = new UserEntity();
                newUser.name = user.name
                newUser.username = user.username
                newUser.email = user.email
                newUser.password = passwordHash

                return from(this.userRepository.save(newUser)).pipe(
                    map((user:User) => {
                        const {password, ...result} = user
                        return result
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    createA(createdUserDto: CreateUserDto): Observable<User> {
        return this.mailExists(createdUserDto.email).pipe(
            switchMap((exists: boolean) => {
                if (!exists) {
                    return this.authService.hashPassword(createdUserDto.password).pipe(
                        switchMap((passwordHash: string) => {
                            // Overwrite the user password with the hash, to store it in the db
                            createdUserDto.password = passwordHash;
                            return from(this.userRepository.save(createdUserDto)).pipe(
                                map((savedUser: User) => {
                                    const { password, ...user } = savedUser;
                                    console.log('user.service.ts 52')
                                    console.log(user)
                                    return user;
                                })
                            )
                        })
                    )
                } 
            })
        )
    }

    private mailExists(email: string): Observable<boolean>{
        return from(this.userRepository.findOne({ email })).pipe(
            map((user: User) => {
                if (user) {
                    return true;
                } else {
                    return false;
                }
            })
        )
    }

    findOne(id: number): Observable<User>{
        return from(this.userRepository.findOne({id})).pipe(
            map((user: User) => {
                const {password, ...result} = user
                return result
            })
        )
    }

    findAll(): Observable<User[]>{
        return from(this.userRepository.find()).pipe(
            map((users:User[]) => {
                users.forEach(function (v) {delete v.password})
                return users
            })
        )
    }

    deleteOne(id: number): Observable<any>{
        return from(this.userRepository.delete(id))
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;

        return from(this.userRepository.update(id, user))
    }

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOne({email}));
    }

    validateUser(email: string, password: string): Observable<User>{
        return this.findByMail(email).pipe(
            switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if(match) {
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )
    }

    login(user: User):Observable<string>{
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user:User) => {
                if(user){
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt))
                }
                else{
                    return 'Wrong Crednetials'
                }
            })
        )
    }

}
