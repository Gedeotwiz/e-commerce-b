import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export namespace LoginDto {
  export class Input {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;
  }

  export class Output {
    @ApiProperty({ example: 'ytftyuhawufhyugtyftretvnknjbjgh' })
    token: string;

    constructor(accessToken: string) {
      this.token = accessToken;
    }
  }
}
