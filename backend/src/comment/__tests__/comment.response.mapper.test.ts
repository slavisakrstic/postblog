import { Comment } from "../entities/comment.entity";
import { toCommentResponseMapper } from "../mappers/comment.response.mapper";
import { testDateNow } from "../__mocks__/comment-data";

describe("toCommentResponseMapper", () => {
  it("should returns mapped object from Comment into CommentResponse", () => {
    const comment = new Comment();
    comment.id = 1;
    comment.name = "comment";
    comment.text = "text";
    comment.createdAt = new Date(testDateNow);
    comment.updatedAt = new Date(testDateNow);
    comment.deletedAt = null;

    const result = toCommentResponseMapper(comment);
    expect(result).toEqual({
      id: 1,
      name: "comment",
      text: "text",
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
    });
  });
});
