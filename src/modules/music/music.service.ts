/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { AwsService } from "src/shared/modules/aws/aws.service";
import { DeleteResult } from "typeorm";
import { MusicRepository } from "./music.repository";
import { Music } from "./music.entity";
import { musicType } from "src/commons/enums/music-type.enum";
import { Track } from "../track/track.entity";
import { FavService } from "../fav/fav.service";
import { PlaylistService } from "../playlist/playlist.service";
import { TrackService } from "../track/track.service";

Injectable()
export class MusicService {
    constructor(private readonly musicRepository:MusicRepository,
                private favService:FavService,
                private readonly awsService:AwsService,
                private playlistService:PlaylistService,
                private trackService:TrackService
        ) {}
    
    async getAllMusics():Promise<Music[]>{
       return await this.musicRepository.find()
    }

    async getOneMusic(id:number):Promise<Music>{
       const music= await this.musicRepository.findOne({
        where:{id}
       })
       if (!music) {
        throw new NotFoundException('music with this id not found')
       }
       return music
    }

    async getLimitedMusics(limit:number):Promise<Music[]>{
        return await this.musicRepository.getLimitedMusic(limit);
    }

    async getFilteredMusics(limit:number,type:musicType,rate:number):Promise<Music[]>{
        return await this.musicRepository.getFilteredMusic(limit,type,rate)
    }

    async updateMusic(id: number, name: string, description: string,
        artist: string, type: musicType, source: any):Promise<Music> {
       const music =await this.getOneMusic(id);

       if (name) {
        music.name=name
       }

       if (description) {
        music.description=description
       }

       if (artist) {
        music.artist=artist
       }

       if (name) {
        music.name=name
       }

       if (type) {
        music.type=type
       }

       

       if (source) {
        await this.awsService.fileDelete(source)
        music.source= await this.awsService.fileUpload(source,'musics')
       }

       const updatedMusic =await music.save();
       return updatedMusic;
    }

    async deleteMusic(id:number):Promise<DeleteResult> {
        const music =await this.getOneMusic(id);
        for (let i = 0; i < music.tracks.length; i++) {
            await this.trackService.deleteTrack(music.tracks[i].id)
        }
        if (music.source) {
            await this.awsService.fileDelete(music.source);
        }
        const result=await this.musicRepository.delete(id);
        if ( result.affected === 0) {
            throw new NotFoundException('music with this id not found')
        }
        return result;
    }

    async pushToFavoriteList(musicId: number, favoriteListId: number): Promise<Track> {
        const music = await this.getOneMusic(musicId);
        const track = await this.favService.createFavoriteTrack(favoriteListId,null,music);
        return track;
      }

      async pushToPlaylist(musicId: number, playlistId: number): Promise<Track> {
        const music = await this.getOneMusic(musicId);
        const track = await this.playlistService.createPlaylistTrack(playlistId,null,music);
        return track;
      }
}