import { Post } from "../entities/post.entity";
import { testDateNow } from "../__mocks__/post-data";
import { toPostCommentsResponseMapper } from "../mappers/post-comments.response.mapper";

describe("toPostCommentsResponseMapper", () => {
  it("should returns mapped object from Post into PostCommentsResponse", () => {
    const post = new Post();
    post.id = 1;
    post.title = "title";
    post.blog = "blog";
    post.numberOfComments = 1;
    post.comments = [
      {
        id: 1,
        postId: 1,
        name: "comment",
        text: "text",
        createdAt: new Date(testDateNow),
        updatedAt: new Date(testDateNow),
        deletedAt: null,
      },
    ];
    post.createdAt = new Date(testDateNow);
    post.updatedAt = new Date(testDateNow);
    post.deletedAt = null;

    const result = toPostCommentsResponseMapper(post);
    expect(result).toEqual({
      id: 1,
      title: "title",
      blog: "blog",
      numberOfComments: 1,
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
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
    });
  });
});
