import { Module } from '@nestjs/common';
import { AnimalesService } from './animales.service';
import { AnimalesController } from './animales.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AnimalesService],
  controllers: [AnimalesController],
})
export class AnimalesModule {}
