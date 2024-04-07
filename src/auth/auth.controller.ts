import { Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Ip, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponseRo } from './ro/login.ro';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import ResponseRo from 'src/common/ro/response.ro';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { SessionsService } from 'src/sessions/sessions.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from 'src/users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { TokensService } from 'src/tokens/tokens.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
) {}

    @ApiOperation({ summary: 'Registration user' })
    @ApiOkResponse({
        description: 'Successful registration',
        type: LoginResponseRo,
    })
    @Post('/registration')
    async registration(
        @Body() dto: CreateUserDto,
        @Req() req: Request,
        @Ip() ip: string,
    ): Promise<ResponseRo> {
        return await this.authService.registration(dto, req, ip);
    }

    @ApiOperation({ summary: 'Log in' })
    @ApiOkResponse({
        description: 'Successful login',
        type: LoginResponseRo,
    })
    @Post('/login')
    async login(
        @Body() dto: LoginUserDto,
        @Req() req: Request,
        @Ip() ip: string,
    ): Promise<ResponseRo> {
        return await this.authService.login(dto, req, ip);
    }

    @ApiOperation({ summary: 'Delete single session' })
    @ApiOkResponse({ description: 'Successful session deletion message' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Delete('/logout')
    async logout(
        @Req() req: AuthenticatedRequest,
        @Headers('x-refresh-token') refreshToken: string,
    ): Promise<ResponseRo> {
        return await this.sessionsService.deleteSession(refreshToken, req.user.id);
    }

    @ApiOperation({ summary: 'Updating the access token' })
    @ApiCreatedResponse({
        description: 'New access token generated',
        type: ResponseRo,
    })
    @Post('/refreshToken')
    async refresh(@Body() dto: RefreshTokenDto): Promise<ResponseRo> {
        return await this.authService.refreshAccessToken(dto.refreshToken);
    }

    @ApiOperation({ summary: 'Activation of user account after clicking on the link' })
    @ApiOkResponse({ description: 'Successful mail confirmation' })
    @Get('/activate/:token')
    async activateAccount(@Param('token') token: string): Promise<ResponseRo> {
        return await this.usersService.activateAccount(token);
    }

    @ApiOperation({ summary: 'Resending the email confirmation link' })
    @ApiOkResponse({ description: 'Successful mail confirmation' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('/activate-resend')
    async activateRepeat(@Req() req: AuthenticatedRequest): Promise<ResponseRo> {
        const userModel = await this.usersService.getUser({ id: req.user.id });
        if (!userModel) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        if (!userModel.email.token) {
            throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
        }

        await this.usersService.sendConfirmationEmail(
            userModel,
            userModel.email.token,
        );
        return {
            ok: true,
            message: 'The letter have been successfully sended',
            result: null,
        }
    }

    @ApiOperation({ summary: 'Sending recovery data to the email' })
    @ApiOkResponse({ description: 'The letter have been successfully sended' })
    @Post('/forgot-password')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        const userModel = await this.usersService.getUser({
            email: dto.email,
            name: dto.username,
        });
        if (!userModel) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const token = await this.tokensService.createToken(userModel.id);
        await this.usersService.sendForgotPasswordEmail(userModel, token);

        return {
            ok: true,
            message: 'The letter have been successfully sended',
            result: null,
        }
    }

    @ApiOperation({ summary: 'Restore account access' })
    @ApiOkResponse({ description: 'Generating and sending a new password to email' })
    @Get('/restore/:token')
    async restorePassword(@Param('token') token: string): Promise<ResponseRo> {
        const tokenModel = await this.tokensService.getToken({ token });
        if (!tokenModel) {
            throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
        }
        const userModel = await this.usersService.getUser({ id: tokenModel.userId });
        if (!userModel) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        userModel.password = await this.authService.handleForgotPassword(userModel);
        await this.usersService.sendRestorePasswordEmail(userModel);
        await this.tokensService.removeToken(userModel.id);
        return {
            ok: true,
            message: 'The letter have been successfully sended',
            result: null,
        }
    }
}
