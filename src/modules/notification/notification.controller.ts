import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthenticatedUser } from 'src/commons/decorators/authenticated-user.decorator';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/commons/enums/role.enum';
import { AdminAuthGuard } from 'src/commons/guards/admin-auth.guard';
import { UserAuthGuard } from 'src/commons/guards/user-auth.guard';
import { User } from '../auth/entities/user.entity';
import { AcceptedAuthGuard } from 'src/commons/guards/accepted-auth.guard';
import { NotificationPayloadDto } from './notification-payload.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
    constructor(private notificationService: NotificationService) {
    }
  
    @Get('subscribers')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    getAllSubscribers() {
      return this.notificationService.getAllSubscribers();
    }
  
    @Get('subscribers/subscriber-notifications')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    getSubscriberNotifications(@GetAuthenticatedUser() user: User) {
      if (user.subscriberId) {
        return this.notificationService.getSubscriberNotification(user.subscriberId);
      } else {
        return null;
      }
    }
  
    @Get('subscribers/:id')
    @UseGuards(AuthGuard(), AcceptedAuthGuard)
    @Roles([Role.ADMIN, Role.USER])
    getSubscriberById(@Param('id', ParseIntPipe) id: number) {
      return this.notificationService.getOneSubscriber(id);
    }
  
  
    @Post('subscribers/new')
    @UseGuards(AuthGuard(), AcceptedAuthGuard)
    @Roles([Role.ADMIN, Role.USER])
    newSubscriber(@GetAuthenticatedUser() user: User, @Body() subscriber: any) {
      return this.notificationService.newSubscriber(user, subscriber);
    }
  
    @Post('send-notification')
    @UseGuards(AuthGuard(), AdminAuthGuard)
    @Roles([Role.ADMIN])
    sendNotification(@Body() notificationPayloadDto: NotificationPayloadDto) {
      return this.notificationService.sendNewNotification(notificationPayloadDto);
    }
}
