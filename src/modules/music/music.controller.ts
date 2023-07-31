/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { musicType } from "src/commons/enums/music-type.enum";
import { MusicService } from "./music.service";
import { AuthGuard } from "@nestjs/passport";
import { UserAuthGuard } from "src/commons/guards/user-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";
import { AdminAuthGuard } from "src/commons/guards/admin-auth.guard";

@Controller('musics')
export class MusicController {
    constructor(private readonly musicService:MusicService){

    }
    @Get()
    getAllMusics(){
        return this.musicService.getAllMusics()
    }

    @Get('limit')
    getLimitedMusic(@Query('limit') limit:number){
        return this.musicService.getLimitedMusics(limit)
    }

    @Get('filtered')
    getFilteredMusic(@Query('limit') limit:number,
                     @Query('type') type:musicType,
                     @Query('rate') rate:number
    ){
          return this.musicService.getFilteredMusics(limit,type,rate);
    }

    @Get(':id')
    getMusic(@Param('id') id:number){
        return this.musicService.getOneMusic(id);
    }

    @Put(':id/update-music')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    updateMusic(@Param('id') id:number,
    @Body('name') name:string,
    @Body('description') description:string,
    @Body('artist') artist:string,
    @Body('type') type:musicType,
    @Body('source') source:any){
        return this.musicService.updateMusic(id,name,description,artist,type,source)
    }
    
    @Delete(':id/delete-music')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    deleteMusic(@Param('id') id:number){
        return this.musicService.deleteMusic(id);
    }

     
    @Post(':musicId/save-to-favoritelist/:favoriteId')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    addToFav(@Param('musicId') musicId:number,@Param('favoriteId') favoriteId:number){
        return this.musicService.pushToFavoriteList(musicId,favoriteId)
    }

    @Post(':musicId/save-to-playlist/:playlistId')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    addToPlaylist(@Param('musicId') musicId:number,@Param('playlistId') playlistId:number){
        return this.musicService.pushToPlaylist(musicId,playlistId)
    }


    

}