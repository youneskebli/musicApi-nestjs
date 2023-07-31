/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingerAlbum } from './singerAlbum.entity';
import { SingerAlbumController } from './singerAlbum.controller';
import { SingerAlbumService } from './singerAlbum.service';
import { awsModule } from 'src/shared/modules/aws/aws.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';

@Module({
    imports:[
        TypeOrmModule.forFeature([SingerAlbum]),
        PassportModule.register({
            defaultStrategy:AuthConstants.strategy,
        }),
        awsModule
    ],
    controllers:[SingerAlbumController],
    providers:[SingerAlbumService],
    exports:[SingerAlbumService]
})
export class SingerAlbumModule {}
