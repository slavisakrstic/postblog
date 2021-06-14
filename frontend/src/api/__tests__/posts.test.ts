import axios from "axios";
import { API_POSTBLOGS_POSTS_URL } from "../../constants/endpoints";
import { getPostWithCommentsById, getAllPosts, createPost, updatePost, deletePost } from "../posts";

jest.mock("axios");

describe("Posts API", () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockDelete = jest.fn();

  axios.get = mockGet;
  axios.post = mockPost;
  axios.put = mockPut;
  axios.delete = mockDelete;

  const postId = 1;
  const testDateNow = 1623372689965;

  test("getPostWithCommentsById should call axios get", async () => {
    const data = {
      id: 1,
      numberOfComments: 1,
      title: "Title 1",
      blog: "Blog 1",
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
      comments: [
        {
          id: 1,
          postId: 1,
          name: "comment",
          text: "text",
          createdAt: new Date(testDateNow),
          updatedAt: new Date(testDateNow),
        },
      ],
    };
    mockGet.mockResolvedValueOnce({ data });

    const response = await getPostWithCommentsById(postId);

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      `${API_POSTBLOGS_POSTS_URL}/${postId}/comments`
    );
    expect(response).toEqual(data);
  });

  test("getAllPosts should call axios get", async () => {
    const data = {
      id: 1,
      numberOfComments: 1,
      title: "Title 1",
      blog: "Blog 1",
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
    };
    mockGet.mockResolvedValueOnce({ data });

    const response = await getAllPosts();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(API_POSTBLOGS_POSTS_URL);
    expect(response).toEqual(data);
  });

  test("createPost should call axios post", async () => {
    const data = {
      id: 1,
      numberOfComments: 1,
      title: "Title 1",
      blog: "Blog 1",
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
    };
    const request = {
      title: "Title 1",
      blog: "Blog 1",
    }
    mockPost.mockResolvedValueOnce({ data });

    const response = await createPost(request);

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith(API_POSTBLOGS_POSTS_URL, request);
    expect(response).toEqual(data);
  });

  test("updatePost should call axios put", async () => {
    const data = {
      id: 1,
      numberOfComments: 1,
      title: "Title 1",
      blog: "Blog 1",
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
    };
    const request = {
      title: "Title 1",
      blog: "Blog 1",
    }
    mockPut.mockResolvedValueOnce({ data });

    const response = await updatePost(postId, request);

    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(mockPut).toHaveBeenCalledWith(
      `${API_POSTBLOGS_POSTS_URL}/${postId}`,
      request,
    );
    expect(response).toEqual(data);
  });

  test("deletePost should call axios delete", async () => {
    mockDelete.mockResolvedValueOnce({});

    await deletePost(postId);

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(
      `${API_POSTBLOGS_POSTS_URL}/${postId}`
    );
  });
});