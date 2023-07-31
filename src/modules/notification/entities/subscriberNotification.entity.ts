import { Subscriber } from "./subscriber.entity";
import { NotificationEntity } from "./notification.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NotificationData } from "../classes/notification-data";

@Entity('subsriberNotifications')
export class SubsriberNotification extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column()
    body: string;
  
  
    // Optional
    @Column('simple-json')
    data: NotificationData;
  
    @Column({
      type: 'jsonb',
      array: false,
    })
    actions: Array<{ title: string, action: string }>;
  
    @Column('int', {
      array: true,
    })
    vibrate: Array<number>;

    @ManyToOne(()=>Subscriber,subscriber=>subscriber.subscriberNotifications,{
        eager:false
    })
    subscriber:Subscriber;

    @ManyToOne(()=>NotificationEntity,notification=>notification.subsriberNotifications,{
        eager:false
    })
    notification:NotificationEntity;


    @Column()
    subscriberId:number;

    @Column()
    notificationId:number;

}