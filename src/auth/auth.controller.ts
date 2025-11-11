import { Controller,Body,Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { GenericResponse } from 'src/__share__/dto/generic-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService
    ){}

    @Post()
    @ApiOperation({ summary: 'User login' })
    async login(@Body() body:LoginDto.Input):Promise<GenericResponse<LoginDto.Output>>{
        const user = await this.authService.Login(body)
        return new GenericResponse('Login successfuly',user)
    }
}
