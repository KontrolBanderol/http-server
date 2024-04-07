import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from 'src/models/users.model';

class EmailRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique email ID',
  })
  readonly id: string;

  @ApiProperty({ example: 'example@mail.ru', description: 'Email address' })
  readonly email: string;

  @ApiProperty({ example: true, description: 'Email verification status' })
  readonly verified: boolean;
}

class MetaRo {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique meta ID',
  })
  readonly id: string;

  @ApiProperty({
    example: 'vitalik',
    description: 'Name',
  })
  readonly name: string;

  @ApiProperty({
    example: 'A brief description of the object.',
    description: 'Description',
  })
  readonly description: string | null;
}

export class PrivateUserRo {
    @ApiProperty({
        example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
        description: 'Unique user ID',
      })
      public id: string;
    
      @ApiProperty({ example: 'Fedya', description: 'Full name' })
      public fullname: string;
    
      @ApiProperty({
        example: 'https://example.com/img.png',
        description: 'Icon URL',
      })
      icon: string | null;
    
      @ApiProperty({
        example: true,
        description: 'Verification of the user',
      })
      public verified: boolean;

    @ApiProperty({
        example: '2023-12-11 23:08:02.949+07',
        description: 'User creation date',
    })
    readonly createdAt: string;

    @ApiProperty({ type: MetaRo, description: 'User meta' })
    readonly meta: MetaRo;

    @ApiProperty({ type: EmailRo, description: 'Email information' })
    readonly email: EmailRo;

    constructor(userModel: UserModel) {
        this.id = userModel.id;
        this.fullname = userModel.fullname;
        this.icon = userModel.icon;
        this.verified = userModel.verified;
        this.createdAt = userModel.created_at.getTime().toString();
        this.meta = userModel.meta;
        this.email = {
            id: userModel.email.id,
            email: userModel.email.email,
            verified: userModel.email.verified,
        };
    }
}
