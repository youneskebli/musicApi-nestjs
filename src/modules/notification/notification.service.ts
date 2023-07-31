import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import {  Repository } from 'typeorm';
import {SubsriberNotification} from './entities/subscriberNotification.entity'
import { User } from '../auth/entities/user.entity';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationPayload } from './classes/notification-payload';
import { NotificationData } from './classes/notification-data';
import * as webPush from 'web-push';
import { NotificationPayloadDto } from './notification-payload.dto';
import { Notification } from './classes/notification';

@Injectable()
export class NotificationService {
    constructor(@InjectRepository(Subscriber) private subscriberRepository:Repository<Subscriber>,
      @InjectRepository(SubsriberNotification) private subscriberNotificationRepository:Repository<SubsriberNotification>
    ){
    
    }

    async getAllSubscribers():Promise<Subscriber[]> {
          return await this.subscriberRepository.find()
    }

    async getOneSubscriber(id:number):Promise<Subscriber> {
       const subscriber= await this.subscriberRepository.findOne({
        where: {
            id,
        }
       });
       if (!subscriber) {
        throw new NotFoundException('subscriber not found')
       }
       return subscriber;
    }


    async getSubscriberNotification(id:number):Promise<SubsriberNotification[]> {
         const subscriber= await this.getOneSubscriber(id);
         return subscriber.subscriberNotifications;
    }

    async deleteSubscriber(id:number):Promise<void> {
       const subscriber= await this.getOneSubscriber(id);
       for (let i = 0; i < subscriber.subscriberNotifications.length; i++) {
        await this.subscriberNotificationRepository.delete(subscriber.subscriberNotifications[i].id)
       }
       const result= await this.subscriberRepository.delete(id);
       if (result.affected === 0) {
        throw new NotFoundException('subscriber not found')
       }
    }

    async newSubscriber(user:User,sub:any):Promise<Subscriber> {
        const {endpoint,expirationTime,keys}= sub;
        const subscriber = new Subscriber()
        subscriber.user= user;
        subscriber.endpoint=endpoint;
        subscriber.expirationTime=expirationTime;
        subscriber.keys=keys;
        subscriber.subscriberNotifications=[];
        return await subscriber.save()
    }
    async createNotification(title:string,body:string) {
       const notification = new NotificationEntity();
       notification.title=title;
       notification.body=body;
       notification.subsriberNotifications= [];
       return await notification.save();
    }

    async sendNewNotification(notificationPayloadDto:NotificationPayloadDto):Promise<void> {
       const {title, body} = notificationPayloadDto;
       const notificationPayload = new NotificationPayload();
       
       notificationPayload.notification=new Notification;
       notificationPayload.notification.title = title;
       notificationPayload.notification.body = body;
       notificationPayload.notification.actions = [
         {
           action: 'explore',
           title: 'explore my new website',
         },
         {
           action: 'explore',
           title: 'Close Popups',
         },
       ];
       notificationPayload.notification.data= new NotificationData();
       notificationPayload.notification.data.dateOfArrival= new Date(Date.now())
       notificationPayload.notification.data.primaryKey= 1;
       notificationPayload.notification.icon =
       'https://songs-static.s3.us-east-2.amazonaws.com/main-page-logo-small-hat.png';
     notificationPayload.notification.vibrate = [100, 50, 100];
     const subscribers = await this.getAllSubscribers();
     const notification = await this.createNotification(title, body);
     for (let i = 0; i < subscribers.length; i++) {
       await this.createSubscriberNotification(
         notificationPayload, notification, subscribers[i],
       );
       await webPush.sendNotification(subscribers[i], JSON.stringify(notificationPayload));
     }

     
    }

    async createSubscriberNotification(notificationPayload: NotificationPayload,
        notification: NotificationEntity,
        subscriber: Subscriber): Promise<void> {
const subscribeNotification = new SubsriberNotification();
subscribeNotification.title = notificationPayload.notification.title;
subscribeNotification.body = notificationPayload.notification.body;
subscribeNotification.data = notificationPayload.notification.data;
subscribeNotification.actions = notificationPayload.notification.actions;
subscribeNotification.vibrate = notificationPayload.notification.vibrate;

//creation of foreign keys
subscribeNotification.subscriber = subscriber;
subscribeNotification.notification = notification;
await subscribeNotification.save();

}
}
