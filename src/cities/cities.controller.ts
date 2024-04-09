import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { AddCityDto } from './dto/add-city.dto';
import ResponseRo from 'src/common/ro/response.ro';
import { JwtAdminGuard } from 'src/governance/admins/guards/jwt-admin.guard';
import { RolesGuard } from 'src/governance/admins/guards/role.guard';
import { Roles } from 'src/governance/admins/decorators/roles.decorator';
import { Role } from 'src/governance/admins/enums/role.enum';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
    constructor(
        private citiesService: CitiesService,
    ) {}

    @ApiOperation({ summary: 'Add a city' })
    @ApiBearerAuth('admin-token')
    @UseGuards(JwtAdminGuard, RolesGuard)
    @Roles(Role.ADMINISTRATOR)
    @Post('/addCity')
    async addCity(@Body() dto: AddCityDto): Promise<ResponseRo> {
        const cityModel = await this.citiesService.addCity(dto);
        return {
            ok: true,
            message: 'The city has been successfuly added',
            result: cityModel,
        }
    }

    // @dev create JWT admin guard
    @ApiOperation({ summary: 'Get a city' })
    //@ApiBearerAuth('admin-token')
    //@UseGuard(AdminAuthGuard)
    @Get('/getCity/:name')
    async getCity(@Param('name') cityName: string): Promise<ResponseRo> {
        const cityModel = await this.citiesService.getCity({ name: cityName });
        if (!cityModel) {
            throw new HttpException('City not found', HttpStatus.NOT_FOUND);
        }
        return {
            ok: true,
            result: cityModel,
        }
    }

    @ApiOperation({ summary: 'Get all cities' })
    @Get('/getAll')
    async getAllCities(): Promise<ResponseRo> {
        return {
            ok: true,
            result: await this.citiesService.getAll(),
        }
    }
}
