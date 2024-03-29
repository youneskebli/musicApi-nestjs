/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, HttpException, HttpStatus, Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { CreateProfileDto } from "./dto/profile.dto";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt"
import { Profile } from "../profile/entities/profile.entity";
import { Fav } from "../fav/fav.entity";
import { Role } from "src/commons/enums/role.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { EmailVerification } from "./entities/email-verification.entity";
import { DeleteResult, Repository } from "typeorm";
import {config} from "../../config"
import { Nodemailer, NodemailerDrivers } from "@crowdlinker/nestjs-mailer";
import { EmailLoginDto } from "./dto/emailLogin.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/commons/interfaces/jwt-interface";
import { ForgottenPassword } from "./entities/forgotten-password.entity";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ProfileService } from "../profile/profile.service";
import { FavService } from "../fav/fav.service";
import { PlaylistService } from "../playlist/playlist.service";
import { ChatService } from "src/shared/modules/chat/chat.service";
import { NotificationService } from "../notification/notification.service";
@Injectable()
export class AuthService {
  constructor(private userRepository:UserRepository,
              @InjectRepository(EmailVerification) private emailVerificationRepo: Repository<EmailVerification>,
              private jwtService:JwtService,
              @InjectRepository(ForgottenPassword) private forgottenPasswordRepo: Repository<ForgottenPassword>,
              private nodeMailerService: Nodemailer<NodemailerDrivers.SMTP>,
              private profileService:ProfileService,
              private favService:FavService,
              private playlistService:PlaylistService,
              @Inject(forwardRef(()=>ChatService)) private chatService:ChatService,
              private notificationService:NotificationService
    ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto,
      createProfileDto: CreateProfileDto): Promise<void> {
const { username, password, email } = authCredentialsDto;
if (!this.IsValidEmail(email)) {
throw new BadRequestException('You have entered invalid email');
}
const user = new User();
user.salt = await bcrypt.genSalt();

if ((await this.isValidUsername(username))) {
throw new ConflictException(`Username ${username} is not available, please try another one`);
} else {
user.username = username;
}

if ((await this.checkIfEmailExist(email))) {
throw new ConflictException(`Email ${email} is not available, please try another one`);
} else {
user.email = email;
}

user.roles = [Role.USER];
user.password = await this.userRepository.hashPassword(password, user.salt);
user.profile = await this.createProfile(user, createProfileDto);
user.playlists = [];
// sending emails verification
await this.createEmailToken(email);
await this.sendEmailVerification(email);

await user.save();
}

async signInUser(emailLoginDto:EmailLoginDto):Promise<{accessToken:string,user:User}> {
   if(!(await this.IsValidEmail(emailLoginDto.email))) {
    throw new BadRequestException("email not valid")
   }
   const {email,user} = await this.userRepository.validateUserPassword(emailLoginDto);
   const payload :JwtPayload= {email};
   const accessToken= this.jwtService.sign(payload);
   return {accessToken,user};

}

   
   IsValidEmail(email) {
    if (email) {
        const pattern= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return pattern.test(email);
    }
    else{
        return false
    }
   }

   async isValidUsername(username: string): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder('user').select('username');
    query.where('user.username LIKE :username', { username });
    const count = await query.getCount();
    return count >= 1;
  }

  async checkIfEmailExist(email: string): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder('user');
    const isEmailExist = query.select('email')
      .where('user.email LIKE :email', { email });
    const count = await isEmailExist.getCount();
    return count >= 1;
  }

  async createProfile(user:User,createProfileDto:CreateProfileDto):Promise<Profile> {
    const {firstName,lastName,age,phone,gender,country,city,address}= createProfileDto;
   
   const profile =new Profile();
   profile.firstName = firstName;
   profile.lastName = lastName;
   profile.phone = phone;
   profile.gender = gender;
   profile.age = age;
   profile.country = country;
   profile.city = city;
   profile.address = address;
   profile.user = user;  
   profile.fav = await this.favouriteList(profile) //generate foreignkey
   
   return await profile.save();
   
 }

 async favouriteList(profile:Profile):Promise<Fav> {
     const favorite = new Fav();
     favorite.profile=profile;
     favorite.tracks= [];
     return await favorite.save();
 }

 async createEmailToken(email: string) {
  const verifiedEmail = await this.emailVerificationRepo.findOne({where:{ email }});
  if (verifiedEmail && ((new Date().getTime() - verifiedEmail.timeStamp.getTime()) / 60000) < 15) {
    throw new HttpException('LOGIN_EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
  } else {
    const newEmailVerification = new EmailVerification();
    newEmailVerification.email = email;
    newEmailVerification.emailToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
    newEmailVerification.timeStamp = new Date();
    await newEmailVerification.save();
    return true;
  }
}

async sendEmailVerification(email: string): Promise<any> {
  const verifiedEmail = await this.emailVerificationRepo.findOne({where:{ email }});
  if (verifiedEmail && verifiedEmail.emailToken) {
    const url = `<a style='text-decoration:none;'
  href= http://${config.frontEndKeys.url}:${config.frontEndKeys.port}/${config.frontEndKeys.endpoints[1]}/${verifiedEmail.emailToken}>Click Here to confirm your email</a>`;
    await this.nodeMailerService.sendMail({
      from: `Company <dive.innconu@gmail.com>`,
      to: email,
      subject: 'Verify Email',
      text: 'Verify Email',
      html: `<h1>Hi User</h1> <br><br> <h2>Thanks for your registration</h2>
<h3>Please Verify Your Email by clicking the following link</h3><br><br>
      ${url}`,
    }).then(info => {
      console.log('Message sent: %s', info.messageId);
    }).catch(err => {
      console.log('Message sent: %s', err);
    });
  } else {
    throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
  }
}

async verifyEmail(token: string): Promise<{ isFullyVerified: boolean, user: User }> {
  const verifiedEmail = await this.emailVerificationRepo.findOne({where:{ emailToken: token }});
  if (verifiedEmail && verifiedEmail.email) {
    const user = await this.userRepository.findOne( {where:{email: verifiedEmail.email}} );
    if (user) {
      user.isEmailVerified = true;
      const updatedUser = await user.save();
      await verifiedEmail.remove();
      return { isFullyVerified: true, user: updatedUser };
    }
  } else {
    throw new HttpException('LOGIN_EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
  }
}

async deleteUser(id:number):Promise<DeleteResult>{
  return await this.userRepository.delete(id);
}

async sendEmailForgottenPassword(email: string): Promise<any> {
  const user = await this.userRepository.findOne({where:{ email }});
  if (!user) {
    throw new HttpException('LOGIN_USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
  const tokenModel = await this.createForgottenPasswordToken(email);
  if (tokenModel && tokenModel.newPasswordToken) {
    const url = `<a style='text-decoration:none;'
  href= http://${config.frontEndKeys.url}:${config.frontEndKeys.port}/${config.frontEndKeys.endpoints[0]}/${tokenModel.newPasswordToken}>Click here to reset your password</a>`;
    return await this.nodeMailerService.sendMail({
      from: '"Company" <' + config.nodeMailerOptions.transport.auth.user + '>',
      to: email,
      subject: 'Reset Your Password',
      text: 'Reset Your Password',
      html: `<h1>Hi User</h1> <br><br> <h2>You have requested to reset your password , please click the following link to change your password</h2>
   <h3>Please click the following link</h3><br><br>
      ${url}`,
    }).then(info => {
      console.log('Message sent: %s', info.messageId);
    }).catch(err => {
      console.log('Message sent: %s', err);
    });
  }
}



async createForgottenPasswordToken(email: string) {
  let forgottenPassword = await this.forgottenPasswordRepo.findOne({where:{ email }});
  if (forgottenPassword && ((new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000) < 15) {
    throw new HttpException('RESET_PASSWORD_EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
  } else {
    forgottenPassword = new ForgottenPassword();
    forgottenPassword.email = email;
    forgottenPassword.timestamp = new Date();
    forgottenPassword.newPasswordToken = (Math.floor(Math.random() * (900000)) + 100000).toString();
    return await forgottenPassword.save();
  }
}

async checkPassword(email: string, password: string) {
  const user = await this.userRepository.findOne({where:{ email }});
  if (!user) {
    throw new HttpException('User Does not Found', HttpStatus.NOT_FOUND);
  }
  return await bcrypt.compare(password, user.password);
}

async setNewPassword(resetPasswordDto: ResetPasswordDto) {
  let isNewPasswordChanged = false;
  const { email, newPasswordToken, currentPassword, newPassword } = resetPasswordDto;
  if (email && currentPassword) {
    const isValidPassword = await this.checkPassword(email, currentPassword);
    if (isValidPassword) {
      isNewPasswordChanged = await this.setPassword(email, newPassword);
    } else {
      throw new HttpException('RESET_PASSWORD_WRONG_CURRENT_PASSWORD', HttpStatus.CONFLICT);
    }
  } else if (newPasswordToken) {
    const forgottenPassword = await this.forgottenPasswordRepo.findOne({where:{ newPasswordToken }});
    isNewPasswordChanged = await this.setPassword(forgottenPassword.email, newPassword);
    if (isNewPasswordChanged) {
      await this.forgottenPasswordRepo.delete(forgottenPassword.id);
    }
  } else {
    return new HttpException('RESET_PASSWORD_CHANGE_PASSWORD_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return isNewPasswordChanged;
}

async setPassword(email: string, newPassword: string) {
  const user = await this.userRepository.findOne({where:{ email }});
  if (!user) {
    throw new HttpException('LOGIN_USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
  user.password = await this.userRepository.hashPassword(newPassword, user.salt);
  await user.save();
  return true;
}

async getUserMainData(user:User):Promise<{user:User,profile:Profile,fav:Fav}>{
  const profile = await this.profileService.getProfileData(user);
  const fav = await this.favService.getUserFavoriteList(profile.favoriteId);
  return {
    user,
    profile,
    fav
  }
}

async signInAdmin(emailLoginDto:EmailLoginDto):Promise<{accessToken:string,user:User}> {
  if(!(await this.IsValidEmail(emailLoginDto.email))) {
   throw new BadRequestException("email not valid")
  }
  const {email,user} = await this.userRepository.validateAdminPassword(emailLoginDto);
  const payload :JwtPayload= {email};
  const accessToken= this.jwtService.sign(payload);
  return {accessToken,user};

}

async getSystemUsers():Promise<User[]> {
  return await this.userRepository.find();
}

async getUserById(id: number) {
  const result= await this.userRepository.findOne({where:{id}});
  if (!result) {
    throw new NotFoundException('User Does not exist')
  }
  return result;
}

async editUserRoles(id:number,roles:Role[]):Promise<User> {
   const user =await this.getUserById(id);
   if (!user) {
    throw new NotFoundException('User Does not exist')
   }
   if (roles) {
    user.roles=roles;
   }
   return await user.save();
}

 async deleteUserAccount(user:User) {
  const profile = await this.profileService.getProfileData(user);
    const favoriteId = profile.favoriteId;
  // procedure-1: delete-user-playlists/ messages/ and related rooms
  for (let i = 0; i < user.playlists.length; i++) {
    await this.playlistService.deletePlaylist(user.playlists[i].id)
  }

  await this.chatService.deleteUserMessages(user);
  await this.chatService.deleteUserJoinedRooms(user)
  
  // procedure-2: delete-user
  await this.userRepository.delete(user.id)
  // procedure-3: delete-user-profile
  await this.profileService.deleteProfile(profile.id)
  
  // procedure-4: delete user subscriber
  await this.notificationService.deleteSubscriber(user.subscriberId);
  // procedure-5: delete-user-favorite-list
  await this.favService.deleteFavoriteList(favoriteId);

  return true;
 }

 async IsValidUsername(username:string):Promise<boolean> {
   const query=  this.userRepository.createQueryBuilder('user').select('username');
   query.where('user.username LIKE :username', {username})
   const count = await query.getCount();
   return count >= 1;
 }

 async findUser(id:number,nickname?:string,clientId?:string):Promise<User> {
  let user=null;
  if (id) {
    user=await this.getUserById(id)
  }else if (nickname) {
    user= await this.userRepository.findOne({where:{
      username:nickname
    }})
  }
  else if (clientId) {
    user= await this.userRepository.findOne({where:{
      clientId
    }})
    

 }else{
  throw new NotFoundException(`User with Id ${id} Does not found`);
 }
 return user;
  
}
}