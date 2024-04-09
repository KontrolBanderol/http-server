import { ApiProperty } from "@nestjs/swagger";
import { StorageModel } from "src/models/storages.model";

export class CityRo {
    id: string;

    @ApiProperty({
        example: 'Кемерово',
        description: 'Name of the city',
      })
    name: string; 
}

export class AddStorageRo {
    @ApiProperty({
        example: 'Main Storage Facility',
        description: 'Name of the storage',
    })
    name: string;

    @ApiProperty({
        description: 'The city where the storage is located',
    })
    city: CityRo;

    constructor(storageModel: StorageModel) {
        this.name = storageModel.name,
        this.city = {
            id: storageModel.city.id,
            name: storageModel.city.name,
        }
    }
}
