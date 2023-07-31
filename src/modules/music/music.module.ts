/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicRepository } from './music.repository';
import { MusicController } from './music.controller';
import { awsModule } from 'src/shared/modules/aws/aws.module';
import { Music } from './music.entity';
import { MusicService } from './music.service';
import { FavModule } from '../fav/fav.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { PlaylistModule } from '../playlist/playlist.module';
import { TrackModule } from '../track/track.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([Music]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategy,
          }),
        awsModule,FavModule,PlaylistModule,TrackModule
    ],
    controllers:[MusicController],
    providers:[MusicRepository,MusicService],
})
export class MusicModule {}
