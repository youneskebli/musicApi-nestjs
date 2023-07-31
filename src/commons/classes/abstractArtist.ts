/* eslint-disable prettier/prettier */
import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../enums/gender.enum";
import { artistType } from "../enums/artist-type.enum";

export abstract class abstractArtist extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column()
    info:string;

    @Column()
    image:string;

    @Column(
        {
            type:'enum',
            enum:Gender,
            array:false
        }
    )
    gender:Gender;

    @Column()
    nationality: string;

    @Column(
        {
            type:'enum',
            enum:artistType,
            array:false
        }
    )
    type:artistType;

    
}