/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {config} from './config';
import { MusicianModule } from './modules/musician/musician.module';
import { SingerModule } from './modules/singer/singer.module';
import { MusicModule } from './modules/music/music.module';
import { SongModule } from './modules/song/song.module';
import { MusicianAlbumModule } from './modules/musicianAlbum/musicianAlbum.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SingerAlbumModule } from './modules/singerAlbum/singerAlbum.module';
import { TrackModule } from './modules/track/track.module';
import { awsModule } from './shared/modules/aws/aws.module';
import { MulterModule } from '@nestjs/platform-express';
import { NodemailerDrivers, NodemailerModule, NodemailerOptions } from '@crowdlinker/nestjs-mailer';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './shared/modules/chat/chat.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(config.db as TypeOrmModuleOptions),
    MulterModule.register({
      dest: './files'
    }),
    NodemailerModule.forRoot(config.nodeMailerOptions as unknown  as NodemailerOptions<NodemailerDrivers.SMTP>),
    AuthModule,
    MusicianModule,
    SingerModule,
    MusicModule,
    SongModule,
    MusicianAlbumModule,
    SingerAlbumModule,
    NotificationModule,
    PlaylistModule,
    ProfileModule,
    TrackModule,
    awsModule,
    ChatModule
    
  ],
  controllers: [
    AppController,
    
  ],
  providers: [AppService],
})
export class AppModule {}
