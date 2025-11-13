import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export namespace SignUpDto {
  @ApiSchema({ name: 'InputSignUp' })
  export class Input {
    @ApiProperty({
      example: 'John Doe',
      description: 'Full name of the user',
    })
    @IsString()
    @IsNotEmpty({ message: 'Names are required' })
    names: string;

    @ApiProperty({
      example: 'johndoe@example.com',
      description: 'Email address of the user',
    })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({
      example: '+250788123456',
      description: 'Phone number of the user',
    })
    @IsString()
    @IsNotEmpty({ message: 'Phone number is required' })
    phone: string;

    @ApiProperty({
      example: 'Kigali, Rwanda',
      description: 'User residential address',
    })
    @IsString()
    @IsNotEmpty({ message: 'Address is required' })
    address: string;

    @ApiProperty({
      example: 'StrongPassword123',
      description: 'Password with at least 6 characters',
      minLength: 6,
    })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
  }

  @ApiSchema({ name: 'OutputSignUp' })
  export class Output {
    @ApiProperty({
      example: 'John Doe',
      description: 'Full name of the user',
    })
    names: string;

    @ApiProperty({
      example: 'johndoe@example.com',
      description: 'Email address of the user',
    })
    email: string;

    @ApiProperty({
      example: '+250788123456',
      description: 'Phone number of the user',
    })
    phone: string;

    @ApiProperty({
      example: 'Kigali, Rwanda',
      description: 'User residential address',
    })
    address: string;
  }
}
