/* eslint-disable prettier/prettier */
import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

export class artistAlbum extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    albumImage:string;


}