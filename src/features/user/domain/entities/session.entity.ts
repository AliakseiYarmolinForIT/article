import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class SessionEntity {
  @PrimaryColumn()
  public id: string;

  @Column({ type: 'integer' })
  public userId: number;

  @Column()
  public ipAddress: string;

  @Column()
  public deviceName: string;

  @Column()
  public lastActiveDate: Date;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.userSession)
  public userEntity: UserEntity;

  public static createSession({
    deviceId,
    userId,
    ipAddress,
    deviceName,
    lastActiveDate,
  }: {
    deviceId: string;
    userId: string;
    ipAddress: string;
    deviceName: string;
    lastActiveDate: Date;
  }) {
    const session = new SessionEntity();

    session.id = deviceId;
    session.userId = Number(userId);
    session.ipAddress = ipAddress;
    session.deviceName = deviceName;
    session.lastActiveDate = lastActiveDate;

    return session;
  }

  public updateLastActiveDate({ lastActiveDate }: { lastActiveDate: Date }) {
    this.lastActiveDate = lastActiveDate;
  }
}
