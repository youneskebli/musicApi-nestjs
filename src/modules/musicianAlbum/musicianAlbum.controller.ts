/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateAlbumDto } from "src/shared/dto/createAlbum.dto";
import { MusicianAlbumService } from "./musicianAlbum.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { musicType } from "src/commons/enums/music-type.enum";
import { AuthGuard } from "@nestjs/passport";
import { AdminAuthGuard } from "src/commons/guards/admin-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";

@Controller('musician-albums')
export class MusicianAlbumController {
    constructor(private readonly musicianAlbumService:MusicianAlbumService){}

    @Get()
    getAllMusicianAlbums(){
        return this.musicianAlbumService.getAllMusicianAlbums();
    }

    @Get(':id')
    getmusicianAlbum(@Param('id') id:number){
        return this.musicianAlbumService.getOneMusicianAlbum(id);
    }

    @Post(':id/new-music')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    @UseInterceptors(FileInterceptor('source'))
    createNewMusic(
               @Param('id') id:number,
               @Body('name') name:string,
               @Body('description') description:string,
               @Body('artist') artist:string,
               @Body('type') type:musicType,
               @UploadedFile() source:any
    ) {
        return this.createNewMusic(id,name,description,artist,type,source);
    } 

    @Put(':id/update-album')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    updateAlbum(@Param('id') id:number, @Body() createAlbumDto:CreateAlbumDto){
       return this.musicianAlbumService.updateMusicianAlbum(id,createAlbumDto);
    }

    @Delete(':id/delete-album')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    deleteAlbum(@Param('id') id:number){
        return this.musicianAlbumService.deleteMusicianAlbum(id);
    }
}