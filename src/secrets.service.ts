import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretsService {
  secrets: string[];
  private readonly logger = new Logger(SecretsService.name);
  constructor(private readonly configService: ConfigService) {
    this.secrets = configService.get('SESSION_SECRETS').split(',');
    this.logger.log(`loaded ${this.secrets.length} secrets to be used`);
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  rotateHead() {
    const swapIdx = Math.floor(Math.random() * this.secrets.length);
    const temp = this.secrets[swapIdx];
    this.secrets[swapIdx] = this.secrets[0];
    this.secrets[0] = temp;
  }
}
