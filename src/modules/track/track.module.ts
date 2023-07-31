/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Track } from "./track.entity";
import { PassportModule } from "@nestjs/passport";
import { AuthConstants } from "src/commons/constants/auth-constants";

@Module({
  imports:[TypeOrmModule.forFeature([Track]),
  PassportModule.register({
    defaultStrategy:AuthConstants.strategy,
}),
],
  providers: [TrackService],
  controllers: [TrackController],
  exports:[TrackService]
})
export class TrackModule {

}
