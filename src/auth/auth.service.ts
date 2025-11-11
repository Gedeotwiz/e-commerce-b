import { Injectable,UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import bcrypt from "bcrypt"


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel:Model<User>,
        private readonly jwtService:JwtService

    ){}

    async Login(body:LoginDto.Input):Promise<LoginDto.Output>{
        const user = await this.userModel.findOne({email:body.email}).exec()

        if(!user){
            throw new UnauthorizedException('Invalid email or password')
        }

        const isMatch = await bcrypt.compare(body.password,user.password)
        if(!isMatch){
            throw new UnauthorizedException('Invalid email or password')
        }

        const payload = { sub: user._id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);

        return {token}
    }
}
