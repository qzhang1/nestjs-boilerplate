import { IsEmail, IsEnum, IsString } from 'class-validator';
import OAuthProvider from 'src/users/oauthProvider.enum';

export class CreateOAuthUserDto {
  @IsEmail()
  email: string;
  @IsString()
  username: string;
  @IsEnum(OAuthProvider)
  oauthProvider: OAuthProvider;
  @IsString()
  oauthProfileId: string;
}

export default CreateOAuthUserDto;
