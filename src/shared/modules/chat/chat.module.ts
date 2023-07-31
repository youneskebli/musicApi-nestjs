import { Module, forwardRef } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UserJoinedRoom } from './entities/user-joined-room.entity';
import { Room } from './entities/room.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Message,UserJoinedRoom,Room]),
  PassportModule.register({
    defaultStrategy:AuthConstants.strategy,
}),
forwardRef(()=>AuthModule)
],
  controllers: [ChatController],
  providers:[ChatService, ChatGateway],
  exports:[ChatService]
})
export class ChatModule {}
