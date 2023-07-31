/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { artistType } from "src/commons/enums/artist-type.enum";
import { Gender } from "src/commons/enums/gender.enum";
import { Musician } from "./musician.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MusicianRepository extends Repository<Musician>{
  constructor(private datasource:DataSource){
    super(Musician,datasource.createEntityManager())
  }
    async getLimitedMusicians(limit:number):Promise<Musician[]>{
      const query= this.createQueryBuilder('musician').select();
      if (limit) {
        query.limit(limit)
      }
      const musicians= await query.leftJoinAndSelect('musician.musicianAlbums','musicianAlbum').getMany();
      return musicians;
    }

    async getFilteredMusicians(limit:number, nationality:string,type:artistType,gender:Gender):Promise<Musician[]>{
        const query= await this.createQueryBuilder('musician').select();
        if (limit) {
            query.limit(limit)
        }

        if (nationality) {
            query.where('musician.nationality LIKE :nationality', {nationality});
        }

        if (type) {
            query.andWhere('musician.type= :type', {type})
        }

        if (gender) {
            query.andWhere('musician.gender= :gender',{gender})
        }
        const musicians= await query.leftJoinAndSelect('musician.musicianAlbums','musicianAlbum').getMany();
      return musicians;
    }
}