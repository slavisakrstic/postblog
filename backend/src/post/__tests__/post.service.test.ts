import { TestingModule, Test } from "@nestjs/testing";
import { PostService } from "../post.service";
import {
  testCreatedDbResponsePost,
  testCreatedRequestPost,
  testDateNow,
  testUpdatedRequestPost,
} from "../__mocks__/post-data";

const repositoryMock = {
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  softDelete: jest.fn(),
  increment: jest.fn(),
  decrement: jest.fn(),
};

const nowSpy = jest.spyOn(Date, "now");

describe("Post Service", (): void => {
  let postService: PostService;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        PostService,
        {
          provide: "PostRepository",
          useValue: repositoryMock,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  describe("define", (): void => {
    it("should be defined", (): void => {
      expect(postService).toBeDefined();
    });
  });

  describe("create", (): void => {
    it("should create new post", async () => {
      repositoryMock.save.mockResolvedValueOnce(testCreatedDbResponsePost);

      const result = await postService.create(testCreatedRequestPost);
      expect(result).toMatchObject(testCreatedDbResponsePost);
      expect(repositoryMock.save).toHaveBeenCalledWith(testCreatedRequestPost);
    });
  });

  describe("update", (): void => {
    it("should update post", async () => {
      nowSpy.mockImplementationOnce(() => testDateNow);
      repositoryMock.update.mockResolvedValueOnce(testCreatedDbResponsePost);

      const result = await postService.update(1, testUpdatedRequestPost);
      expect(result).toMatchObject(testCreatedDbResponsePost);
      expect(repositoryMock.update).toHaveBeenCalledWith(
        { id: 1, deletedAt: null },
        { ...testUpdatedRequestPost, updatedAt: new Date(testDateNow) }
      );
    });
  });

  describe("delete", (): void => {
    it("should delete post", async () => {
      nowSpy.mockImplementationOnce(() => testDateNow);
      repositoryMock.softDelete.mockResolvedValueOnce({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const result = await postService.delete(1);
      expect(result).toMatchObject({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });
      expect(repositoryMock.softDelete).toHaveBeenCalledWith({ id: 1, deletedAt: null });
    });
  });

  describe("getById", (): void => {
    it("should return post by postId", async () => {
      repositoryMock.findOne.mockResolvedValueOnce(testCreatedDbResponsePost);

      const result = await postService.getById(1);
      expect(result).toMatchObject(testCreatedDbResponsePost);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          deletedAt: null,
        },
      });
    });
  });

  describe("getAll", (): void => {
    it("should return posts", async () => {
      repositoryMock.find.mockResolvedValueOnce(testCreatedDbResponsePost);

      const result = await postService.getAll();
      expect(result).toMatchObject(testCreatedDbResponsePost);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
        order: {
          updatedAt: "DESC",
        },
      });
    });
  });

  describe("getWithCommentsById", (): void => {
    it("should return post with comments by postId", async () => {
      repositoryMock.findOne.mockResolvedValueOnce(testCreatedDbResponsePost);

      const result = await postService.getWithCommentsById(1);
      expect(result).toMatchObject(testCreatedDbResponsePost);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          deletedAt: null,
        },
        relations: ["comments"],
      });
    });
  });

  describe("getAllWithComments", (): void => {
    it("should return posts with comments", async () => {
      repositoryMock.find.mockResolvedValueOnce([testCreatedDbResponsePost]);

      const result = await postService.getAllWithComments();
      expect(result).toMatchObject([testCreatedDbResponsePost]);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
        relations: ["comments"],
      });
    });
  });

  describe("incrementNumberOfComments", (): void => {
    it("should increment number of comments", async () => {
      repositoryMock.increment.mockResolvedValueOnce({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const result = await postService.incrementNumberOfComments(1);
      expect(result).toMatchObject({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });
      expect(repositoryMock.increment).toHaveBeenCalledWith({ id: 1 }, "numberOfComments", 1);
    });
  });

  describe("decrementNumberOfComments", (): void => {
    it("should decrement number of comments", async () => {
      repositoryMock.decrement.mockResolvedValueOnce({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const result = await postService.decrementNumberOfComments(1);
      expect(result).toMatchObject({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });
      expect(repositoryMock.decrement).toHaveBeenCalledWith({ id: 1 }, "numberOfComments", 1);
    });
  });
});
