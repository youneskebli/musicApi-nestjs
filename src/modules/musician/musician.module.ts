/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianRepository } from './musician.repositori';
import { MusicianController } from './musician.controller';
import { MusicianService } from './musician.service';
import { awsModule } from 'src/shared/modules/aws/aws.module';
import { Musician } from './musician.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { MusicianAlbumModule } from '../musicianAlbum/musicianAlbum.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([Musician]),
        awsModule,
        PassportModule.register({
            defaultStrategy:AuthConstants.strategy,
        }),
        MusicianAlbumModule
    ],
    controllers:[MusicianController],
    providers:[MusicianService,MusicianRepository]
})
export class MusicianModule {}
