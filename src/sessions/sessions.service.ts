import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionModel } from 'src/models/sessions.model';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import ResponseRo from 'src/common/ro/response.ro';

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(SessionModel)
        private sessionsRepository: Repository<SessionModel>
    ) {}

    public async createSession(dto: CreateSessionDto): Promise<SessionModel> {
        const sessionModel = new SessionModel();
        sessionModel.refreshToken = dto.refreshToken;
        sessionModel.ip = dto.ip;
        sessionModel.userAgent = dto.userAgent;
        sessionModel.lastActivity = new Date();
        sessionModel.user = dto.user;

        return await this.sessionsRepository.save(sessionModel);
    }

    public async getSession({
        id,
        refreshToken,
    }: {
        id?: string;
        refreshToken?: string;
    }): Promise<SessionModel | null> {
        const sessionModel = await this.sessionsRepository.findOne({
            where: [
                { id },
                { refreshToken },
            ],
        });

        return sessionModel;
    }

    public async deleteSession(
        refreshToken: string,
        userId: string,
        ): Promise<ResponseRo> {
            const sessionModel = await this.sessionsRepository.findOne({
                where: { refreshToken },
              });
            if (!sessionModel) {
                throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
            }
            if (sessionModel.user.id != userId) {
                throw new HttpException('This session is not owned by the user', HttpStatus.FORBIDDEN)
            }

            await this.sessionsRepository.delete({ refreshToken });
            return {
                ok: true,
                message: 'Session removed',
                result: null,
            }
    }

    async deleteOldSessions(): Promise<void> {
        try {
          const expirationPeriod = 30;
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() - expirationPeriod);
          const deletedCount = await this.sessionsRepository
            .createQueryBuilder()
            .delete()
            .from(SessionModel)
            .where('lastActivity < :expirationDate', { expirationDate })
            .execute();
    
          console.log(`Deleted ${deletedCount.affected} old sessions.`);
        } catch (error) {
          console.error('Error deleting old sessions:', error);
        }
      }
}
