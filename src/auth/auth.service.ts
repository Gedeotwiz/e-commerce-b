import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './dto/password.dto';
import { UserService } from 'src/user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { GenericResponse } from 'src/__share__/dto/generic-response.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'src/common/token-service';
import { EmailService } from 'src/common/mailler';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async Login(body: LoginDto.Input): Promise<LoginDto.Output> {
    const user = await this.userModel.findOne({ email: body.email }).exec();
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async sendVerficationEmail(user: User) {
    const verificationToken = this.tokenService.generateEmailToken(user.email);
    const clientUrlLocal = this.configService.get<string>('ADMIN_WEB_PORTAL_URL');
    const clientUrl = this.configService.get<string>('ORGIN_URL')
    const verifyEmailLink = `${clientUrlLocal || clientUrl}/verifyemail?token=${verificationToken}`;

    await this.emailService.sendVerificationEmail(
      user.email,
      user.names,
      verifyEmailLink,
    );
  }

  async signUp(body: SignUpDto.Input): Promise<SignUpDto.Output> {
    const userExist = await this.userService.findOneByEmail(body.email);
    if (userExist) {
      throw new ConflictException('User already exist');
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = {
      ...body,
      password: hashedPassword,
    };
    const user = await this.userModel.create(newUser);
    try {
      await this.sendVerficationEmail(user);
    } catch (error) {
      console.error('SIGNUP FAILED:', error);
      throw new BadRequestException(
        error.message || 'Failed to send verification email:',
      );
    }
    return {
      names: user.names,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      verfied: user.verfied,
    };
  }

  async verifyToken(token: string): Promise<any> {
    const secret = process.env.JWT_SECRET || 'mySuperSecretKey';
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async verifyEmailToken(token: string): Promise<string> {
  try {
    const decoded = this.tokenService.verifyEmailToken(token); 
    return decoded.email;
  } catch (error) {
    throw new BadRequestException('Invalid or expired token');
  }
}

async markEmailAsVerified(email: string): Promise<User> {
  const user = await this.userService.findOneByEmail(email );
  if (!user) {
    throw new BadRequestException('User not found');
  }

  if (user.verfied) {
    return user; 
  }

  user.verfied = true;
  await user.save();
  return user;
}


  async forgotPassword(
    body: ForgotPasswordDto,
  ): Promise<GenericResponse<{ message: string }>> {
    const user = await this.userService.findOneByEmail(body.email);
    if (!user) throw new NotFoundException('No account found with this email.');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await this.emailService.sendOtpEmail(user.email, otp);

    return new GenericResponse('OTP has been sent to your email address.');
  }

  async verifyOtp(
    body: VerifyOtpDto,
  ): Promise<GenericResponse<{ message: string }>> {
    const user = await this.userService.findOneByEmail(body.email);
    if (!user) throw new NotFoundException('No account found with this email.');

    if (
      !user.otp ||
      !user.otpExpires ||
      user.otpExpires.getTime() < Date.now()
    ) {
      throw new BadRequestException(
        'OTP expired or not found. Please request a new one.',
      );
    }

    const isMatch = await bcrypt.compare(body.otp, user.otp);
    if (!isMatch)
      throw new BadRequestException('Invalid OTP. Please try again.');

    user.otp;
    user.otpExpires;
    await user.save();
    return new GenericResponse('OTP verified successfully.');
  }

  async resetPassword(
    body: ResetPasswordDto,
  ): Promise<GenericResponse<{ message: string }>> {
    await this.verifyOtp({ email: body.email, otp: body.otp });

    const user = await this.userService.findOneByEmail(body.email);
    if (!user) throw new NotFoundException('No account found with this email.');

    if (body.newPassword !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return new GenericResponse('Password reset successful.');
  }
}
