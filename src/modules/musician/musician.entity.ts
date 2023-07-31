/* eslint-disable prettier/prettier */
import { abstractArtist } from "src/commons/classes/abstractArtist";
import { Entity, OneToMany, Unique } from "typeorm";
import { MusicianAlbum } from "../musicianAlbum/musicianAlbum.entity";

@Entity('musicians')
@Unique(['name'])
export class Musician extends abstractArtist{
   @OneToMany(()=>MusicianAlbum, musicianAlbum=>musicianAlbum.musician,{
    eager:true
   })
   musicianAlbums:MusicianAlbum[];
}