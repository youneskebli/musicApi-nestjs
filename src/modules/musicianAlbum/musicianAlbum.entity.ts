/* eslint-disable prettier/prettier */
import { artistAlbum } from "src/commons/classes/abstractAlbum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Musician } from "../musician/musician.entity";
import { Music } from "../music/music.entity";

@Entity('musicianAlbums')
export class MusicianAlbum extends artistAlbum{
   @ManyToOne(()=>Musician, musician=>musician.musicianAlbums, {
    eager:false
   })
   musician:Musician;


   @OneToMany(()=> Music, music=> music.musicianAlbum, {
    eager:true
   })
   musics:Music[];

   @Column()
   musicianId:number;
}