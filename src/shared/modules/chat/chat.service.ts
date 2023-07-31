import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import { Message } from './entities/message.entity';
import { UserJoinedRoom } from './entities/user-joined-room.entity';
import { RoomDto } from './dto/room.dto';


@Injectable()
export class ChatService {
    constructor(@InjectRepository(Room) private roomRepository:Repository<Room>,
    @InjectRepository(Message) private messageRepository:Repository<Message>,
    @InjectRepository(UserJoinedRoom) private userJoinedRoom:Repository<UserJoinedRoom>,
    
    ) {}

    async getAllRooms():Promise<Room[]> {
        return await this.roomRepository.find()
    }

    async getOneRoom(id:number):Promise<Room> {
        const room= await this.roomRepository.findOne({where:{id}})
        if (!room) {
            throw new NotFoundException('room does not exist')
        }
        return room;
    }

    async deleteUserMessages(user:User):Promise<void>{
       for (let index = 0; index < user.messages.length; index++) {
        await this.messageRepository.delete(user.messages[index].id)
       }
    }

    async deleteUserJoinedRooms(user:User):Promise<void>{
        for (let index = 0; index < user.userJoinedRooms.length; index++) {
         await this.messageRepository.delete(user.userJoinedRooms[index].id)
        }
     }

     async getUserRooms(user:User){
        const query= this.roomRepository.createQueryBuilder('room').select();
        query.where('room.createdBy LIKE :username',{username:user.username})
        const rooms= await query.getMany();
        return rooms;
     }

     async createNewRoom(user:User,createRoomDto:RoomDto):Promise<Room>{
         const {name} = createRoomDto;
         const room = new Room();
         room.name=name;
         room.createdBy=user.username;
         room.messages= [];
         room.userJoinedRooms= [];
         const savedRoom= await room.save();
         return savedRoom;
     }

     async updateRoom(id:number,updateRoomDto:RoomDto):Promise<Room>{
      const {name} = updateRoomDto;
      const user= await this.getOneRoom(id);
      if (name) {
        user.name=name
      }
      return await user.save();
     }

     async deleteRoom(id:number){
        const room=await this.getOneRoom(id);
        for (let index = 0; index < room.messages.length; index++) {
            await this.messageRepository.delete(room.messages[index].id)
        }

        for (let index = 0; index < room.userJoinedRooms.length; index++) {
            await this.userJoinedRoom.delete(room.userJoinedRooms[index].id)
        }
        const result= await this.roomRepository.delete(id)
        if (result.affected === 0) {
            throw new NotFoundException('room does not found')
        }
        return result;
     }
     
}
