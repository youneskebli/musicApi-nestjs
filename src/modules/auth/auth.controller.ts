/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { CreateProfileDto } from "./dto/profile.dto";
import { AuthService } from "./auth.service";
import { EmailLoginDto } from "./dto/emailLogin.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthGuard } from "@nestjs/passport";
import { UserAuthGuard } from "src/commons/guards/user-auth.guard";
import { Role } from "src/commons/enums/role.enum";
import { Roles } from "src/commons/decorators/roles.decorator";
import { GetAuthenticatedUser } from "src/commons/decorators/authenticated-user.decorator";
import { User } from "./entities/user.entity";
import { AdminAuthGuard } from "src/commons/guards/admin-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService) {}

    @Post('register/user')
    signup(
        @Body('authCredentialsDto') authCredentialsDto:AuthCredentialsDto,
        @Body('createProfileDto') createProfileDto:CreateProfileDto
    ){
      return this.authService.signUp(authCredentialsDto,createProfileDto);
    }

    @Post('login/user')
    SignInUser(@Body('emailLoginDto') emailLoginDto:EmailLoginDto) {
      return this.authService.signInUser(emailLoginDto);
    }

    @Get('email/send-email-verification/:email')
    async sendEmailVerification(@Param('email') email: string) {
      await this.authService.createEmailToken(email);
      return this.authService.sendEmailVerification(email);
    }
  
    @Get('email/verify/:token')
    verifyEmail(@Param('token') token: string) {
      return this.authService.verifyEmail(token);
    }

    @Get('email/forgot-password/:email')
    sendEmailForgotPassword(@Param('email') email: string) {
      return this.authService.sendEmailForgottenPassword(email);
    }
  
    @Post('email/reset-password')
    setNewPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return this.authService.setNewPassword(resetPasswordDto);
    }

    
    @Get('user-main-data')
    @UseGuards(AuthGuard(),UserAuthGuard)
    @Roles([Role.USER])
    getUserData(@GetAuthenticatedUser() user:User){
       return this.authService.getUserMainData(user);
    }

    @Delete('delete-user-account')
    @UseGuards(AuthGuard(), UserAuthGuard)
    @Roles([Role.USER])
    deleteUserAccount(@GetAuthenticatedUser() user: User) {
      return this.authService.deleteUserAccount(user);
    }

    @Get('check-username/:username')
    isValidUsername(@Param('username') username: string) {
      return this.authService.isValidUsername(username);
    }

    @Post('login/admin')
    SignInAdmin(@Body('emailLoginDto') emailLoginDto:EmailLoginDto) {
      return this.authService.signInAdmin(emailLoginDto);
    }

    @Get('system-users')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  getSystemUsers() {
    return this.authService.getSystemUsers();
  }

  @Get('users/:id')
  getUserById(@Param('id') id: number) {
    return this.authService.getUserById(id);
  }

  @Put('edit-user-roles/:userId')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles([Role.ADMIN])
  editUserRoles(@Param('userId') userId: number, @Body() roles: Role[]) {
    return this.authService.editUserRoles(userId, roles);
  }
    
    
}