import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import ResponseRo from 'src/common/ro/response.ro';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import { UserModel } from 'src/models/users.model';
import { JwtService } from '@nestjs/jwt';
import { CreateSessionDto } from 'src/sessions/dto/create-session.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { PrivateUserRo } from 'src/users/ro/private-user.ro';
import { LoginUserDto } from './dto/login-user.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly sessionsService: SessionsService,
    ) {}

    public async login(
        dto: LoginUserDto,
        req: Request,
        ip: string,
    ): Promise<ResponseRo> {
        const userModel = await this.validateUser(dto);
        const tokens: object = await this.generateTokens(userModel, req, ip);

        const privateUser = new PrivateUserRo(userModel);
        return {
            ok: true,
            result: {
                tokens,
                userModel: privateUser,
            }
        }
    }
    
    private async validateUser(dto: LoginUserDto): Promise<UserModel> {
        const userModel = await this.usersService.getUser({
            email: dto.email,
            name: dto.username,
        });
        if (!userModel) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const passwordEquals = await bcrypt.compare(
            dto.password,
            userModel.password,
        )
        if (!passwordEquals) {
            throw new HttpException('The passwords do not match', HttpStatus.FORBIDDEN);
        }

        return userModel;
    }

    public async registration(
        dto: CreateUserDto,
        req: Request,
        ip: string,
    ): Promise<ResponseRo> {
        const existingUserModel = await this.usersService.getUser({
            email: dto.email,
            name: dto.username,
        });
        if (existingUserModel) {
            throw new HttpException('Such a user already exists', HttpStatus.CONFLICT);
        }

        const hashPassword = await bcrypt.hash(dto.password, 5);
        const activationToken = v4();
        const userModel = await this.usersService.create(
            {
                ...dto,
                password: hashPassword,
            },
            activationToken,
        );

        await this.usersService.sendConfirmationEmail(userModel, activationToken);
        const tokens = await this.generateTokens(userModel, req, ip);
        const privateUser = new PrivateUserRo(userModel);

        return {
            ok: true,
            result: {
                tokens,
                userModel: privateUser,
            },
        };
    }

    private async generateTokens(
        userModel: UserModel,
        req: Request,
        ip: string,
    ): Promise<{ accessToken: string, refreshToken: string }> {
        const refreshTokenPayload = {
            userId: userModel.id,
        }

        const accessToken = this.createAccessToken(userModel);
        const refreshToken = this.jwtService.sign(refreshTokenPayload, { expiresIn: '7d', })

        const dto: CreateSessionDto = {
            user: userModel,
            userAgent:
              (req.headers as { [key: string]: any })['user-agent'] || 'unknown',
            ip,
            refreshToken,
        }
        await this.sessionsService.createSession(dto);

        return {
            accessToken,
            refreshToken,
        }
    }

    private createAccessToken(userModel: UserModel): string {
        const payload = {
            email: userModel.email,
            id: userModel.id,
            username: userModel.meta.name,
            fullname: userModel.fullname,
            verified: userModel.verified,
        };

        return this.jwtService.sign(payload, { expiresIn: '30m', });
    }

    public async refreshAccessToken(refreshToken: string) {
        const decoded = this.jwtService.verify(refreshToken);
        const sessionModel = await this.sessionsService.getSession({ refreshToken });
        if (!sessionModel || sessionModel.user.id !== decoded.userId) {
            throw new HttpException('Invalid refresh token', HttpStatus.NOT_FOUND);
        }

        const userModel = await this.usersService.getUser({ id: sessionModel.user.id });
        if (!userModel) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const accessToken = this.createAccessToken(userModel);

        return {
            ok: true,
            message: 'Access token has been refreshed',
            result: accessToken,
        };
    }

    public async handleForgotPassword(userModel: UserModel) {
        const { password, hashPassword } = await this.generatePassword(12);
        try {
            userModel.password = hashPassword;
            await userModel.save();
        } catch (error) {
            throw new UnauthorizedException('Server error ', error);
        }
        return password;
    }

    private async generatePassword(length: number) {
        const password: string = crypto
            .randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
        const hashPassword: string = await bcrypt.hash(password, 5);
        return {
            password,
            hashPassword,
        };
    }
}
