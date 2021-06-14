import { TestingModule, Test } from "@nestjs/testing";
import { CommentController } from "../comment.controller";
import { CommentService } from "../comment.service";
import { PostService } from "../../post/post.service";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import {
  testCreatedResponseComment,
  testCreatedRequestComment,
  testCreatedDbResponsePost,
  testCreatedDbResponseComment,
  testUpdatedRequestComment,
} from "../__mocks__/comment-data";

jest.mock("../comment.service");
jest.mock("../../post/post.service");

describe("Comment Controller", (): void => {
  let sut: CommentController;

  const commentServiceMock = CommentService as jest.Mock<CommentService>;
  let commentServiceInstance: CommentService;

  const postServiceMock = PostService as jest.Mock<PostService>;
  let postServiceInstance: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [CommentService, PostService],
    }).compile();

    module.useLogger(false);

    sut = module.get<CommentController>(CommentController);
    commentServiceInstance = commentServiceMock.mock.instances[0];
    postServiceInstance = postServiceMock.mock.instances[0];
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  describe("define", (): void => {
    it("should be defined", (): void => {
      expect(sut).toBeDefined();
      expect(commentServiceInstance).toBeDefined();
      expect(postServiceInstance).toBeDefined();
    });
  });

  describe("create", (): void => {
    it("should return newly created comment", async () => {
      const spyPostGetById = jest
        .spyOn(postServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponsePost);

      const spyCreate = jest
        .spyOn(commentServiceInstance, "create")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponseComment);

      const spyPostIncrement = jest
        .spyOn(postServiceInstance, "incrementNumberOfComments")
        .mockImplementation()
        .mockResolvedValue({
          affected: 1,
          generatedMaps: [],
          raw: null,
        });

      const result = await sut.create(testCreatedRequestComment);
      expect(spyPostGetById).toHaveBeenCalledWith(testCreatedRequestComment.postId);
      expect(spyCreate).toHaveBeenCalledWith(testCreatedRequestComment);
      expect(spyPostIncrement).toHaveBeenCalledWith(testCreatedResponseComment.postId);
      expect(result).toMatchObject(testCreatedResponseComment);
    });

    it("should throw exception on create - post doesn't exist", async () => {
      const spyPostGetById = jest.spyOn(postServiceInstance, "getById").mockImplementation().mockResolvedValue(null);

      const spyCreate = jest
        .spyOn(commentServiceInstance, "create")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponseComment);

      const spyPostIncrement = jest
        .spyOn(postServiceInstance, "incrementNumberOfComments")
        .mockImplementation()
        .mockResolvedValue({
          affected: 1,
          generatedMaps: [],
          raw: null,
        });

      let error: NotFoundException;
      try {
        await sut.create(testCreatedRequestComment);
      } catch (e) {
        error = e;
      }

      expect(spyPostGetById).toHaveBeenCalledWith(testCreatedRequestComment.postId);
      expect(spyCreate).toHaveBeenCalledTimes(0);
      expect(spyPostIncrement).toHaveBeenCalledTimes(0);
      expect(error.message).toEqual(`Post with postId ${testCreatedRequestComment.postId} not found`);
      expect(error.getStatus()).toEqual(404);
    });

    it("should throw exception on create - internal server error", async () => {
      const spyPostGetById = jest
        .spyOn(postServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponsePost);

      const spyCreate = jest.spyOn(commentServiceInstance, "create").mockImplementation().mockResolvedValue(null);

      const spyPostIncrement = jest
        .spyOn(postServiceInstance, "incrementNumberOfComments")
        .mockImplementation()
        .mockResolvedValue({
          affected: 1,
          generatedMaps: [],
          raw: null,
        });

      let error: InternalServerErrorException;
      try {
        await sut.create(testCreatedRequestComment);
      } catch (e) {
        error = e;
      }

      expect(spyPostGetById).toHaveBeenCalledWith(testCreatedRequestComment.postId);
      expect(spyCreate).toHaveBeenCalledTimes(1);
      expect(spyPostIncrement).toHaveBeenCalledTimes(0);
      expect(error.message).toEqual(`Unable to create new Comment with postId ${testCreatedRequestComment.postId}`);
      expect(error.getStatus()).toEqual(500);
    });
  });

  describe("update", (): void => {
    it("should return newly updated comment", async () => {
      const spyGetById = jest
        .spyOn(commentServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponseComment);

      const spyUpdate = jest.spyOn(commentServiceInstance, "update").mockImplementation().mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const result = await sut.update(1, testUpdatedRequestComment);
      expect(spyUpdate).toHaveBeenCalledWith(1, testUpdatedRequestComment);
      expect(spyGetById).toHaveBeenCalledWith(1);
      expect(result).toMatchObject(testCreatedResponseComment);
    });

    it("should throw exception on update - comment doesn't exist", async () => {
      const spyGetById = jest
        .spyOn(commentServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponseComment);

      const spyUpdate = jest.spyOn(commentServiceInstance, "update").mockImplementation().mockResolvedValue({
        affected: 0,
        generatedMaps: [],
        raw: null,
      });

      let error: NotFoundException;
      try {
        await sut.update(1, testUpdatedRequestComment);
      } catch (e) {
        error = e;
      }

      expect(spyUpdate).toHaveBeenCalledWith(1, testUpdatedRequestComment);
      expect(spyGetById).toHaveBeenCalledTimes(0);
      expect(error.message).toEqual(`Comment with commentId 1 not found`);
      expect(error.getStatus()).toEqual(404);
    });
  });

  describe("get", (): void => {
    it("should return comment", async () => {
      const spyGetById = jest
        .spyOn(commentServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponseComment);

      const result = await sut.get(1);
      expect(spyGetById).toHaveBeenCalledWith(1);
      expect(result).toMatchObject(testCreatedResponseComment);
    });

    it("should throw exception - comment does't exist", async () => {
      const spyGetById = jest.spyOn(commentServiceInstance, "getById").mockImplementation().mockResolvedValue(null);

      let error: NotFoundException;
      try {
        await sut.get(1);
      } catch (e) {
        error = e;
      }

      expect(spyGetById).toHaveBeenCalledWith(1);
      expect(error.message).toEqual(`Comment with commentId 1 not found`);
      expect(error.getStatus()).toEqual(404);
    });
  });

  describe("delete", (): void => {
    it("should delete comment", async () => {
      const spyGetById = jest
        .spyOn(commentServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponseComment);

      const spySoftDelete = jest.spyOn(commentServiceInstance, "delete").mockImplementation().mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const spyPostDecrement = jest
        .spyOn(postServiceInstance, "decrementNumberOfComments")
        .mockImplementation()
        .mockResolvedValue({
          affected: 0,
          generatedMaps: [],
          raw: null,
        });

      await sut.delete(1);
      expect(spySoftDelete).toHaveBeenCalledWith(1);
      expect(spyGetById).toHaveBeenCalledWith(1);
      expect(spyPostDecrement).toHaveBeenCalledWith(testCreatedDbResponseComment.postId);
    });

    it("should throw exception - comment doesn't exist", async () => {
      const spyGetById = jest.spyOn(commentServiceInstance, "getById").mockImplementation().mockResolvedValue(null);

      const spySoftDelete = jest.spyOn(commentServiceInstance, "delete").mockImplementation().mockResolvedValue({
        affected: 1,
        generatedMaps: [],
        raw: null,
      });

      const spyPostDecrement = jest
        .spyOn(postServiceInstance, "decrementNumberOfComments")
        .mockImplementation()
        .mockResolvedValue({
          affected: 0,
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
      expect(spyPostDecrement).toHaveBeenCalledTimes(0);
      expect(error.message).toEqual(`Comment with commentId 1 not found`);
      expect(error.getStatus()).toEqual(404);
    });

    it("should throw exception - comment can't be delete - internal server error", async () => {
      const spyGetById = jest
        .spyOn(commentServiceInstance, "getById")
        .mockImplementation()
        .mockResolvedValue(testCreatedDbResponseComment);

      const spySoftDelete = jest.spyOn(commentServiceInstance, "delete").mockImplementation().mockResolvedValue({
        affected: 0,
        generatedMaps: [],
        raw: null,
      });

      const spyPostDecrement = jest
        .spyOn(postServiceInstance, "decrementNumberOfComments")
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
      expect(spyPostDecrement).toHaveBeenCalledTimes(0);
      expect(error.message).toEqual(`Comment with commentId 1 is not deleted`);
      expect(error.getStatus()).toEqual(500);
    });
  });
});
