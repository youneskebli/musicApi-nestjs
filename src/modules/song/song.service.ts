/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { SongRepository } from "./song.repository";
import { Song } from "./song.entity";
import { songType } from "src/commons/enums/song-type.enum";
import { songLanguage } from "src/commons/enums/song-languages.enum";
import { AwsService } from "src/shared/modules/aws/aws.service";
import { DeleteResult } from "typeorm";
import { Track } from "../track/track.entity";
import { FavService } from "../fav/fav.service";
import { PlaylistService } from "../playlist/playlist.service";
import { TrackService } from "../track/track.service";

@Injectable()
export class SongService {
    constructor(private readonly songRepository:SongRepository,
                private favService:FavService,
                private readonly awsService:AwsService,
                private readonly playlistService:PlaylistService,
                private trackService:TrackService
        ) {}
    
    async getAllSongs():Promise<Song[]>{
       return await this.songRepository.find();
    }

    async getOneSong(id:number):Promise<Song>{
       const song= await this.songRepository.findOne({
        where:{id}
       })
       if (!song) {
        throw new NotFoundException('song with this id not found')
       }
       return song
    }

    async getLimitedSongs(limit:number):Promise<Song[]>{
        return await this.songRepository.getLimitedSongs(limit);
    }

    async getFilteredSongs(limit:number,type:songType,language:songLanguage,rate:number):Promise<Song[]>{
        return await this.songRepository.getFilteredSongs(limit,type,rate,language)
    }

    async updateSong(id: number, name: string, description: string,
        artist: string, type: songType, language: songLanguage, source: any):Promise<Song> {
       const song =await this.getOneSong(id);

       if (name) {
        song.name=name
       }

       if (description) {
        song.description=description
       }

       if (artist) {
        song.artist=artist
       }

       if (name) {
        song.name=name
       }

       if (type) {
        song.type=type
       }

       if (language) {
        song.language=language
       }

       if (source) {
        await this.awsService.fileDelete(source)
        song.source= await this.awsService.fileUpload(source,'songs')
       }

       const updatedSong =await song.save();
       return updatedSong;
    }

    async deleteSong(id:number):Promise<DeleteResult> {
        const song =await this.getOneSong(id);
        for (let i = 0; i < song.tracks.length; i++) {
           await this.trackService.deleteTrack(song.tracks[i].id)
        }
        if (song.source) {
            await this.awsService.fileDelete(song.source);
        }
        const result=await this.songRepository.delete(id);
        if ( result.affected === 0) {
            throw new NotFoundException('song with this id not found')
        }
        return result;
    }

    async pushToFavList(songId:number,favoriteId:number):Promise<Track> {
        const song= await this.getOneSong(songId);
        const track=await this.favService.createFavoriteTrack(favoriteId,song,null);
        return track;
    }

    async pushToPlaylist(songID: number, playlistId: number): Promise<Track> {
        const song = await this.getOneSong(songID);
        const track = await this.playlistService.createPlaylistTrack(playlistId,song,null);
        return track;
      }
}