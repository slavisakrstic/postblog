import axios from "axios";

import { API_POSTBLOGS_COMMENTS_URL } from "../constants/endpoints";

import { CommentCreateRequest } from "./models/requests/commentCreateRequest";
import { CommentUpdateRequest } from "./models/requests/commentUpdateRequest";

import { CommentResponse } from "./models/responses/CommentResponse";

export const createComment = async (data: CommentCreateRequest): Promise<CommentResponse> => {
  const response = await axios.post(`${API_POSTBLOGS_COMMENTS_URL}`, data);
  return response.data;
}

export const updateComment = async (id: number, data: CommentUpdateRequest): Promise<CommentResponse> => {
  const response = await axios.put(`${API_POSTBLOGS_COMMENTS_URL}/${id}`, data);
  return response.data;
}

export const getComment = async (id: number): Promise<CommentResponse> => {
  const response = await axios.get(`${API_POSTBLOGS_COMMENTS_URL}/${id}`);
  return response.data;
}

export const deleteComment = async (id: number): Promise<void> => {
  const response = await axios.delete(`${API_POSTBLOGS_COMMENTS_URL}/${id}`);
  return response.data;
}