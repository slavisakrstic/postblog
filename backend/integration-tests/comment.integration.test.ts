import App from "./setup/app";
import Requests from "./setup/requests";

jest.setTimeout(90000);

describe("Posts", () => {
  const env = new App();

  let requests: Requests;

  beforeAll(async () => {
    await env.start();
    requests = new Requests(env.getApp().getHttpServer());
  });

  it("should create new comment and be able to retrive it", async () => {
    const post = await requests.createPost("Post_Comment1", "Post_Comment1");
    const response = await requests.createComment(post.id, "Test1", "Test1");

    expect(response).toMatchObject(
      expect.objectContaining({
        name: "Test1",
        text: "Test1",
        postId: post.id,
      })
    );
  });

  it("should be able to update comment", async () => {
    const post = await requests.createPost("Post_Comment2", "Post_Comment2");
    const created = await requests.createComment(post.id, "Test2", "Test2");
    await requests.updateComment(created.id, "Test2_1", "Test2_1");

    const response = await requests.getComment(created.id);

    expect(response).toMatchObject(
      expect.objectContaining({
        name: "Test2_1",
        text: "Test2_1",
      })
    );
  });

  it("should create comment and successfully delete and not be able to delete deleted", async () => {
    const post = await requests.createPost("Post_Comment3", "Post_Comment3");
    const created = await requests.createComment(post.id, "Test3", "Test3");
    await requests.deleteComment(created.id);
    await requests.getComment(created.id, 404);
    await requests.deleteComment(created.id, 404);
  });

  it("should create two comments and successfully delete one, and verify number of comments in post", async () => {
    const post = await requests.createPost("Post_Comment4", "Post_Comment4");

    let response = await requests.getPost(post.id);
    expect(response.numberOfComments).toEqual(0);

    const createdComment1 = await requests.createComment(post.id, "Test4_1", "Test4_1");

    response = await requests.getPost(post.id);
    expect(response.numberOfComments).toEqual(1);

    const createdComment2 = await requests.createComment(post.id, "Test4_2", "Test4_2");

    response = await requests.getPost(post.id);
    expect(response.numberOfComments).toEqual(2);

    await requests.deleteComment(createdComment1.id);
    response = await requests.getPost(post.id);
    expect(response.numberOfComments).toEqual(1);

    await requests.deleteComment(createdComment2.id);
    response = await requests.getPost(post.id);
    expect(response.numberOfComments).toEqual(0);
  });

  afterAll(async () => {
    await env.stopApp();
  });
});
