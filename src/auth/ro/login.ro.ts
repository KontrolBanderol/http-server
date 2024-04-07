import { ApiProperty } from '@nestjs/swagger';
import { TokensRo } from 'src/auth/ro/tokens.ro';
import { PrivateUserRo } from 'src/users/ro/private-user.ro';

class ResultRo {
  @ApiProperty({ type: () => TokensRo })
  tokens: TokensRo;

  @ApiProperty({ type: () => PrivateUserRo, description: 'User model data' })
  userModel: PrivateUserRo;
}

export class LoginResponseRo {
  @ApiProperty({ example: true })
  readonly ok: boolean;

  @ApiProperty({
    type: () => ResultRo,
    description: 'The result containing user and token information',
  })
  readonly result: ResultRo;
}
