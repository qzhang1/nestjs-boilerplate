import { Column, PrimaryGeneratedColumn } from 'typeorm';
import Role from './role.enum';

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
    length: 50,
  })
  public password: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
  })
  public roles: Role[];
}

export default User;
