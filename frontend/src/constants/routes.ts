import { generatePath } from "react-router-dom";

export const POSTS = "/posts";
export const CREATE_POST = `${POSTS}/new`;
export const UPDATE_POST = `${POSTS}/:postId/edit`;
export const POST_DETAILS = `${POSTS}/:postId`;

export const createPostPath = generatePath(CREATE_POST);
export const updatePostPath = (postId: number) => generatePath(UPDATE_POST, { postId });
export const postDetailsPath = (postId: number) => generatePath(POST_DETAILS, { postId });