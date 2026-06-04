import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL ?? '';
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      console.log('Prisma connected successfully');
    } catch (error) {
      console.error('Prisma connection failed:', error);
      throw error;
    }
  }

  async getConnectionStatus(): Promise<{
    connected: boolean;
    error?: string;
  }> {
    try {
      await this.$queryRaw`SELECT 1`;
      return {
        connected: true,
      };
    } catch (error: any) {
      console.log('The error exist in Connect DB Primsma: ', error);
      return {
        connected: false,
      };
    }
  }
}
