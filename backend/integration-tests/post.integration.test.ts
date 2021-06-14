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

  it("should create new post and be able to retrive it", async () => {
    const response = await requests.createPost("Test1", "Test1");

    expect(response).toMatchObject(
      expect.objectContaining({
        title: "Test1",
        blog: "Test1",
      })
    );
  });

  it("should retrive all posts without comments and validate newly createdshould retrive all posts without comments and validate newly created", async () => {
    await requests.createPost("Test2", "Test2");
    const response = await requests.getAllPosts();

    expect(response).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Test2",
          blog: "Test2",
        }),
      ])
    );
  });

  it("should be able to update post", async () => {
    const created = await requests.createPost("Test3", "Test3");

    await requests.updatePost(created.id, "Test3_1", "Test3_1");

    const response = await requests.getPost(created.id);

    expect(response).toMatchObject(
      expect.objectContaining({
        title: "Test3_1",
        blog: "Test3_1",
      })
    );
  });

  it("should retrive post without comments and validate newly created", async () => {
    const created = await requests.createPost("Test4", "Test4");
    const response = await requests.getPost(created.id);

    expect(response).toMatchObject(
      expect.objectContaining({
        title: "Test4",
        blog: "Test4",
      })
    );
  });

  it("should create post and successfully delete and not be able to delete deleted", async () => {
    const created = await requests.createPost("Test5", "Test5");
    await requests.deletePost(created.id);
    await requests.getPost(created.id, 404);
    await requests.deletePost(created.id, 404);
  });

  it("should retrive post with comments and be able to delete post with all comments", async () => {
    const created = await requests.createPost("Test6", "Test6");
    const comment1 = await requests.createComment(created.id, "Text1", "Name1");
    const comment2 = await requests.createComment(created.id, "Text2", "Name2");

    const response = await requests.getPostWithComments(created.id);
    expect(response).toMatchObject(
      expect.objectContaining({
        title: created.title,
        blog: created.blog,
        numberOfComments: 2,
        comments: [comment1, comment2],
      })
    );

    await requests.deletePost(created.id);
    await requests.getComment(comment1.id, 404);
    await requests.getComment(comment2.id, 404);
    await requests.getPostWithComments(created.id, 404);
  });

  afterAll(async () => {
    await env.stopApp();
  });
});
