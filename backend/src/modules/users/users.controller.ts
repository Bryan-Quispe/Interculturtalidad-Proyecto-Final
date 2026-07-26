import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getUserProfile(user.id);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() data: { name?: string; avatar?: string },
  ) {
    return this.usersService.updateProfile(user.id, data);
  }
}
