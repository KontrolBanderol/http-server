import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddCityDto } from './dto/add-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CityModel } from 'src/models/cities.model';
import { Repository } from 'typeorm';

@Injectable()
export class CitiesService {
    constructor(
        @InjectRepository(CityModel)
        private citiesRepository: Repository<CityModel>,
    ) {}

    public async addCity({ cityName }: AddCityDto ): Promise<CityModel> {
        const existingCityModel = await this.getCity({ name: cityName });
        if (existingCityModel) {
            throw new HttpException('Such a city has already been added', HttpStatus.CONFLICT);
        }

        const cityModel = new CityModel();
        cityModel.name = cityName;
        await this.citiesRepository.save(cityModel);

        return cityModel;
    }

    public async getCity({
        id,
        name,
    }: {
        id?: string,
        name?: string,
    }): Promise<CityModel | null> {
        const cityModel = await this.citiesRepository.findOne({
            relations: {
                storages: true,
            },
            where: [
                { id },
                { name },
            ],
            select: {
                storages: { id: true, name: true, },
            },
        });

        return cityModel;
    }

    public async getAll(): Promise<CityModel[] | null> {
        return await this.citiesRepository.find({
            relations: {
                storages: true,
            },
            select: {
                storages: { id: true, name: true, },
            },
        });
    }
}
