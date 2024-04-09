import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn } from "typeorm";
import { CityModel } from "./cities.model";
import { UserModel } from "./users.model";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'storages' })
export class StorageModel extends BaseEntity {

    @ApiProperty({
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        description: 'Unique identifier of the storage',
    }) 
    @PrimaryColumn({ type: 'uuid', unique: true, generated: 'uuid' })
    id: string;

    @ApiProperty({
        example: 'Main Storage Facility',
        description: 'Name of the storage',
    })
    @Column({ type: 'varchar',  })
    @Index()
    name: string;

    @ApiProperty({
        description: 'The city where the storage is located',
    })
    @ManyToOne(() => CityModel, city => city.storages)
    city: CityModel;

    @ApiProperty({
        description: 'The user (producer) to whom the storage belongs',
    })
    @ManyToOne(() => UserModel, user => user.storages)
    user: UserModel;
}