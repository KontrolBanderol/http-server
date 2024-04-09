import { ApiProperty } from '@nestjs/swagger';

export class AddStorageDto {
    @ApiProperty({
        example: 'Main Storage Facility',
        description: 'Name of the storage',
    })
    name: string;
  
    @ApiProperty({
        example: 'Кемерово',
        description: 'The city where the storage is located',
      })
    cityName: string;
}
