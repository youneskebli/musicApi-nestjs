/* eslint-disable prettier/prettier */
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Fav } from 'src/modules/fav/fav.entity';
import { Gender } from 'src/commons/enums/gender.enum';
import { User } from 'src/modules/auth/entities/user.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    nullable:true
  })
  gender: Gender;

  @Column({
    nullable:true
  })
  age: number;

  @Column({
    nullable:true
  })
  country: string;

  @Column({
    nullable:true
  })
  city: string;

  @Column({
    nullable:true
  })
  address: string;

  @Column({
    nullable:true
  })
  phone: string;

  @Column({
    nullable: true
  })
  image: string;


  @OneToOne(() => User, user => user.profile, {
    eager: true
  })
  user: User;

  @OneToOne(() => Fav, fav => fav.profile)
  @JoinColumn()
  fav: Fav;

  @Column({nullable:true,default:1})
  favoriteId: number;

}