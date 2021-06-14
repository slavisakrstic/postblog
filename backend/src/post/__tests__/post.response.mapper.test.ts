import { Post } from "../entities/post.entity";
import { toPostResponseMapper } from "../mappers/post.response.mapper";
import { testDateNow } from "../__mocks__/post-data";

describe("toPostResponseMapper", () => {
  it("should returns mapped object from Post into PostResponse", () => {
    const post = new Post();
    post.id = 1;
    post.title = "title";
    post.blog = "blog";
    post.numberOfComments = 0;
    post.createdAt = new Date(testDateNow);
    post.updatedAt = new Date(testDateNow);
    post.deletedAt = null;

    const result = toPostResponseMapper(post);
    expect(result).toEqual({
      id: 1,
      title: "title",
      blog: "blog",
      numberOfComments: 0,
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
    });
  });
});
