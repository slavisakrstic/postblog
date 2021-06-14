import axios from "axios";

import { API_POSTBLOGS_POSTS_URL } from "../constants/endpoints";

import { PostCreateRequest } from "./models/requests/postCreateRequest";
import { PostUpdateRequest } from "./models/requests/postUpdateRequest";

import { PostResponse } from "./models/responses/PostResponse";
import { PostCommentsResponse } from "./models/responses/PostCommentsResponse";

export const POST_CREATE_KEY = "post-create";
export const createPost = async (data: PostCreateRequest): Promise<PostResponse> => {
  const response = await axios.post(`${API_POSTBLOGS_POSTS_URL}`, data);
  return response.data;
}

export const POST_UPDATE_KEY = "post-update";
export const updatePost = async (id: number, data: PostUpdateRequest): Promise<PostResponse> => {
  const response = await axios.put(`${API_POSTBLOGS_POSTS_URL}/${id}`, data);
  return response.data;
}

export const POSTS_KEY = "posts";
export const getAllPosts = async (): Promise<PostResponse[]> => {
  const response = await axios.get(`${API_POSTBLOGS_POSTS_URL}`);
  return response.data;
}

export const POST_WITH_COMMENTS_KEY = "post-with-comments";
export const getPostWithCommentsById = async (id:number): Promise<PostCommentsResponse> => {
  const response = await axios.get(`${API_POSTBLOGS_POSTS_URL}/${id}/comments`);
  return response.data;
}

export const POST_DELETE_KEY = "post-delete";
export const deletePost = async (id: number): Promise<void> => {
  const response = await axios.delete(`${API_POSTBLOGS_POSTS_URL}/${id}`);
  return response.data;
}