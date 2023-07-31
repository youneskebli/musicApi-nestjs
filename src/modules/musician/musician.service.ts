/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { } from '@nestjs/typeorm';
import { artistType } from 'src/commons/enums/artist-type.enum';
import { Gender } from 'src/commons/enums/gender.enum';
import { CreateAlbumDto } from 'src/shared/dto/createAlbum.dto';
import { DeleteResult } from 'typeorm';
import { AwsService } from 'src/shared/modules/aws/aws.service';
import { MusicianRepository } from './musician.repositori';
import { Musician } from './musician.entity';
import { MusicianAlbum } from '../musicianAlbum/musicianAlbum.entity';
import { MusicianAlbumService } from '../musicianAlbum/musicianAlbum.service';

@Injectable()
export class MusicianService {
    constructor( private readonly musicianRepository:MusicianRepository,
                 private readonly awsService:AwsService,
                 private musicianAlbumService:MusicianAlbumService
        ){}
    async getAllMusicians():Promise<Musician[]>{
        return await this.musicianRepository.find()
    }

    async getOneMusician(id:number):Promise<Musician> {
        const musician = await this.musicianRepository.findOne({where:{id}})
        if (!musician) {

            throw new NotFoundException('musician with this id does not exist')

        }
        return musician;
    }

    async getLimitedMusicians(limit:number):Promise<Musician[]> {
        return await this.musicianRepository.getLimitedMusicians(limit)
    }

    async getFilteredMusicians(limit:number,type:artistType,nationality:string,gender:Gender):Promise<Musician[]>{
        return await this.musicianRepository.getFilteredMusicians(limit,nationality,type,gender)
    }

    async createNewMusician(name:string,info:string,gender:Gender,nationality:string,type:artistType,image:any):Promise<Musician>{
        const musician = new Musician();
        musician.name=name;
        musician.info=info;
        musician.gender=gender;
        musician.nationality=nationality;
        musician.type=type;
        musician.musicianAlbums=[],
        musician.image=await this.awsService.fileUpload(image,'musicians-images')
        const savedMusician= await musician.save()
        return savedMusician;
    }

    async createMusicianAlbum(id:number,createMusicianAlbum:CreateAlbumDto):Promise<MusicianAlbum>{
        const musician= await this.getOneMusician(id);
        const musicianAlbum= new MusicianAlbum();
        const {name} =createMusicianAlbum;

        musicianAlbum.name=name;
        musicianAlbum.musician=musician;
        musicianAlbum.albumImage=musician.image;

        const savedMusicianAlbum = await musicianAlbum.save();
        return savedMusicianAlbum;
    }

    async updateMusician(id:number,name:string,info:string,gender:Gender,nationality:string,type:artistType,image:any):Promise<Musician>{
        const musician= await this.getOneMusician(id);
        if (name) {
            musician.name=name
        }
        if (type) {
            musician.type=type
        }
        if (info) {
            musician.info=info
        }
        if (gender) {
            musician.gender=gender
        }
        if (nationality) {
            musician.nationality=nationality
        }
        if (image) {
            await this.awsService.fileDelete(musician.image)
            musician.image= await this.awsService.fileUpload(image,'musicians-images')
        }
        const savedMusician =await musician.save()
        return savedMusician;
    }

    async deleteMusician(id:number):Promise<DeleteResult> {
        const musician = await this.getOneMusician(id);
        if (musician.image) {
            return this.awsService.fileDelete(musician.image);
        }
        for (let i = 0; i < musician.musicianAlbums.length; i++) {
           await this.musicianAlbumService.deleteMusicianAlbum(musician.musicianAlbums[i].id)
        }
        const result= await this.musicianRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('musician with this id does not exist')
        }
        return result;
    }
}
