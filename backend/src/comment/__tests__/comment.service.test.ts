import { TestingModule, Test } from "@nestjs/testing";
import { CommentService } from "../comment.service";
import {
  testDateNow,
  testCreatedDbResponseComment,
  testCreatedRequestComment,
  testUpdatedRequestComment,
} from "../__mocks__/comment-data";

const repositoryMock = {
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  softDelete: jest.fn(),
};

const nowSpy = jest.spyOn(Date, "now");

describe("Comment Service", (): void => {
  let commentService: CommentService;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        CommentService,
        {
          provide: "CommentRepository",
          useValue: repositoryMock,
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  describe("define", (): void => {
    it("should be defined", (): void => {
      expect(commentService).toBeDefined();
    });
  });

  describe("create", (): void => {
    it("should create new comment", async () => {
      repositoryMock.save.mockResolvedValueOnce(testCreatedDbResponseComment);

      const result = await commentService.create(testCreatedRequestComment);
      expect(result).toMatchObject(testCreatedDbResponseComment);
      expect(repositoryMock.save).toHaveBeenCalledWith(testCreatedRequestComment);
    });
  });

  describe("update", (): void => {
    it("should update comment", async () => {
      nowSpy.mockImplementationOnce(() => testDateNow);
      repositoryMock.update.mockResolvedValueOnce(testCreatedDbResponseComment);

      const result = await commentService.update(1, testUpdatedRequestComment);
      expect(result).toMatchObject(testCreatedDbResponseComment);
      expect(repositoryMock.update).toHaveBeenCalledWith(
        { id: 1, deletedAt: null },
        { ...testUpdatedRequestComment, updatedAt: new Date(testDateNow) }
      );
    });
  });

  describe("delete", (): void => {
    it("should delete comment", async () => {
      repositoryMock.softDelete.mockResolvedValueOnce({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const result = await commentService.delete(1);
      expect(result).toMatchObject({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });
      expect(repositoryMock.softDelete).toHaveBeenCalledWith({ id: 1, deletedAt: null });
    });
  });

  describe("deleteByPostId", (): void => {
    it("should delete comment by postId", async () => {
      repositoryMock.softDelete.mockResolvedValueOnce({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const result = await commentService.deleteByPostId(1);
      expect(result).toMatchObject({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });
      expect(repositoryMock.softDelete).toHaveBeenCalledWith({ postId: 1, deletedAt: null });
    });
  });

  describe("getById", (): void => {
    it("should return comment by commentId", async () => {
      repositoryMock.findOne.mockResolvedValueOnce(testCreatedDbResponseComment);

      const result = await commentService.getById(1);
      expect(result).toMatchObject(testCreatedDbResponseComment);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          deletedAt: null,
        },
      });
    });
  });

  describe("getAll", (): void => {
    it("should return comments by postId", async () => {
      repositoryMock.find.mockResolvedValueOnce([testCreatedDbResponseComment]);

      const result = await commentService.getAll(1);
      expect(result).toMatchObject([testCreatedDbResponseComment]);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: {
          postId: 1,
          deletedAt: null,
        },
      });
    });
  });
});
