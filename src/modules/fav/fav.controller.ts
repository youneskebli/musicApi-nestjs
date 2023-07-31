/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/commons/decorators/roles.decorator";
import { Role } from "src/commons/enums/role.enum";
import { UserAuthGuard } from "src/commons/guards/user-auth.guard";
import { FavService } from "./fav.service";

@UseGuards(AuthGuard(),UserAuthGuard)
@Roles([Role.USER])
@Controller('fav')
export class FavController {
    constructor(private readonly favService:FavService){}
    @Get(':id')
    getUserFavoriteList(@Param('id') id:number){
      return this.favService.getUserFavoriteList(id);
    }


    @Delete(':id/clear-favorite-list')
     clearFavoriteList(@Param('id') id:number){
      return this.favService.clearFavoriteListContent(id);
     }

     @Delete(':favoriteId/remove-track-from-favorite-list/:trackId')
     removeTrackFromFavoriteList(
        @Param('favoriteId') favoriteId:number,
        @Param('trackId') trackId:number
     ){
      return this.favService.removeTrackFromFavouriteList(favoriteId,trackId)
     }
}