/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistRepository } from './playlist.repository';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { Playlist } from './playlist.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { TrackModule } from '../track/track.module';

@Module({
    imports:[TypeOrmModule.forFeature([Playlist]),
    PassportModule.register({
        defaultStrategy:AuthConstants.strategy,
    }),
    TrackModule
],
    controllers:[PlaylistController],
    providers:[PlaylistService,PlaylistRepository],
    exports:[PlaylistService]
})
export class PlaylistModule {}
