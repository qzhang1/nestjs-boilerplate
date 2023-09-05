import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class LogInWithCredentialsGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // authenticate with passport strategy by grabbing email and pwd from context
    await super.canActivate(context);
    // after this point user entity inserted into request object
    const request = context.switchToHttp().getRequest();
    // pass this request object with the inserted user entity to log in
    await super.logIn(request);
    return true;
  }
}
