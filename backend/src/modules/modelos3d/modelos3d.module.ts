import { Module } from '@nestjs/common';
import { Modelos3DService } from './modelos3d.service';
import { Modelos3DController } from './modelos3d.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [Modelos3DService],
  controllers: [Modelos3DController],
  exports: [Modelos3DService],
})
export class Modelos3DModule {}
