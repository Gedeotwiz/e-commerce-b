import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
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
import { sendOtpEmail } from 'src/common/mailler';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
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

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.userService.findOneByEmail(body.email);
    if (!user) throw new NotFoundException('No account found with this email.');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
const hashedOtp = await bcrypt.hash(otp, 10);

user.otp = hashedOtp;
user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
await user.save();

await sendOtpEmail(user.email, otp);


    return { message: 'OTP has been sent to your email address.' };
  }

  async verifyOtp(body: VerifyOtpDto): Promise<{ message: string }> {
    const user = await this.userService.findOneByEmail(body.email);
    if (!user) throw new NotFoundException('No account found with this email.');

    if (!user.otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      throw new BadRequestException('OTP expired or not found. Please request a new one.');
    }

    const isMatch = await bcrypt.compare(body.otp, user.otp);
    if (!isMatch) throw new BadRequestException('Invalid OTP. Please try again.');

    user.otp ;
    user.otpExpires;
    await user.save();

    return { message: 'OTP verified successfully.' };
  }

  async resetPassword(body: ResetPasswordDto) {
    await this.verifyOtp({ email: body.email, otp: body.otp });

    const user = await this.userService.findOneByEmail(body.email);
    if (!user) throw new NotFoundException('No account found with this email.');

    if (body.newPassword !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    user.password = hashedPassword;
    user.otp = null ;
    user.otpExpires = null;
    await user.save();

    return { message: 'Password reset successful.' };
  }
}
