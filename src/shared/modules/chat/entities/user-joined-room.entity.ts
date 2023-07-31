import { BaseEntity, Column, Entity ,ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from "src/modules/auth/entities/user.entity";

@Entity('user-joined-rooms')
export class UserJoinedRoom extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({default:new Date()})
    joinedIn:Date;

    @Column()
    joinedUsername:string;

    @ManyToOne(()=>Room,room=>room.userJoinedRooms,{
        eager:false
    })
    room:Room;

    @ManyToOne(()=>User,user=>user.userJoinedRooms,{
        eager:false
    })
    user:User;

    @Column()
    roomId:number;

    @Column()
    userId:number;

    
    
}