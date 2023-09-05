import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Role from './role.enum';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    unique: true,
    length: 100,
  })
  public email: string;

  @Column({
    unique: true,
    length: 50,
  })
  public username: string;

  @Column({
    length: 100,
  })
  @Exclude()
  public password: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
  })
  public roles: Role[];

  @CreateDateColumn({
    type: 'timestamptz',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  public updatedAt: Date;
}

export default User;
