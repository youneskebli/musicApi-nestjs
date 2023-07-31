/* eslint-disable prettier/prettier */
import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingerRepository } from './singer.repository';
import { SingerController } from './singer.controller';
import { SingerService } from './singer.service';
import { Singer } from './singer.entity';
import { awsModule } from 'src/shared/modules/aws/aws.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { SingerAlbumModule } from '../singerAlbum/singerAlbum.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([Singer]),
        PassportModule.register({
            defaultStrategy:AuthConstants.strategy,
        }),
        awsModule,
        SingerAlbumModule
    ],
    controllers:[SingerController],
    providers:[SingerService,SingerRepository],
    
})
export class SingerModule {
    
}
