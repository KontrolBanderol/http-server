import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        example: 'vitalik',
        description: 'Name of the product',
      })
      readonly name: string;
    
      @ApiProperty({
        example: 'A brief description of the object.',
        description: 'Description',
      })
      readonly description: string | null;
    
      @ApiProperty({
        example: '10 15 25',
        description: 'Width / Height / Length',
      })
      readonly size: string;
    
      @ApiProperty({
        example: '3.15',
        description: 'Weight',
      })
      public weight: number;
    
      @ApiProperty({
        example: 'Category name',
        description: 'Category of the product',
      })
      readonly categoryName: string;

      @ApiProperty({
        example: '100.50',
        description: 'Price of the product',
      })
      price: number;
}
