/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { songLanguage } from "src/commons/enums/song-languages.enum";
import { songType } from "src/commons/enums/song-type.enum";
import { SongService } from "./song.service";
import { AuthGuard } from "@nestjs/passport";
import { UserAuthGuard } from "src/commons/guards/user-auth.guard";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";
import { AdminAuthGuard } from "src/commons/guards/admin-auth.guard";

@Controller('songs')
export class SongController {
    constructor(private readonly songService:SongService){
      
    }
    @Get()
    getAllSongs(){
        return this.songService.getAllSongs();
    }

    @Get('limit')
    getLimitedSongs(@Query('limit') limit:number){
        return this.songService.getLimitedSongs(limit);
    }

    @Get('filtered')
    getFilteredSongs(@Query('limit') limit:number,
                     @Query('type') type:songType,
                     @Query('language') language:songLanguage,
                     @Query('rate') rate:number
    ){
          return this.songService.getFilteredSongs(limit,type,language,rate);
    }

    @Get(':id')
    getSong(@Param('id') id:number){
        return this.songService.getOneSong(id);
    }

    @Put(':id/update-song')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    updateSong(@Param('id') id:number,
               @Body('name') name:string,
               @Body('description') description:string,
               @Body('artist') artist:string,
               @Body('type') type:songType,
               @Body('language') language:songLanguage,
               @Body('source') source:any
    ){
        return this.songService.updateSong(id,name,description,artist,type,language,source);
    }
    
    @Delete(':id/delete-song')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    deleteSong(@Param('id') id:number){
        return this.songService.deleteSong(id);
    }

    @Post(':songId/save-to-favoritelist/:favoriteId')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    addToFav(@Param('songId') songID:number,@Param('favoriteId') favoriteId:number){
        return this.songService.pushToFavList(songID,favoriteId)
    }

    @Post(':songId/save-to-playlist/:playlistId')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    addToPlaylist(@Param('songId') songID:number,@Param('playlistId') playlistId:number){
        return this.songService.pushToPlaylist(songID,playlistId)
    }

}