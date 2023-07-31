/* eslint-disable prettier/prettier */
import { abstractArtist } from "src/commons/classes/abstractArtist";
import { Entity, OneToMany, Unique } from "typeorm";
import { SingerAlbum } from "../singerAlbum/singerAlbum.entity";

@Entity('singers')
@Unique(['name'])
export class Singer extends abstractArtist {
   @OneToMany(()=>SingerAlbum, singerAlbum=>singerAlbum.singer, {
    eager:true
   })
   singerAlbums:SingerAlbum[];
}