import axios from "axios";
import { API_POSTBLOGS_COMMENTS_URL } from "../../constants/endpoints";
import { getComment, createComment, updateComment, deleteComment } from "../comments";

jest.mock("axios");

describe("Comments API", () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockDelete = jest.fn();

  axios.get = mockGet;
  axios.post = mockPost;
  axios.put = mockPut;
  axios.delete = mockDelete;

  const commentId = 1;
  const testDateNow = 1623372689965;

  test("getComment should call axios get", async () => {
    const data = {
      id: 1,
      postId: 1,
      name: "comment",
      text: "text",
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
    };
    mockGet.mockResolvedValueOnce({ data });

    const response = await getComment(commentId);

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      `${API_POSTBLOGS_COMMENTS_URL}/${commentId}`
    );
    expect(response).toEqual(data);
  });

  test("createComment should call axios post", async () => {
    const data = {
      id: 1,
      postId: 1,
      name: "comment",
      text: "text",
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
    };
    const request = {
      postId: 1,
      name: "comment",
      text: "text",
    }
    mockPost.mockResolvedValueOnce({ data });

    const response = await createComment(request);

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith(API_POSTBLOGS_COMMENTS_URL, request);
    expect(response).toEqual(data);
  });

  test("updateComment should call axios put", async () => {
    const data = {
      id: 1,
      postId: 1,
      name: "comment",
      text: "text",
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
    };
    const request = {
      name: "comment",
      text: "text",
    }
    mockPut.mockResolvedValueOnce({ data });

    const response = await updateComment(1, request);

    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(mockPut).toHaveBeenCalledWith(
      `${API_POSTBLOGS_COMMENTS_URL}/${commentId}`,
      request
    );
    expect(response).toEqual(data);
  });

  test("deleteComment should call axios delete", async () => {
    mockDelete.mockResolvedValueOnce({});

    await deleteComment(1);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(
      `${API_POSTBLOGS_COMMENTS_URL}/${commentId}`
    );
  });
});
