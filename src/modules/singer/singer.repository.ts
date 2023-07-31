/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { Singer } from "./singer.entity";
import { artistType } from "src/commons/enums/artist-type.enum";
import { Gender } from "src/commons/enums/gender.enum";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SingerRepository extends Repository<Singer>{
  constructor(private datasource:DataSource){
    super(Singer,datasource.createEntityManager())
  }
    async getLimitedSingers(limit:number):Promise<Singer[]>{
      const query= this.createQueryBuilder('singer').select();
      if (limit) {
        query.limit(limit)
      }
      const singers= await query.leftJoinAndSelect('singer.singerAlbums','singerAlbum').getMany();
      return singers;
    }

    async getFilteredSingers(limit:number, nationality:string,type:artistType,gender:Gender):Promise<Singer[]>{
        const query= await this.createQueryBuilder('singer').select();
        if (limit) {
            query.limit(limit)
        }

        if (nationality) {
            query.where('singer.nationality LIKE :nationality', {nationality});
        }

        if (type) {
            query.andWhere('singer.type= :type', {type})
        }

        if (gender) {
            query.andWhere('singer.gender= :gender',{gender})
        }
        const singers= await query.leftJoinAndSelect('singer.singerAlbums','singerAlbum').getMany();
      return singers;
    }
}