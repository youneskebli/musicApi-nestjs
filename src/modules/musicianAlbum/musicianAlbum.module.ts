/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianAlbum } from './musicianAlbum.entity';
import { MusicianAlbumController } from './musicianAlbum.controller';
import { MusicianAlbumService } from './musicianAlbum.service';
import { awsModule } from 'src/shared/modules/aws/aws.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';

@Module({
    imports:[
        TypeOrmModule.forFeature([MusicianAlbum]),
        PassportModule.register({
            defaultStrategy:AuthConstants.strategy,
        }),
        awsModule
    ],
    controllers:[MusicianAlbumController],
    providers:[MusicianAlbumService],
    exports:[MusicianAlbumService]
})
export class MusicianAlbumModule {}
