/* eslint-disable prettier/prettier */
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../../commons/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { Profile } from '../../profile/entities/profile.entity';
import { Playlist } from '../../playlist/playlist.entity';
import { Message } from 'src/shared/modules/chat/entities/message.entity';
import { UserJoinedRoom } from 'src/shared/modules/chat/entities/user-joined-room.entity';
import { Subscriber } from 'src/modules/notification/entities/subscriber.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  salt: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
  })
  roles: Role[];


  // new column
  @Column({
    default: false,
  })
  isEmailVerified: boolean;


  //  new column
  // this column is related to the functionality of signIn with facebook
 



  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  @OneToOne(() => Profile, profile => profile.user)
  @JoinColumn()
  profile: Profile;

  @OneToOne(() => Subscriber, subscriber => subscriber.user)
  @JoinColumn()
  subscriber: Subscriber;

  @OneToMany(() => Playlist, playlist => playlist.user, {
    eager: true,
  })
  playlists: Playlist[];

  @OneToMany(()=>UserJoinedRoom,userJoinedRoom=>userJoinedRoom.user,{
    eager:true
  })
  userJoinedRooms:UserJoinedRoom[];

  @OneToMany(()=>Message,message=>message.user,{
    eager:true
  })
  messages:Message[];


  
  

  // Foreign Key
  @Column()
  profileId: number;

  @Column({nullable:true})
  clientId:string;

  @Column({
    nullable:true
  })
  subscriberId:number;

  

  
}