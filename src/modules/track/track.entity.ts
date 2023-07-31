/* eslint-disable prettier/prettier */
import { BaseEntity, Column, Entity, Generated, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Playlist } from "../playlist/playlist.entity";
import { Music } from "../music/music.entity";
import { Song } from "../song/song.entity";
import { Fav } from "../fav/fav.entity";

@Entity('tracks')
export class Track extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    link:string;

    @Generated()
    @Column()
    index:number;

    @ManyToOne(() => Playlist, playlist => playlist.tracks,{
        eager:false
    })
    playlist:Playlist;


    @ManyToOne(() => Music, music => music.tracks,{
        eager:false
    })
    music:Music;


    @ManyToOne(() => Song, song => song.tracks,{
        eager:false
    })
    song:Song;


    @ManyToOne(() => Fav, fav => fav.tracks,{
        eager:false
    })
    fav:Fav;

    @Column({
        nullable:true
    })
    songId:number;

    @Column({
        nullable:true
    })
    musicId:number;

    @Column({
        nullable:true
    })
    playlistId:number;

    @Column({
            nullable:true
    })
    favId:number;

    

}