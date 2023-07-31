import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubsriberNotification } from "./subscriberNotification.entity";

@Entity('notifications')
export class NotificationEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column()
    body: string;

    @OneToMany(()=>SubsriberNotification,subsriberNotification=>subsriberNotification.notification,{eager:true}
    )
    subsriberNotifications:SubsriberNotification[];

}