/* eslint-disable prettier/prettier */
import { BaseEntity, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Track } from '../track/track.entity';
import { Profile } from '../profile/entities/profile.entity';

@Entity('favs')
export class Fav extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Profile, profile => profile.fav)
  profile: Profile;


  @OneToMany(() => Track, track => track.fav, {
    eager: true
  })
  tracks: Track[];
}