import { User } from "src/modules/auth/entities/user.entity";
import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubsriberNotification } from "./subscriberNotification.entity";
import { Key } from "../classes/key";

@Entity('subscribers')
export class Subscriber extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    endpoint: string;
  
    @Column({nullable: true})
    expirationTime: Date;
  
    @Column('simple-json')
    keys: Key;

    @OneToOne(()=>User,user=>user.subscriber,{
        eager:true
    })
    user:User;

    @OneToMany(()=>SubsriberNotification,subscriberNotification=>subscriberNotification.subscriber,{
        eager:true
    })
    subscriberNotifications:SubsriberNotification[];
}