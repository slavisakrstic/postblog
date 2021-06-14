import { QueryClientProvider } from "react-query";
import { act, fireEvent, render } from "@testing-library/react";
import { createQueryClient } from "../../services/queryClient";
import axios from "axios";
import PostCreateOrUpdate from "../PostCreateOrUpdate";

jest.mock("axios");

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => { }),
      },
    };
  },
}));

describe("PostCreateOrUpdate", () => {
  let defaultCreateProps: any;
  let defaultUpdateProps: any;
  const queryClient = createQueryClient();

  beforeEach(() => {
    defaultCreateProps = {
      open: true,
      action: "Create",
      handleClose: jest.fn(),
      refetch: jest.fn()
    };

    defaultUpdateProps = {
      open: true,
      post: {
        id: 1,
        title: "Title",
        blog: "Blog"
      },
      action: "Update",
      postId: 1,
      handleClose: jest.fn(),
      refetch: jest.fn()
    };
  });

  it("should render create post component with title and blog empty", () => {
    const rendered = render(
      <QueryClientProvider client={queryClient}><PostCreateOrUpdate {...defaultCreateProps} /></QueryClientProvider>
    );

    expect(rendered.getByTestId(`0-dialog-title`).innerHTML).toContain("__post.createPostTitle");
    expect(rendered.getByTestId(`0-title-input`).getAttribute("value")).toBe("");
    expect(rendered.getByTestId(`0-blog-input-area`).innerHTML).toBe("");
  });

  it("should render update post component with title and blog", () => {
    const rendered = render(
      <QueryClientProvider client={queryClient}><PostCreateOrUpdate {...defaultUpdateProps} /></QueryClientProvider>
    );

    expect(rendered.getByTestId(`${defaultUpdateProps.post.id}-dialog-title`).innerHTML).toContain("__post.updatePostTitle");
    expect(rendered.getByTestId(`${defaultUpdateProps.post.id}-title-input`).getAttribute("value")).toBe(defaultUpdateProps.post.title);
    expect(rendered.getByTestId(`${defaultUpdateProps.post.id}-blog-input-area`).innerHTML).toBe(defaultUpdateProps.post.blog);
  });

  it("should render create comment component and submit create request", async () => {
    const createMock = jest.fn().mockResolvedValue({ data: null });
    axios.post = createMock;

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <PostCreateOrUpdate {...defaultCreateProps} />
      </QueryClientProvider>
    );

    expect(rendered.getByTestId(`0-title-input`).getAttribute("value")).toBe("");
    expect(rendered.getByTestId(`0-blog-input-area`).innerHTML).toBe("");

    await fireEvent.change(rendered.getByTestId(`0-title-input`), { target: { value: "New Title" } });
    await fireEvent.change(rendered.getByTestId(`0-blog-input-area`), { target: { value: "New Blog" } });
    expect(rendered.getByTestId(`0-title-input`).getAttribute("value")).toBe("New Title");
    expect(rendered.getByTestId(`0-blog-input-area`).innerHTML).toBe("New Blog");

    const action = rendered.getByTestId(`0-ok`);
    await act(async () => {
      await fireEvent.click(action);
    });

    expect(createMock).toHaveBeenCalledWith(
      expect.stringContaining(`/v0/posts`),
      {
        "title": "New Title",
        "blog": "New Blog"
      }
    );
    expect(defaultCreateProps.refetch).toHaveBeenCalled();
  });

  it("should render update comment component and submit update request", async () => {
    const updateMock = jest.fn().mockResolvedValue({ data: null });
    axios.put = updateMock;

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <PostCreateOrUpdate {...defaultUpdateProps} />
      </QueryClientProvider>
    );

    expect(rendered.getByTestId(`${defaultUpdateProps.post.id}-title-input`).getAttribute("value")).toBe(defaultUpdateProps.post.title);
    expect(rendered.getByTestId(`${defaultUpdateProps.post.id}-blog-input-area`).innerHTML).toBe(defaultUpdateProps.post.blog);

    await fireEvent.change(rendered.getByTestId(`${defaultUpdateProps.post.id}-title-input`), { target: { value: "New Title" } });
    await fireEvent.change(rendered.getByTestId(`${defaultUpdateProps.post.id}-blog-input-area`), { target: { value: "New Blog" } });
    expect(rendered.getByTestId(`${defaultUpdateProps.post.id}-title-input`).getAttribute("value")).toBe("New Title");
    expect(rendered.getByTestId(`${defaultUpdateProps.post.id}-blog-input-area`).innerHTML).toBe("New Blog");

    const action = rendered.getByTestId(`${defaultUpdateProps.post.id}-ok`);
    await act(async () => {
      await fireEvent.click(action);
    });

    expect(updateMock).toHaveBeenCalledWith(
      expect.stringContaining(`/v0/posts/${defaultUpdateProps.post.id}`),
      {
        "title": "New Title",
        "blog": "New Blog"
      }
    );
    expect(defaultUpdateProps.refetch).toHaveBeenCalled();
  });
});