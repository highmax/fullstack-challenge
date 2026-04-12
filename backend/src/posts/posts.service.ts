import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(@InjectModel(Post.name) private readonly postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<PostDocument> {
    const post = new this.postModel(createPostDto);
    const saved = await post.save();
    this.logger.log(`Created post: ${saved._id}`);
    return saved;
  }

  async findAll(options: PaginationOptions): Promise<PaginatedResult<PostDocument>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.postModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.postModel.countDocuments().exec(),
    ]);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<PostDocument> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostDocument> {
    const post = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true, runValidators: true })
      .exec();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    this.logger.log(`Updated post: ${id}`);
    return post;
  }

  async delete(id: string): Promise<void> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.logger.log(`Deleted post: ${id}`);
  }
}
