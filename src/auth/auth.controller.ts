import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { GenericResponse } from 'src/__share__/dto/generic-response.dto';
import { ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from './dto/password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'User login' })
  async login(
    @Body() body: LoginDto.Input,
  ): Promise<GenericResponse<LoginDto.Output>> {
    const user = await this.authService.Login(body);
    return new GenericResponse('Login successfuly', user);
  }

  @Post('forgot')
  @ApiOperation({ summary: 'Forgot password' })
  async forgot(@Body() body: ForgotPasswordDto) {
    return await this.authService.forgotPassword(body);
  }

  @Post('verfy')
  @ApiOperation({ summary: 'Verfy otp' })
  async verfy(@Body() body:VerifyOtpDto){
    return await this.authService.verifyOtp(body)
  }

  @Post('resent')
  @ApiOperation({ summary: 'Resent password' })
  async resent(@Body() body:ResetPasswordDto){
    return await this.authService.resetPassword(body)
  }
}
