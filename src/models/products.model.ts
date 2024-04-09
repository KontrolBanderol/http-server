import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import { ImageModel } from './images.model';
import { CategoryModel } from './categories.model';
import { UserModel } from './users.model';

@Entity({ name: 'products' })
export class ProductModel extends BaseEntity {
    @ApiProperty({
        example: 'afb5bb5c-a88f-4f83-b6b0-c87fd349fdf1',
        description: 'Unique product ID',
    })
    @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
    public id: string;

    @ApiProperty({
        example: 'vitalik',
        description: 'Name',
    })
    @Column({ type: 'varchar' })
    name: string;

    @ApiProperty({
        example: 'A brief description of the object.',
        description: 'Description',
    })
    @Column({ type: 'varchar', nullable: true })
    description: string | null;

    @ApiProperty({
        example: '10 15 25',
        description: 'Width / Height / Length',
    })
    @Column({ type: 'varchar' })
    public size: string;

    @ApiProperty({
        example: '3.15',
        description: 'Weight',
    })
    @Column({ type: 'float' })
    public weight: number;

    @ApiProperty({
        example: 'Category name',
        description: 'Category of the product',
    })
    @ManyToOne(() => CategoryModel)
    category: CategoryModel;

    @ApiProperty({
        example: '100.50',
        description: 'Price of the product',
    })
    @Column({ type: 'float' })
    price: number;

    @ApiProperty({
        description: 'The user (producer) to whom the product belongs',
    })
    @ManyToOne(() => UserModel, user => user.products)
    user: UserModel;

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

    @OneToMany(() => ImageModel, (image) => image.product)
    images: ImageModel[];
}
