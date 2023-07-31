/* eslint-disable prettier/prettier */
import { songLanguage } from "src/commons/enums/song-languages.enum";
import { songType } from "src/commons/enums/song-type.enum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { SingerAlbum } from "../singerAlbum/singerAlbum.entity";
import { abstractMusic } from "src/commons/classes/abstractMusic";
import { Track } from "../track/track.entity";

@Entity('songs')
export class Song extends abstractMusic{
  @Column({
    type:'enum',
    enum:songType,
    array:false
  })
  type:songType;

  @Column({
    type:'enum',
    enum:songLanguage,
    array:false
  })
  language:songLanguage;

  @ManyToOne(()=> SingerAlbum, singerAlbum=>singerAlbum.songs, {
    eager:false
  })
  singerAlbum:SingerAlbum;

  @OneToMany(() => Track, track => track.song,{
    eager:true
  })
  tracks:Track[];


  @Column()
  singerAlbumId:number;
}