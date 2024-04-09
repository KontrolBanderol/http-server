import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryColumn,
} from 'typeorm';
import { EmailModel } from './email.model';
import { SessionModel } from './sessions.model';
import { MetaModel } from './meta.model';
import { StorageModel } from './storages.model';
import { ProductModel } from './products.model';

@Entity({ name: 'users' })
export class UserModel extends BaseEntity {
  @ApiProperty({
    example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
    description: 'Unique user ID',
  })
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  public id: string;

  @ApiProperty({ example: 'Fedya', description: 'Full name' })
  @Column({ type: 'varchar' })
  public fullname: string;

  @ApiProperty({
    example: 'https://example.com/img.png',
    description: 'Icon URL',
  })
  @Column({ type: 'varchar', nullable: true })
  icon: string | null;

  @ApiProperty({
    example: '123',
    description: 'user hashed password',
  })
  @Column({ type: 'varchar' })
  public password: string;

  @ApiProperty({
    example: true,
    description: 'Verification of the user',
  })
  @Column({ type: 'boolean', default: false })
  public verified: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @OneToOne(() => MetaModel)
  @JoinColumn()
  public meta: MetaModel;

  @OneToOne(() => EmailModel)
  @JoinColumn()
  public email: EmailModel;

  @OneToMany(() => StorageModel, storage => storage.user)
  storages: StorageModel[];

  @OneToMany(() => ProductModel, product => product.user)
  products: ProductModel[];

  @OneToMany(() => SessionModel, (session) => session.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public sessions: SessionModel[];
}
