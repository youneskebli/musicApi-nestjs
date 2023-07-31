/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateAlbumDto } from "src/shared/dto/createAlbum.dto";
import { SingerAlbumService } from "./singerAlbum.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { songType } from "src/commons/enums/song-type.enum";
import { songLanguage } from "src/commons/enums/song-languages.enum";
import { AuthGuard } from "@nestjs/passport";
import { AdminAuthGuard } from "src/commons/guards/admin-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";

@Controller('singer-albums')
export class SingerAlbumController {
    constructor(private readonly singerAlbumService:SingerAlbumService){

    }

    @Get()
    getAllSingerAlbums(){
        return this.singerAlbumService.getAllSingerAlbums();
    }

    @Get(':id')
    getsingerAlbum(@Param('id') id:number){
        return this.singerAlbumService.getOneSingerAlbum(id);
    }

    @Post(':id/new-song')
    @UseInterceptors(FileInterceptor('source'))
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    createNewSong(
               @Param('id') id:number,
               @Body('name') name:string,
               @Body('description') description:string,
               @Body('artist') artist:string,
               @Body('type') type:songType,
               @Body('language') language:songLanguage,
               @UploadedFile() source:any
    ) {
        return this.singerAlbumService.createSong(id,name,description,artist,type,language,source)
    } 

    @Put(':id/update-album')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    updateAlbum(@Param('id') id:number, @Body() createAlbumDto:CreateAlbumDto){
        return this.singerAlbumService.updateSingerAlbum(id,createAlbumDto);
    }

    @Delete(':id/delete-album')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    deleteAlbum(@Param('id') id:number){
        return this.singerAlbumService.deleteSingerAlbum(id);
    }
}