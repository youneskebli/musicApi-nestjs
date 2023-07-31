/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SingerAlbum } from "./singerAlbum.entity";
import { DeleteResult, Repository } from "typeorm";
import { Song } from "../song/song.entity";
import { AwsService } from "src/shared/modules/aws/aws.service";
import { CreateAlbumDto } from "src/shared/dto/createAlbum.dto";
import { songType } from "src/commons/enums/song-type.enum";
import { songLanguage } from "src/commons/enums/song-languages.enum";

@Injectable()
export class SingerAlbumService {
    constructor(@InjectRepository(SingerAlbum) private singerAlbumRepository:Repository<SingerAlbum>,
                                               private awsService:AwsService
    ){}

    async getAllSingerAlbums():Promise<SingerAlbum[]>{
        return await this.singerAlbumRepository.find();
    }

    async getOneSingerAlbum(id:number):Promise<SingerAlbum>{
        const singerAlbum=await this.singerAlbumRepository.findOne({
            where:{id}
        })
        if (!singerAlbum) {
            throw new NotFoundException('album withthis id does not exist')
        }
        return singerAlbum;
    }
    
    async createSong(id:number,name: string, description: string,
        artist: string, type: songType, language: songLanguage, source: any):Promise<Song>{

            const song= new Song();
            const singerAlbum= await this.getOneSingerAlbum(id);

            song.name=name;
            song.description=description;
            song.artist=artist;
            song.type=type;
            song.language=language;
            song.tempImage=singerAlbum.albumImage;
            song.source= await this.awsService.fileUpload(source,'songs')
            
            song.singerAlbum=singerAlbum;
            const savedSong= await song.save();
            return savedSong;
    
    }

    async updateSingerAlbum(id:number,updateAlbum:CreateAlbumDto):Promise<SingerAlbum> {
        const singerAlbum= await this.getOneSingerAlbum(id);
        const {name} =updateAlbum;
        if (name) {
            singerAlbum.name=name;
        }
        const savedSingerAlbum= await singerAlbum.save();
        return savedSingerAlbum;
    }

    async deleteSingerAlbum(id:number):Promise<DeleteResult> {
        const result = await this.singerAlbumRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('singer album with this id not found');
        }
        return result;
    }
}