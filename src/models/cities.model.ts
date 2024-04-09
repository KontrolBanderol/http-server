import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryColumn } from "typeorm";
import { StorageModel } from "./storages.model";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'cities' })
export class CityModel extends BaseEntity {
    @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
    id: string;

    @ApiProperty({
        example: 'Кемерово',
        description: 'Name of the city',
      })
    @Column({ type: 'varchar', unique: true, })
    @Index()
    name: string;

    @OneToMany(() => StorageModel, storage => storage.city)
    storages: StorageModel[];
}