import { QueryClientProvider } from "react-query";
import { act, fireEvent, render } from "@testing-library/react";
import { createQueryClient } from "../../services/queryClient";
import axios from "axios";
import PostCard from "../PostCard";
import { postDetailsPath } from "../../constants/routes";

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

const mockHistoryPush = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe("PostCard", () => {
  let defaultProps: any;
  const queryClient = createQueryClient();

  beforeEach(() => {
    defaultProps = {
      post: {
        id: 1,
        title: "title",
        blog: "blog",
        numberOfComments: 2
      },
      refetch: jest.fn()
    }
  })

  it("should render post card component with title, name and number of comments", () => {
    const rendered = render(
      <QueryClientProvider client={queryClient}><PostCard {...defaultProps} /></QueryClientProvider>
    );
    expect(rendered.getByTestId(`${defaultProps.post.id}-title`).innerHTML).toBe("title");
    expect(rendered.getByTestId(`${defaultProps.post.id}-blog`).innerHTML).toBe("blog");
    expect(rendered.getByTestId(`${defaultProps.post.id}-numberOfComments`).innerHTML).toContain("2");
  });

  it("should render post card component and execute delete action", async () => {
    const deleteMock = jest.fn().mockResolvedValue({ data: null });
    axios.delete = deleteMock;
    
    await act(async () => {
      const rendered = render(
        <QueryClientProvider client={queryClient}>
          <PostCard {...defaultProps} />
        </QueryClientProvider>
      );

      const deleteAction = rendered.getByTestId(`${defaultProps.post.id}-delete-action`);
      await fireEvent.click(deleteAction);
  
      expect(rendered.getByTestId(`${defaultProps.post.id}-confirm-text`).innerHTML).toBe("__post.deleteMsg");
  
      const confirm = rendered.getByTestId(`${defaultProps.post.id}-ok`);
      await fireEvent.click(confirm);
    })

    expect(deleteMock).toHaveBeenCalledWith(expect.stringContaining(`/v0/posts/${defaultProps.post.id}`));
    expect(defaultProps.refetch).toHaveBeenCalled();
  });

  it("should render post card component and execute edit action", async () => {
    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <PostCard {...defaultProps} />
      </QueryClientProvider>
    );

    const editAction = rendered.getByTestId(`${defaultProps.post.id}-edit-action`);
    await fireEvent.click(editAction);

    expect(rendered.getByTestId(`${defaultProps.post.id}-dialog-title`).innerHTML).toContain("__post.updatePostTitle");
    expect(rendered.getByTestId(`${defaultProps.post.id}-title`).innerHTML).toBe("title");
    expect(rendered.getByTestId(`${defaultProps.post.id}-blog`).innerHTML).toBe("blog");
  });

  it("should render post card component and execute view action", async () => {
    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <PostCard {...defaultProps} />
      </QueryClientProvider>
    );

    const viewAction = rendered.getByTestId(`${defaultProps.post.id}-view-action`);
    await fireEvent.click(viewAction);

    expect(mockHistoryPush).toBeCalledWith(postDetailsPath(defaultProps.post.id));
  });
});