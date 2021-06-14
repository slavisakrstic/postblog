import { NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CommentService } from "../../comment/comment.service";
import { PostController } from "../post.controller";
import { PostService } from "../post.service";
import {
  testCreatedDbResponsePost,
  testCreatedRequestPost,
  testCreatedResponsePost,
  testUpdatedRequestPost,
  testCreatedDbResponsePostWithComments,
  testCreatedResponsePostWithComments,
} from "../__mocks__/post-data";

jest.mock("../post.service");
jest.mock("../../comment/comment.service");

describe("Post Controller", (): void => {
  let sut: PostController;

  const postServiceMock = PostService as jest.Mock<PostService>;
  let postServiceInstance: PostService;

  const commentServiceMock = CommentService as jest.Mock<CommentService>;
  let commentServiceInstance: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService, CommentService],
    }).compile();

    module.useLogger(false);

    sut = module.get<PostController>(PostController);
    postServiceInstance = postServiceMock.mock.instances[0];
    commentServiceInstance = commentServiceMock.mock.instances[0];
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  describe("define", (): void => {
    it("should be defined", (): void => {
      expect(sut).toBeDefined();
      expect(postServiceInstance).toBeDefined();
      expect(commentServiceInstance).toBeDefined();
    });
  });

  describe("create", (): void => {
    it("should return newly created post", async () => {
      const spyCreate = jest
        .spyOn(postServiceInstance, "create")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponsePost);

      const result = await sut.create(testCreatedRequestPost);
      expect(spyCreate).toHaveBeenCalledWith(testCreatedRequestPost);
      expect(result).toMatchObject(testCreatedResponsePost);
    });
  });

  describe("update", (): void => {
    it("should return newly updated post", async () => {
      const spyGetById = jest
        .spyOn(postServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponsePost);

      const spyUpdate = jest.spyOn(postServiceInstance, "update").mockImplementation().mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const result = await sut.update(1, testUpdatedRequestPost);
      expect(spyUpdate).toHaveBeenCalledWith(1, testUpdatedRequestPost);
      expect(spyGetById).toHaveBeenCalledWith(1);
      expect(result).toMatchObject(testCreatedResponsePost);
    });

    it("should throw exception on update - post doesn't exist", async () => {
      const spyGetById = jest
        .spyOn(postServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponsePost);

      const spyUpdate = jest.spyOn(postServiceInstance, "update").mockImplementation().mockResolvedValue({
        affected: 0,
        generatedMaps: [],
        raw: null,
      });

      let error: NotFoundException;
      try {
        await sut.update(1, testUpdatedRequestPost);
      } catch (e) {
        error = e;
      }

      expect(spyUpdate).toHaveBeenCalledWith(1, testUpdatedRequestPost);
      expect(spyGetById).toHaveBeenCalledTimes(0);
      expect(error.message).toEqual(`Post with postId 1 not found`);
      expect(error.getStatus()).toEqual(404);
    });
  });

  describe("get", (): void => {
    it("should return post", async () => {
      const spyGetById = jest
        .spyOn(postServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponsePost);

      const result = await sut.get(1);
      expect(spyGetById).toHaveBeenCalledWith(1);
      expect(result).toMatchObject(testCreatedResponsePost);
    });

    it("should throw exception - post does't exist", async () => {
      const spyGetById = jest.spyOn(postServiceInstance, "getById").mockImplementation().mockResolvedValue(null);

      let error: NotFoundException;
      try {
        await sut.get(1);
      } catch (e) {
        error = e;
      }

      expect(spyGetById).toHaveBeenCalledWith(1);
      expect(error.message).toEqual(`Post with postId 1 not found`);
      expect(error.getStatus()).toEqual(404);
    });
  });

  describe("getAll", (): void => {
    it("should return posts", async () => {
      const spyGetAll = jest
        .spyOn(postServiceInstance, "getAll")
        .mockImplementation()
        .mockResolvedValue([testCreatedDbResponsePost]);

      const result = await sut.getAll();
      expect(spyGetAll).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject([testCreatedResponsePost]);
    });
  });

  describe("getWithCommentsById", (): void => {
    it("should return post with all comments", async () => {
      const getWithCommentsAll = jest
        .spyOn(postServiceInstance, "getWithCommentsById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponsePostWithComments);

      const result = await sut.getWithCommentsById(1);
      expect(getWithCommentsAll).toHaveBeenCalledWith(1);
      expect(result).toMatchObject(testCreatedResponsePostWithComments);
    });

    it("should throw exception - post does't exist", async () => {
      const getWithCommentsAll = jest
        .spyOn(postServiceInstance, "getWithCommentsById")
        .mockImplementation()
        .mockResolvedValue(null);

      let error: NotFoundException;
      try {
        await sut.getWithCommentsById(1);
      } catch (e) {
        error = e;
      }

      expect(getWithCommentsAll).toHaveBeenCalledWith(1);
      expect(error.message).toEqual(`Post with postId 1 not found`);
      expect(error.getStatus()).toEqual(404);
    });
  });

  describe("delete", (): void => {
    it("should delete post without coments", async () => {
      const spyGetById = jest
        .spyOn(postServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponsePost);

      const spySoftDelete = jest.spyOn(postServiceInstance, "delete").mockImplementation().mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const deleteByPostId = jest
        .spyOn(commentServiceInstance, "deleteByPostId")
        .mockImplementation()
        .mockResolvedValue({
          affected: 1,
          generatedMaps: [],
          raw: null,
        });

      await sut.delete(1);
      expect(spySoftDelete).toHaveBeenCalledWith(1);
      expect(deleteByPostId).toHaveBeenCalledTimes(0);
      expect(spyGetById).toHaveBeenCalledWith(1);
    });

    it("should delete post and coments", async () => {
      const spyGetById = jest
        .spyOn(postServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue({
          ...testCreatedDbResponsePost,
          numberOfComments: 2,
        });

      const spySoftDelete = jest.spyOn(postServiceInstance, "delete").mockImplementation().mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const deleteByPostId = jest
        .spyOn(commentServiceInstance, "deleteByPostId")
        .mockImplementation()
        .mockResolvedValue({
          affected: 1,
          generatedMaps: [],
          raw: null,
        });

      await sut.delete(1);
      expect(spySoftDelete).toHaveBeenCalledWith(1);
      expect(deleteByPostId).toHaveBeenCalledWith(1);
      expect(spyGetById).toHaveBeenCalledWith(1);
    });

    it("should throw exception - post doesn't exist", async () => {
      const spyGetById = jest.spyOn(postServiceInstance, "getById").mockImplementation().mockResolvedValue(null);

      const spySoftDelete = jest.spyOn(postServiceInstance, "delete").mockImplementation().mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      let error: NotFoundException;
      try {
        await sut.delete(1);
      } catch (e) {
        error = e;
      }

      expect(spyGetById).toHaveBeenCalledWith(1);
      expect(spySoftDelete).toHaveBeenCalledTimes(0);
      expect(error.message).toEqual(`Post with postId 1 not found`);
      expect(error.getStatus()).toEqual(404);
    });

    it("should throw exception - post can't be delete - internal server error", async () => {
      const spyGetById = jest
        .spyOn(postServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponsePost);

      const spySoftDelete = jest.spyOn(postServiceInstance, "delete").mockImplementation().mockResolvedValue({
        affected: 0,
        generatedMaps: [],
        raw: null,
      });

      let error: InternalServerErrorException;
      try {
        await sut.delete(1);
      } catch (e) {
        error = e;
      }

      expect(spyGetById).toHaveBeenCalledWith(1);
      expect(spySoftDelete).toHaveBeenCalledWith(1);
      expect(error.message).toEqual(`Post with postId 1 is not deleted`);
      expect(error.getStatus()).toEqual(500);
    });

    it("should throw exception - comments can't be delete - internal server error", async () => {
      const spyGetById = jest
        .spyOn(postServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValueOnce({
          ...testCreatedDbResponsePost,
          numberOfComments: 2,
        });

      const spySoftDelete = jest.spyOn(postServiceInstance, "delete").mockImplementation().mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const deleteByPostId = jest
        .spyOn(commentServiceInstance, "deleteByPostId")
        .mockImplementation()
        .mockResolvedValue({
          affected: 0,
          generatedMaps: [],
          raw: null,
        });

      let error: InternalServerErrorException;
      try {
        await sut.delete(1);
      } catch (e) {
        error = e;
      }

      expect(spyGetById).toHaveBeenCalledWith(1);
      expect(spySoftDelete).toHaveBeenCalledWith(1);
      expect(deleteByPostId).toHaveBeenCalledWith(1);
      expect(error.message).toEqual(`Comments with postId 1 are not deleted`);
      expect(error.getStatus()).toEqual(500);
    });
  });
});
