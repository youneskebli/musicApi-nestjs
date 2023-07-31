/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { Music } from "./music.entity";
import { musicType } from "src/commons/enums/music-type.enum";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MusicRepository extends Repository<Music> {
    constructor(private dataSource:DataSource){
        super(Music,dataSource.createEntityManager())
    }
    async getLimitedMusic(limit:number):Promise<Music[]>{
        const query =this.createQueryBuilder('music').select();
        if (limit) {
            query.limit(limit)
        }
    
        const singers= await query.leftJoinAndSelect('music.tracks','track').getMany();
        return singers;
    }

    async getFilteredMusic(limit:number, type:musicType,rate:number):Promise<Music[]> {
        const query= this.createQueryBuilder('music').select();
        if(limit){
            query.limit(limit)
        }

        if (type) {
            query.where('music.type LIKE :type',{type})
        }

        if (rate) {
            query.andWhere('music.rate = :type',{rate})
        }

        const musics= await query.leftJoinAndSelect('music.tracks','track').getMany();
        return musics;
    }
}