import { ApiProperty } from '@nestjs/swagger';

export class AddCityDto {
    @ApiProperty({
        description: 'The city',
      })
    cityName: string;
}
