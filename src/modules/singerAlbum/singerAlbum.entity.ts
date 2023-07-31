/* eslint-disable prettier/prettier */
import { artistAlbum } from "src/commons/classes/abstractAlbum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Singer } from "../singer/singer.entity";
import { Song } from "../song/song.entity";

@Entity('singerAlbums')
export class SingerAlbum extends artistAlbum{
   @ManyToOne(()=>Singer, singer=>singer.singerAlbums, {
    eager:false
   })
   singer:Singer;

   @OneToMany(()=>Song, song=>song.singerAlbum, {
      eager:true
   })
   songs:Song[];

   @Column()
   singerId:number;
}