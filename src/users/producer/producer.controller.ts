import { Body, Controller, Get, Param, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { VerifiedGuard } from './guards/verified.guard';
import { CreateProductDto } from './dto/create-product.dto';
import ResponseRo from 'src/common/ro/response.ro';
import { ProducerService } from './producer.service';
import { AddStorageDto } from './dto/add-storage.dto';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { AddStorageRo } from './ro/add-storage.ro';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerImageConfig } from 'src/common/config/multer-image.config';

@ApiTags('Producer')
@Controller('producer')
export class ProducerController {
    constructor(
        private producersService: ProducerService,
    ) {}

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Get('/test')
    async test() {
        return {
            message: 'Working!'
        }
    }

    @ApiOperation({ summary: 'Add a new storage' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Post('/addStorage')
    async addStorage(
        @Body() dto: AddStorageDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<ResponseRo> {
        const storageModel = await this.producersService.addStorage(dto, req.user.id);

        return {
            ok: true,
            message: 'Storage has been added',
            result: new AddStorageRo(storageModel),
        }
    }

    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create a new product' })
    @ApiCreatedResponse({ type: CreateProductDto })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @UseInterceptors(FilesInterceptor('images', 4, multerImageConfig))
    @Post('/createProduct')
    async createProduct(
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Body() dto: CreateProductDto,
        @Req() req: AuthenticatedRequest,
    ): Promise<ResponseRo> {
        const productModel = await this.producersService.createProduct(dto, req.user.id, images);

        return {
            ok: true,
            message: 'Product has been created',
            result: productModel,
        }
    }

    @ApiOperation({ summary: 'Getting an image' })
    @Get('image/:filename')
    async serveAvatar(
      @Param('filename') fileId: string,
      @Res() res: any,
    ): Promise<any> {
      res.sendFile(fileId, { root: 'uploads/images' });
    }
}
