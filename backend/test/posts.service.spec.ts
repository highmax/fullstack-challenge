import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { PostsService } from '../src/posts/posts.service';
import { Post } from '../src/posts/schemas/post.schema';

describe('PostsService', () => {
  let postsService: PostsService;

  const mockPost = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Post',
    body: 'This is a test post body with enough characters',
    authorUserId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPostModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel,
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a post by id', async () => {
      mockPostModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPost),
      });

      const result = await postsService.findById(mockPost._id);
      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException when post does not exist', async () => {
      mockPostModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(postsService.findById('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      mockPostModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPost),
      });

      await expect(postsService.delete(mockPost._id)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when deleting nonexistent post', async () => {
      mockPostModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(postsService.delete('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });
});
