import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { AddStorageDto } from './dto/add-storage.dto';
import { UsersService } from '../users.service';
import { CitiesService } from 'src/cities/cities.service';
import { StorageModel } from 'src/models/storages.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductModel } from 'src/models/products.model';
import { CategoriesService } from 'src/categories/categories.service';
import { ImageModel } from 'src/models/images.model';

@Injectable()
export class ProducerService {
    constructor(
        private usersService: UsersService,
        private citiesService: CitiesService,
        private categoriesService: CategoriesService,
        @InjectRepository(StorageModel)
        private storagesRepository: Repository<StorageModel>,
        @InjectRepository(ProductModel)
        private productsRepository: Repository<ProductModel>,
        
    ) {}

    public async addStorage(dto: AddStorageDto, userId: string): Promise<StorageModel> {
        const userModel = await this.usersService.getUser({ id: userId });
        if (!userModel) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const cityModel = await this.citiesService.getCity({ name: dto.cityName });
        if (!cityModel) {
            throw new HttpException('City not found', HttpStatus.NOT_FOUND);
        }

        const storageModel = new StorageModel();
        storageModel.name = dto.name;
        storageModel.city = cityModel;
        storageModel.user = userModel;
        await this.storagesRepository.save(storageModel);

        return storageModel;
    }
    
    public async createProduct(dto: CreateProductDto, userId: string, images: Array<Express.Multer.File>): Promise<ProductModel> {
        const userModel = await this.usersService.getUser({ id: userId });
        if (!userModel) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const categoryModel = await this.categoriesService.getCategory({ name: dto.categoryName });
        if (!categoryModel) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        const productModel = new ProductModel();
        productModel.name = dto.name;
        productModel.description = dto.description;
        productModel.size = dto.size;
        productModel.weight = dto.weight;
        productModel.price = dto.price;
        productModel.category = categoryModel;
        productModel.user = userModel;
        await productModel.save();

        if (images && images.length > 0) {
            await Promise.all(images.map(async (image) => {
                const newImage = new ImageModel();
                newImage.icon = image.filename;
                newImage.product = productModel;
                await newImage.save();
            }));
        }

        return productModel;
    }

    public async getProduct({
        id,
        name,
    }: {
        id?: string,
        name?: string,
    }): Promise<ProductModel | null> {
        const productModel = await this.productsRepository.findOne({
            relations: {
                category: true,
                images: true,
            },
            where: [
                { id },
                { name },
            ],
            select: {
                category: { id: true, name: true, },
                images: { id: true, icon: true, },
            },
        });

        return productModel;
    }
}
