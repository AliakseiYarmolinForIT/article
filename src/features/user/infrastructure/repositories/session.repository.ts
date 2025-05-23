import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '../../domain/entities/session.entity';
import { Repository } from 'typeorm';
import { SessionFields } from '../../common/enums/session-fields.enum';

@Injectable()
export class SessionRepository {
  public constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  public async getSessionByField({
    field,
    value,
  }: {
    field: SessionFields;
    value: string;
  }): Promise<SessionEntity | null> {
    return await this.sessionRepository.findOne({
      where: { [field]: value },
    });
  }

  public async saveSession(session: SessionEntity): Promise<void> {
    await this.sessionRepository.save(session);
  }

  public async deleteSessionById({ id }: { id: string }): Promise<void> {
    await this.sessionRepository.delete({ id });
  }
}
