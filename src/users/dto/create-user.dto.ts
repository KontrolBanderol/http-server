import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { IsLettersNumbers } from '../decorators/is-letters-numbers.decorators';
import { minLetters } from '../decorators/min-letters.decorator';
import { minNumbers } from '../decorators/min-numbers.decorator';

export class CreateUserDto {
  @ApiProperty({ example: 'Ivanov Ivan Ivanovich', description: 'Full name' })
  @IsString({ message: 'The full name field must be a string' })
  readonly fullname: string;

  @ApiProperty({ example: 'example@mail.ru', description: 'Email address' })
  @IsString({ message: 'The email field must be a string' })
  @IsEmail({}, { message: 'Incorrect value of mail field' })
  readonly email: string;

  @ApiProperty({ example: 'ExampleName', description: 'Username' })
  @IsString({ message: 'The username field must be a string' })
  @IsLettersNumbers({
    message: 'Username must contain only latin letters and numbers',
  })
  readonly username: string;

  @ApiProperty({ example: 'hdu2ncn126', description: 'User password' })
  @IsString({ message: 'The password field must be a string' })
  @Matches(/^[A-Za-z0-9 .,'!&]+$/, {
    message:
      'Password must contain only latin letters, number and special characters',
  })
  @MinLength(4)
  @minNumbers(1)
  @minLetters(1)
  readonly password: string;
}
