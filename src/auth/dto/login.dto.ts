import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export namespace LoginDto {
  @ApiSchema({ name: 'InputLogin' })
  export class Input {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;
  }

  @ApiSchema({ name: 'InputLogin' })
  export class Output {
    @ApiProperty({ example: 'ytftyuhawufhyugtyftretvnknjbjgh' })
    token: string;

    constructor(accessToken: string) {
      this.token = accessToken;
    }
  }
}
