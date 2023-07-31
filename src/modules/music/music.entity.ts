/* eslint-disable prettier/prettier */
import { abstractMusic } from "src/commons/classes/abstractMusic";
import { musicType } from "src/commons/enums/music-type.enum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { MusicianAlbum } from "../musicianAlbum/musicianAlbum.entity";
import { Track } from "../track/track.entity";

@Entity('musics')
export class Music extends abstractMusic{
    @Column({
        type:'enum',
        enum:musicType,
        array:false
    })
    type:musicType;

    @ManyToOne(()=> MusicianAlbum, musicianAlbum=> musicianAlbum.musics, {
        eager:false
    })
    musicianAlbum:MusicianAlbum;

    @OneToMany(() => Track, track => track.music,{
        eager:true
      })
      tracks:Track[];

    @Column()
    musicianAlbumId:number;


}