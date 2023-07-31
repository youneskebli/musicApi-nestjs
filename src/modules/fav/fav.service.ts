/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Fav } from "./fav.entity";
import { Repository } from "typeorm";
import { TrackService } from "../track/track.service";
import { Music } from "../music/music.entity";
import { Song } from "../song/song.entity";


@Injectable()
export class FavService {
    constructor(@InjectRepository(Fav) private favoriteRepository:Repository<Fav>,
    private trackService:TrackService
    ){}

    async getUserFavoriteList(id:number):Promise<Fav> {
         const favList =  await this.favoriteRepository.findOne({where:{id}})
         if (!favList) {
            throw new NotFoundException('favListDoesNotExist')
         }
         return favList;
    }

    async createFavoriteTrack(favoriteListId:number,song:Song,music:Music) {
         const favorite= await this.getUserFavoriteList(favoriteListId);
         const track = await this.trackService.pushToFavList(song,music,favorite);
         return track;
    }

    async clearFavoriteListContent(id:number):Promise<Fav> {
         const favorite= await this.getUserFavoriteList(id);
         for (let index = 0; index < favorite.tracks.length; index++) {
             await this.trackService.deleteTrack(favorite.tracks[index].id)
         }
         favorite.tracks= [];
         return await favorite.save();
    }

    async deleteFavoriteList(id:number):Promise<void>{
        await this.clearFavoriteListContent(id);
        const result = await this.favoriteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('favorite list does not found');
    }
    }

    async removeTrackFromFavouriteList(favouriteId: number, trackId: number): Promise<Fav> {
        const favorite = await this.getUserFavoriteList(favouriteId);
        for (let i = 0; i < favorite.tracks.length; i++) {
          if (trackId === favorite.tracks[i].id) {
            await this.trackService.deleteTrack(
              trackId,
            );
          }
        }
        return await favorite.save();
      }
}