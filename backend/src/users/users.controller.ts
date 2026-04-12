import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ReqresService } from '../reqres/reqres.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ImportUserParamDto } from './dto/import-user-param.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reqresService: ReqresService,
  ) {}

  @Get('reqres')
  async getReqresUsers(@Query('page') page: string = '1') {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const result = await this.reqresService.getUsers(pageNum);

    const savedUsers = await this.usersService.findAllSaved();
    const savedReqresIds = new Set(savedUsers.map((u) => u.reqresId));

    const enrichedUsers = result.data.map((user) => ({
      ...user,
      isSavedLocally: savedReqresIds.has(user.id),
    }));

    return {
      ...result,
      data: enrichedUsers,
    };
  }

  @Get('reqres/:id')
  async getReqresUser(@Param('id') id: string) {
    const reqresId = parseInt(id, 10);
    const user = await this.reqresService.getUserById(reqresId);
    const savedUser = await this.usersService.findByReqresId(reqresId);

    return {
      ...user,
      isSavedLocally: !!savedUser,
      localId: savedUser?._id?.toString() || null,
    };
  }

  @Post('import/:id')
  @HttpCode(HttpStatus.CREATED)
  async importUser(@Param() params: ImportUserParamDto) {
    return this.usersService.importFromReqres(params.id);
  }

  @Get('saved')
  async getSavedUsers() {
    return this.usersService.findAllSaved();
  }

  @Get('saved/:id')
  async getSavedUser(@Param('id') id: string) {
    return this.usersService.findSavedById(id);
  }

  @Delete('saved/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSavedUser(@Param('id') id: string) {
    await this.usersService.deleteSaved(id);
  }
}