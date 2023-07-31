/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { AwsService } from "src/shared/modules/aws/aws.service";
import { CreateAlbumDto } from "src/shared/dto/createAlbum.dto";
import { MusicianAlbum } from "./musicianAlbum.entity";
import { Music } from "../music/music.entity";
import { musicType } from "src/commons/enums/music-type.enum";

@Injectable()
export class MusicianAlbumService {
    constructor(@InjectRepository(MusicianAlbum) private musicianAlbumRepository:Repository<MusicianAlbum>,
                                               private awsService:AwsService
    ){}

    async getAllMusicianAlbums():Promise<MusicianAlbum[]>{
        return await this.musicianAlbumRepository.find();
    }

    async getOneMusicianAlbum(id:number):Promise<MusicianAlbum>{
        const musicianAlbum=await this.musicianAlbumRepository.findOne({
            where:{id}
        })
        if (!musicianAlbum) {
            throw new NotFoundException('album with this id does not exist')
        }
        return musicianAlbum;
    }
    
    async createMusic(id:number,name: string, description: string,
        artist: string, type: musicType, source: any):Promise<Music>{

            const music= new Music();
            const musicianAlbum= await this.getOneMusicianAlbum(id);

            music.name=name;
            music.description=description;
            music.artist=artist;
            music.type=type;
            music.tempImage=musicianAlbum.albumImage;
            music.source= await this.awsService.fileUpload(source,'musics')
            
            music.musicianAlbum=musicianAlbum;
            const savedMusic= await music.save();
            return savedMusic;
    
    }

    async updateMusicianAlbum(id:number,updateAlbum:CreateAlbumDto):Promise<MusicianAlbum> {
        const musicianAlbum= await this.getOneMusicianAlbum(id);
        const {name} =updateAlbum;
        if (name) {
            musicianAlbum.name=name;
        }
        const savedMusicianAlbum= await musicianAlbum.save();
        return savedMusicianAlbum;
    }

    async deleteMusicianAlbum(id:number):Promise<DeleteResult> {
        const result = await this.musicianAlbumRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('musician album with this id not found');
        }
        return result;
    }
}