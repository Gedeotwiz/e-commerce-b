import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email })
      .select('email password names role phone address otp otpExpires verfied')
      .exec();
  }
}
