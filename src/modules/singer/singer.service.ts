/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { } from '@nestjs/typeorm';
import { SingerRepository } from './singer.repository';
import { Singer } from './singer.entity';
import { artistType } from 'src/commons/enums/artist-type.enum';
import { Gender } from 'src/commons/enums/gender.enum';
import { CreateAlbumDto } from 'src/shared/dto/createAlbum.dto';
import { SingerAlbum } from '../singerAlbum/singerAlbum.entity';
import { DeleteResult } from 'typeorm';
import { AwsService } from 'src/shared/modules/aws/aws.service';
import { SingerAlbumService } from '../singerAlbum/singerAlbum.service';

@Injectable()
export class SingerService {
    constructor( private readonly singerRepository:SingerRepository,
                 private readonly awsService:AwsService,
                 private singerAlbumService:SingerAlbumService
        ){}
    async getAllSingers():Promise<Singer[]>{
        return await this.singerRepository.find()
    }

    async getOneSinger(id:number):Promise<Singer> {
        const singer = await this.singerRepository.findOne({where:{id}})
        if (!singer) {

            throw new NotFoundException('singer with this id does not exist')

        }
        return singer;
    }

    async getLimitedSingers(limit:number):Promise<Singer[]> {
        return await this.singerRepository.getLimitedSingers(limit)
    }

    async getFilteredSinger(limit:number,type:artistType,nationality:string,gender:Gender):Promise<Singer[]>{
        return await this.singerRepository.getFilteredSingers(limit,nationality,type,gender)
    }

    async createNewSinger(name:string,info:string,gender:Gender,nationality:string,type:artistType,image:any):Promise<Singer>{
        const singer = new Singer();
        singer.name=name;
        singer.info=info;
        singer.gender=gender;
        singer.nationality=nationality;
        singer.type=type;
        singer.singerAlbums=[],
        singer.image=await this.awsService.fileUpload(image,'singer-images')
        const savedSinger= await singer.save()
        return savedSinger;
    }

    async createSingerAlbum(id:number,createSingerAlbum:CreateAlbumDto):Promise<SingerAlbum>{
        const singer= await this.getOneSinger(id);
        const singerAlbum= new SingerAlbum();
        const {name} =createSingerAlbum;

        singerAlbum.name=name;
        singerAlbum.singer=singer;
        singerAlbum.albumImage=singer.image;

        const savedSingerAlbum = await singerAlbum.save();
        return savedSingerAlbum;
    }

    async updateSinger(id:number,name:string,info:string,gender:Gender,nationality:string,type:artistType,image:any):Promise<Singer>{
        const singer= await this.getOneSinger(id);
        if (name) {
            singer.name=name
        }
        if (type) {
            singer.type=type
        }
        if (info) {
            singer.info=info
        }
        if (gender) {
            singer.gender=gender
        }
        if (nationality) {
            singer.nationality=nationality
        }
        if (image) {
            await this.awsService.fileDelete(singer.image)
            singer.image= await this.awsService.fileUpload(image,'singer-images')
        }
        const savedSinger =await singer.save()
        return savedSinger;
    }

    async deleteSinger(id:number):Promise<DeleteResult> {
        const singer = await this.getOneSinger(id);
        if (singer.image) {
            return this.awsService.fileDelete(singer.image);
        }
        for (let i = 0; i < singer.singerAlbums.length; i++) {
            await this.singerAlbumService.deleteSingerAlbum(singer.singerAlbums[i].id)
          }
        const result= await this.singerRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('singer with this id does not exist')
        }
        return result;
    }
}
