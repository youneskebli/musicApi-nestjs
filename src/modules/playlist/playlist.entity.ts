/* eslint-disable prettier/prettier */
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/entities/user.entity";
import { Track } from "../track/track.entity";

@Entity('playlists')
export class Playlist extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column({
        default: new Date(),
    })
    CreatedAt:Date;

    @ManyToOne(() => User, user => user.playlists, {
        eager:false
    })
    user:User;

    @OneToMany(() => Track, track => track.playlist,{
        eager:true,
      })
      tracks:Track[];

    @Column()
    userId:number;
}