import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface AppConfig {
  port: string;
}

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);
    if (value == null) {
      throw new Error(`key: ${key} environemt variable does not set`);
    }

    return value;
  }

  private getString(key: string): string {
    const value = this.get(key);
    return value.replaceAll(String.raw`\n`, '\n');
  }

  private getNumber(key: string): number {
    const value = this.get(key);
    try {
      return Number(value);
    } catch {
      throw new Error(`key: ${key} environemt variable is not a number`);
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    if (value === 'true') return true;
    if (value === 'false') return false;

    throw new Error(`${key} environment variable is not a boolean`);
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get appConfig(): AppConfig {
    return {
      port: this.getString('APP_PORT'),
    };
  }

  get authConfig() {
    return {
      access_token_key: this.getString('ACCESS_TOKEN_SECRET'),
      refresh_token_key: this.getString('REFRESH_TOKEN_SECRET'),
      access_expiration_time: this.getString('ACCESS_TOKEN_expiresIn'),
      refresh_expiration_time: this.getString('REFRESH_TOKEN_expiresIn'),
    };
  }

  get postgreSQLConfig() {
    const host = this.getString('DB_HOST');
    const port = this.getNumber('DB_PORT');
    const username = this.getString('DB_USERNAME');
    const password = this.getString('DB_PASSWORD');
    const database = this.getString('DB_DATABASE');
    // const logging = this.getBoolean('ENABLE_ORM_LOGS');
    // const synchronize = this.getBoolean('ENABLE_SYCHORIZE_DB');
    return {
      dataSourceUrl: `postgresql://${username}:${password}@${host}:${port}/${database}`,
    };
  }

  get prismaConfig() {
    return {
      dataSourceUrl: this.getString('DATABASE_URL'),
    };
  }

  get S3ServiceConfig() {
    return {
      region: this.getString('AWS_REGION'),
      access_key: this.getString('AWS_ACCESS_KEY_ID'),
      secret_key: this.getString('AWS_SECRET_ACCESS_KEY'),
      bucket_name: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }
}
