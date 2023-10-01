import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller({
  version: '1',
  path: 'health',
})
export class HealthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly healthService: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly diskHealthIndicator: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthService.check([
      () => this.typeOrmHealthIndicator.pingCheck('database'),
      () =>
        this.memoryHealthIndicator.checkHeap(
          'memory heap',
          this.configService.get<number>('APP_MAX_HEAP_LIMIT'),
        ),
      () =>
        this.memoryHealthIndicator.checkRSS(
          'memory RSS',
          this.configService.get<number>('APP_MAX_RSS_LIMIT'),
        ),
      // () =>
      //   this.diskHealthIndicator.checkStorage('disk health', {
      //     thresholdPercent: this.configService.get<number>(
      //       'APP_DISK_STORAGE_PCT',
      //     ),
      //     path: process.platform === 'win32' ? 'C:\\' : '/',
      //   }),
    ]);
  }
}

export default HealthController;
