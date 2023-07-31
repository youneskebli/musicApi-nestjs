/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { artistType } from "src/commons/enums/artist-type.enum";
import { Gender } from "src/commons/enums/gender.enum";
import { CreateAlbumDto } from "src/shared/dto/createAlbum.dto";
import { MusicianService } from "./musician.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@nestjs/passport";
import { AdminAuthGuard } from "src/commons/guards/admin-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";

@Controller('musicians')
export class MusicianController {
    constructor(private readonly musicianService:MusicianService){}
    
    @Get()
    getMusicians(){
        return this.musicianService.getAllMusicians();
    }

    @Get(':id')
    getMusician(@Param('id') id:number) {
        return this.musicianService.getOneMusician(id)
    }

    @Get('limit')
    getLimittedMusicians(@Query('limit') limit:number){
        return this.musicianService.getLimitedMusicians(limit);
    }

    @Get('filtered')
    getFilteredMusicians(
                      @Query('limit') limit:number,
                      @Query('type') type:artistType,
                      @Query('gender') gender:Gender,
                      @Query('nationality') nationality:string
    ){
        return this.musicianService.getFilteredMusicians(limit,type,nationality,gender);
    }

    @Post()
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    @UseInterceptors(FileInterceptor('image'))
    createMusician(
        @Body('name') name:string,
        @Body('info') info:string,
        @Body('gender') gender:Gender,
        @Body('nationality') nationality:string,
        @Body('type') type:artistType,
        @UploadedFile() image:any
    ){
        return this.musicianService.createNewMusician(name,info,gender,nationality,type,image);
    }

    @Post(':id/new-album')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    createAlbum(@Param('id') id:number,
                @Body('createSongAlbum') createMusicAlbum:CreateAlbumDto
     ){
        return this.musicianService.createMusicianAlbum(id,createMusicAlbum);
     }

     @Put(':id/update-musician')
     @UseGuards(AuthGuard(), AdminAuthGuard)
     @Roles([Role.ADMIN])
     @UseInterceptors(FileInterceptor('image'))
     updateMusician(
                    @Param('id') id:number,
                    @Body('name') name:string,
                    @Body('info') info:string,
                    @Body('gender') gender:Gender,
                    @Body('nationality') nationality:string,
                    @Body('type') type:artistType,
                    @UploadedFile() image:any
     ){
      return this.musicianService.updateMusician(id,name,info,gender,nationality,type,image)
     }

     @Delete(':id/delete-musician')
     @UseGuards(AuthGuard(), AdminAuthGuard)
     @Roles([Role.ADMIN])
     deleteMusician(@Param('id') id:number){
        return this.musicianService.deleteMusician(id);
     }
}