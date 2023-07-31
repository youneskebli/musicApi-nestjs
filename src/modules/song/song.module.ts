/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRepository } from './song.repository';
import { SongController } from './song.controller';
import { Song } from './song.entity';
import { awsModule } from 'src/shared/modules/aws/aws.module';
import { SongService } from './song.service';
import { FavModule } from '../fav/fav.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { PlaylistModule } from '../playlist/playlist.module';
import { TrackModule } from '../track/track.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([Song]),
        PassportModule.register({
            defaultStrategy: AuthConstants.strategy,
          }),
        awsModule,
        FavModule,
        PlaylistModule,
        TrackModule
    ],
    controllers:[SongController],
    providers:[SongService,SongRepository],
    
})
export class SongModule {}
