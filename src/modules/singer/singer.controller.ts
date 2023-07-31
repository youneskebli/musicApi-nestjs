/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { artistType } from "src/commons/enums/artist-type.enum";
import { Gender } from "src/commons/enums/gender.enum";
import {CreateAlbumDto } from "src/shared/dto/createAlbum.dto";
import { SingerService } from "./singer.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@nestjs/passport";
import { AdminAuthGuard } from "src/commons/guards/admin-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";




@Controller('singers')
export class SingerController {
     constructor(private singerService:SingerService){}
    
    @Get()
    getSingers(){
        return this.singerService.getAllSingers();
    }

    @Get('limit')
    getLimittedSingers(@Query('limit') limit:number){
        return this.singerService.getLimitedSingers(limit);
    }

    @Get(':id')
    getSinger(@Param('id') id:number) {
        return this.singerService.getOneSinger(id);
    }

    @Get('filtered')
    getFilteredSinger(@Query('limit') limit:number,
                      @Query('type') type:artistType,
                      @Query('gender') gender:Gender,
                      @Query('nationality') nationality:string
    ){
        return this.singerService.getFilteredSinger(limit,type,nationality,gender);
    }

    
    @Post()
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    @UseInterceptors(FileInterceptor('image'))
    createSinger(
        @Body('name') name:string,
        @Body('info') info:string,
        @Body('gender') gender:Gender,
        @Body('nationality') nationality:string,
        @Body('type') type:artistType,
        @UploadedFile() image:any
    ){
        return this.singerService.createNewSinger(name,info,gender,nationality,type,image);
    }

    @Post(':id/new-album')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    createAlbum(@Param('id') id:number,
                @Body('createSongAlbum') createSongAlbum:CreateAlbumDto
     ){
       return this.singerService.createSingerAlbum(id,createSongAlbum)
     }

     @Put(':id/update-singer')
     @UseGuards(AuthGuard(), AdminAuthGuard)
     @Roles([Role.ADMIN])
     @UseInterceptors(FileInterceptor('image'))
     updateSinger(  @Param('id') id:number,
                    @Body('name') name:string,
                    @Body('info') info:string,
                    @Body('gender') gender:Gender,
                    @Body('nationality') nationality:string,
                    @Body('type') type:artistType,
                    @UploadedFile() image:any
     ){
      
      return this.singerService.updateSinger(id,name,info,gender,nationality,type,image)
     }

     @Delete(':id/delete-singer')
     @UseGuards(AuthGuard(), AdminAuthGuard)
     @Roles([Role.ADMIN])
     deleteSinger(@Param('id') id:number){
        return this.singerService.deleteSinger(id);
     }
}