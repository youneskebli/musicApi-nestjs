import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaylistRepository } from './playlist.repository';
import { Playlist } from './playlist.entity';
import { User } from '../auth/entities/user.entity';
import { PlaylistDto } from './dto/playlist.dto';
import { DeleteResult } from 'typeorm';
import { Song } from '../song/song.entity';
import { TrackService } from '../track/track.service';
import { Music } from '../music/music.entity';

@Injectable()
export class PlaylistService {
    constructor(private readonly playlistRepository:PlaylistRepository,private trackService:TrackService) {}

    async getUserPlaylists(user:User):Promise<Playlist[]> {
       return await this.playlistRepository.getUserPlaylists(user.id)
    }

    async getOnePlaylist(id:number):Promise<Playlist> {
       const result = await this.playlistRepository.findOne({
        where:{id}
       })
       if (!result) {
        throw new NotFoundException('playlist not found')
       }
       return result;
    }

    async CreateNewPlaylist(user:User,createPlaylistDto:PlaylistDto):Promise<Playlist> {
        const {name} = createPlaylistDto;
        const playlist = new Playlist();
        playlist.name=name;
        playlist.user=user;
        playlist.tracks= [];

        return await playlist.save();
    }

    async UpdatePlaylist(id:number,updatePlaylistDto:PlaylistDto):Promise<Playlist> {
       const playlist = await this.getOnePlaylist(id);
       const {name} = updatePlaylistDto;
       
       if(name) {
        playlist.name=name;
       }

       return await playlist.save();
    }

    
    async createPlaylistTrack(playlistId:number,song:Song,music:Music) {
      const playlist= await this.getOnePlaylist(playlistId);
      const track = await this.trackService.pushToPlaylist(song,music,playlist);
      return track;
 }

 async clearPlaylistContent(id:number):Promise<Playlist> {
      const playlist= await this.getOnePlaylist(id);
      for (let index = 0; index < playlist.tracks.length; index++) {
          await this.trackService.deleteTrack(playlist.tracks[index].id)
      }
      playlist.tracks= [];
      return await playlist.save();
 }

 async deletePlaylist(id:number):Promise<DeleteResult>{
     await this.clearPlaylistContent(id);
     const result = await this.playlistRepository.delete(id);
 if (result.affected === 0) {
   throw new NotFoundException('favorite list does not found');
 }
 return result;
 }

 async removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<Playlist>{
   const playlist = await this.getOnePlaylist(playlistId);
   for (let i = 0; i < playlist.tracks.length; i++) {
     if(playlist.tracks[i].id === trackId){
       await this.trackService.deleteTrack(trackId);
     }
   }
   return await playlist.save();
 }
}
