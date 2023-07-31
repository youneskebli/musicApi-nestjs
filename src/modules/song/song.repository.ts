/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { Song } from "./song.entity";
import { songLanguage } from "src/commons/enums/song-languages.enum";
import { songType } from "src/commons/enums/song-type.enum";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SongRepository extends Repository<Song> {
    constructor(private datasource:DataSource){
        super(Song,datasource.createEntityManager())
    }
    async getLimitedSongs(limit:number):Promise<Song[]>{
        const query =this.createQueryBuilder('song').select();
        if (limit) {
            query.limit(limit)
        }
    
        const songs= await query.leftJoinAndSelect('song.tracks','track').getMany();
        return songs;
    }

    async getFilteredSongs(limit:number, type:songType,rate:number,language:songLanguage):Promise<Song[]> {
        const query= this.createQueryBuilder('song').select();
        if(limit){
            query.limit(limit)
        }

        if (type) {
            query.where('song.type LIKE :type',{type})
        }

        if (rate) {
            query.andWhere('song.rate = :type',{rate})
        }
        

        if (language) {
            query.andWhere('song.language LIKE :=language', {language})
        }

        const songs= await query.leftJoinAndSelect('song.tracks','track').getMany();
        return songs;
    }
}