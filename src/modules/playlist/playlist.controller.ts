import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { GetAuthenticatedUser } from 'src/commons/decorators/authenticated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { PlaylistDto } from './dto/playlist.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthGuard } from 'src/commons/guards/user-auth.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/commons/enums/role.enum';


@UseGuards(AuthGuard(),UserAuthGuard)
@Roles([Role.USER])
@Controller('playlists')
export class PlaylistController {
    constructor(private readonly playlistService:PlaylistService) {}

    @Get('user-playlists')
    getUserPlaylists(@GetAuthenticatedUser() user:User) {
        return this.playlistService.getUserPlaylists(user)
    }

    @Get(':id')
    getOneUserPlaylist(@Param('id') id:number) {
       return this.playlistService.getOnePlaylist(id)
    }

    @Post('new-playlist')
    CreatePlaylist(@GetAuthenticatedUser() user:User,@Body() createPlaylistDto:PlaylistDto) {
       return this.playlistService.CreateNewPlaylist(user,createPlaylistDto)
    }


    @Put(':id/update-playlist')
    updatePlaylist(@Param('id') id:number,@Body() updatePlaylistDto:PlaylistDto) {
        return this.playlistService.UpdatePlaylist(id,updatePlaylistDto)
    }

    @Delete(':id/delete-playlist')
    deletePlaylist(@Param('id') id:number) {
       return this.playlistService.deletePlaylist(id)
    }

    @Delete(':id/clear-playlist')
  clearPlaylistContent(@Param('id') id: number) {
    return this.playlistService.clearPlaylistContent(id);
  }

  @Delete(':playlistId/remove-track-from-playlist/:trackId')
  removeTrackFromFavoriteList(@Param('playlistId') playlistId: number,
                              @Param('trackId') trackId: number) {
    return this.playlistService.removeTrackFromPlaylist(playlistId, trackId);

  }





   
}
