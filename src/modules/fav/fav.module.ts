/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackModule } from '../track/track.module';
import { AuthConstants } from 'src/commons/constants/auth-constants';
import { Fav } from './fav.entity';
import { FavController } from './fav.controller';
import { FavService } from './fav.service';

@Module({
    imports: [TypeOrmModule.forFeature([Fav]),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategy,
    }),
    TrackModule,
  ],
  controllers: [FavController],
  providers: [FavService],
  exports: [FavService]
})
export class FavModule {}
