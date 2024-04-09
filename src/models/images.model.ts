import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { ProductModel } from "./products.model";


@Entity({ name: 'images' })
export class ImageModel extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
  id: string;

  @ApiProperty({
    example: 'https://example.com/img.png',
    description: 'Icon URL',
  })
  @Column({ type: 'varchar', nullable: true })
  icon: string | null;

  @ManyToOne(() => ProductModel, { onDelete: 'CASCADE' })
  @JoinColumn()
  product: ProductModel;
}