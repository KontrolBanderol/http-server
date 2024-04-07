import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailModel } from 'src/models/email.model';
import { MetaModel } from 'src/models/meta.model';
import { UserModel } from 'src/models/users.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ResponseRo from 'src/common/ro/response.ro';
import { MailerService } from '@nestjs-modules/mailer';
import { PublicUserRo } from './ro/public-user.ro';

@Injectable()
export class UsersService {
    constructor(
        private readonly mailerService: MailerService,
        @InjectRepository(EmailModel)
        private emailRepository: Repository<EmailModel>,
        @InjectRepository(MetaModel)
        private metaRepository: Repository<MetaModel>,
        @InjectRepository(UserModel)
        private usersRepository: Repository<UserModel>,
    ) {}

    public async create( dto: CreateUserDto, activationToken: string, ): Promise<UserModel> {
        const emailModel = new EmailModel();
        emailModel.email = dto.email;
        emailModel.token = activationToken;

        const metaModel = new MetaModel();
        metaModel.name = dto.username;

        const userModel = new UserModel();
        userModel.fullname = dto.fullname;
        userModel.password = dto.password;
        userModel.email = emailModel;
        userModel.meta = metaModel;

        await this.emailRepository.save(userModel.email);
        await this.metaRepository.save(userModel.meta);
        await this.usersRepository.save(userModel);

        return userModel;
    }

    public async getUser({
        id,
        name,
        email,
        emailToken,
    }: {
        id?: string;
        name?: string;
        email?: string;
        emailToken?: string;
    }): Promise<UserModel | null> {
        const userModel = await this.usersRepository.findOne({
            relations: {
                meta: true,
                email: true,
                sessions: true,
            },
            where: [
                { id },
                { meta: { name } },
                { email: { email } },
                { email: { token: emailToken } },
            ],
            select: {
                meta: { id: true, name: true, description: true },
                email: { id: true, email: true, verified: true, token: true },
            },
        });

        return userModel
    }

    public async getAll(): Promise<PublicUserRo[]> {
        const users = await this.usersRepository.find({
          relations: {
            meta: true,
            email: true,
          },
          select: {
            meta: { id: true, name: true, description: true },
            email: { id: true, email: true, verified: true, token: true },
          },
        });
    
        return users.map((user) => new PublicUserRo(user));
      }

    private async sendEmail(
        userModel: UserModel,
        subject: string,
        template: string,
        context: object,
    ): Promise<ResponseRo> {
        try {
            await this.mailerService.sendMail({
                to: userModel.email.email,
                subject,
                template,
                context,
            });

            return {
                ok: true,
                message: 'The letter have been successfully sended',
                result: null
            }
        } catch (error) {
            if (error.message.includes('550')) {
                throw new HttpException(
                    'The email address provided cannot receive messages.',
                    HttpStatus.BAD_REQUEST,
                  ); 
            } else {
                console.log(error);
                throw new HttpException(
                    'There was an error sending the email.',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    public async sendConfirmationEmail(
        userModel: UserModel,
        activationToken: string,
    ): Promise<ResponseRo> {
        const baseUrl = process.env.BASE_URL as string;
        const activationUrl = `${baseUrl}/auth/activate/${activationToken}`;
        const context = {
            name: userModel.meta.name,
            activationUrl,
        };
        return this.sendEmail(
            userModel,
            'Account activation',
            'confirmation-email.ejs',
            context,
        )
    }

    public async sendForgotPasswordEmail(
        userModel: UserModel,
        activationToken: string,
    ): Promise<ResponseRo> {
        const baseUrl = process.env.BASE_URL as string;
        const activationUrl = `${baseUrl}/auth/restore/${activationToken}`;
        const context = {
            name: userModel.meta.name,
            activationUrl,
        };

        return this.sendEmail(
            userModel,
            'Account restore',
            'forgot-password-email.ejs',
            context,
        );
    }

    public async sendRestorePasswordEmail(userModel: UserModel) {
        const context = {
            name: userModel.meta.name,
            newPassword: userModel.password,
        };
        return this.sendEmail(
            userModel,
            'New password',
            'new-password-email.ejs',
            context,
        );
    }

    public async activateAccount(emailToken: string): Promise<ResponseRo> {
        const userModel = await this.getUser({ emailToken });
        if (!userModel) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        await this.emailRepository.update(
            { id: userModel.email.id },
            { verified: true, token: null },
        );
        return {
            ok: true,
            message: 'The user account have been successfully activated',
            result: null,
        }
    }


}
