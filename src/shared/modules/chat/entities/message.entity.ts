import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from "src/modules/auth/entities/user.entity";

@Entity('messages')
export class Message extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    text:string;

    @Column()
    created:Date;

    @Column()
    roomName:string;

    @Column()
    sender:string;

    @ManyToOne(()=>Room,room=>room.messages,{
        eager:false
    })
    room:Room;

    @ManyToOne(()=>User,user=>user.messages,{
        eager:false
    })
    user:User;

    //for keys
    @Column()
    userId:number;
    //for keys
    @Column()
    roomId:number;



}