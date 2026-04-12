import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ReqresService } from '../reqres/reqres.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly reqresService: ReqresService,
  ) {}

  async importFromReqres(reqresId: number): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ reqresId }).exec();
    if (existing) {
      throw new ConflictException(`User with ReqRes ID ${reqresId} is already saved locally`);
    }

    const reqresUser = await this.reqresService.getUserById(reqresId);

    const user = new this.userModel({
      reqresId: reqresUser.id,
      email: reqresUser.email,
      firstName: reqresUser.first_name,
      lastName: reqresUser.last_name,
      avatar: reqresUser.avatar,
    });

    const saved = await user.save();
    this.logger.log(`Imported user ${reqresId} from ReqRes`);
    return saved;
  }

  async findAllSaved(): Promise<UserDocument[]> {
    return this.userModel.find().sort({ createdAt: -1 }).exec();
  }

  async findSavedById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Saved user with ID ${id} not found`);
    }
    return user;
  }

  async findByReqresId(reqresId: number): Promise<UserDocument | null> {
    return this.userModel.findOne({ reqresId }).exec();
  }

  async deleteSaved(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Saved user with ID ${id} not found`);
    }
    this.logger.log(`Deleted saved user ${id}`);
  }
}
