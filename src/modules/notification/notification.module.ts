import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { Subscriber } from './entities/subscriber.entity';
import { SubsriberNotification } from './entities/subscriberNotification.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';

@Module({
  imports:[TypeOrmModule.forFeature([NotificationEntity,Subscriber,SubsriberNotification]),
  PassportModule.register({
    defaultStrategy: AuthConstants.strategy,
  }),
  
],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports:[NotificationService]
  
})
export class NotificationModule {}
