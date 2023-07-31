/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailVerification } from './entities/email-verification.entity';
import { JwtStrategy } from './stratigies/jwt-strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ProfileModule } from '../profile/profile.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { FavModule } from '../fav/fav.module';
import { ForgottenPassword } from './entities/forgotten-password.entity';
import { ChatModule } from 'src/shared/modules/chat/chat.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports:[ 
        PassportModule.register({
        defaultStrategy:AuthConstants.strategy,
    }),
    JwtModule.register({
        secret:AuthConstants.secretKey,
        signOptions:{
            expiresIn:AuthConstants.expiresIn,
        },
    }),
    TypeOrmModule.forFeature([User,EmailVerification,EmailVerification,PlaylistModule,ForgottenPassword,EmailVerification]),
           ProfileModule,
           FavModule,
           PlaylistModule,
           NotificationModule,
           forwardRef(()=>ChatModule)
           ],
    controllers:[AuthController],
    providers:[UserRepository,JwtStrategy,AuthService],
    exports:[JwtStrategy,JwtModule,PassportModule,AuthService]
})
export class AuthModule {}
