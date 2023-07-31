import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from 'src/commons/guards/user-auth.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/commons/enums/role.enum';
import { GetAuthenticatedUser } from 'src/commons/decorators/authenticated-user.decorator';
import { User } from 'src/modules/auth/entities/user.entity';
import { RoomDto } from './dto/room.dto';


@UseGuards(AuthGuard(),UserAuthGuard)
@Roles([Role.USER])
@Controller('chat')
export class ChatController {
    constructor(private chatService:ChatService){}

    
    @Get()
    getAllRooms(){
        return this.chatService.getAllRooms();
    }

    @Get(':id')
    getOneRoom(@Param('id') id:number){
        return this.chatService.getOneRoom(id);
    }

    @Get('user-rooms')
    getUserRooms(@GetAuthenticatedUser() user:User){
        return this.chatService.getUserRooms(user)
    }
    
    @Post()
    createRoom(@GetAuthenticatedUser() user:User,@Body() createRoomDto:RoomDto){
        return this.chatService.createNewRoom(user,createRoomDto)
    }

    @Put(':id/edit-room')
    editRoom(@Param('id') id:number,@Body() updateRoomDto:RoomDto){
        return this.chatService.updateRoom(id,updateRoomDto)
    }

    @Delete(':id/delete-room')
    deleteRoom(@Param('id') id:number) {
        return this.chatService.deleteRoom(id)
    }



}
