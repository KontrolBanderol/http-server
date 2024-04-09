import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryColumn } from "typeorm";
import { ProductModel } from "./products.model";

@Entity({ name: 'categories' })
export class CategoryModel extends BaseEntity {
    @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
    id: string;

    @Column({ type: 'varchar', unique: true })
    @Index()
    name: string;

    @OneToMany(() => ProductModel, product => product.category)
    products: ProductModel[];
}