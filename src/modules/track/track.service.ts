import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Music } from '../music/music.entity';
import { Song } from '../song/song.entity';
import { Fav } from '../fav/fav.entity';
import { Playlist } from '../playlist/playlist.entity';

@Injectable()
export class TrackService {
    constructor(@InjectRepository(Track)  private trackRepository:Repository<Track>) {}


    async pushToFavList(song:Song,music:Music,favorite:Fav){
        let track= new Track();
        track =await this.checkType(track, music,song)
        track.fav=favorite; // creation of a foreign key < favoriteId >
        return await track.save()

    }

    async pushToPlaylist(song:Song,music:Music,playlist:Playlist){
        let track= new Track();
        track =await this.checkType(track, music,song)
        track.playlist=playlist; // creation of a foreign key < favoriteId >
        return await track.save()

    }

    async deleteTrack(id:number):Promise<DeleteResult>{
        const result= await this.trackRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`track with id = ${id} not found`)
        }
        return result;
    }

    async checkType(track:Track,music?:Music,song?:Song) {
        if (music) {
            track.music= music;
            track.title= music.name;
            track.link = music.source;
        }else if (song) {
            track.song= song;
            track.title= song.name;
            track.link= song.source;
        }

        return await track.save();
    }
}
