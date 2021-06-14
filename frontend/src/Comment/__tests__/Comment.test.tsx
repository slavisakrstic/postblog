import { QueryClientProvider } from "react-query";
import { act, fireEvent, render } from "@testing-library/react";
import { createQueryClient } from "../../services/queryClient";
import axios from "axios";
import Comment from "../Comment";

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

describe("Comment", () => {
  let defaultProps: any;
  const queryClient = createQueryClient();

  beforeEach(() => {
    defaultProps = {
      comment: {
        id: 1,
        text: "text",
        name: "name",
        postId: 1
      },
      refetch: jest.fn()
    }
  })

  it("should render comment component with text and name", () => {
    const rendered = render(
      <QueryClientProvider client={queryClient}><Comment {...defaultProps} /></QueryClientProvider>
    );

    expect(rendered.getByTestId(`${defaultProps.comment.id}-name-box`).innerHTML).toBe("name:");
    expect(rendered.getByTestId(`${defaultProps.comment.id}-text`).innerHTML).toBe("text");
  });

  it("should render comment component and execute delete action", async () => {
    const deleteMock = jest.fn().mockResolvedValue({ data: null });
    axios.delete = deleteMock;
    
    await act(async () => {
      const rendered = render(
        <QueryClientProvider client={queryClient}>
          <Comment {...defaultProps} />
        </QueryClientProvider>
      );

      const deleteAction = rendered.getByTestId(`${defaultProps.comment.id}-delete-action`);
      await fireEvent.click(deleteAction);
  
      expect(rendered.getByTestId(`${defaultProps.comment.id}-confirm-text`).innerHTML).toBe("__comment.deleteMsg");
  
      const confirm = rendered.getByTestId(`${defaultProps.comment.id}-ok`);
      await fireEvent.click(confirm);
    })

    expect(deleteMock).toHaveBeenCalledWith(expect.stringContaining(`/v0/comments/${defaultProps.comment.id}`));
    expect(defaultProps.refetch).toHaveBeenCalled();
  });

  it("should render comment component and execute edit action", async () => {
    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <Comment {...defaultProps} />
      </QueryClientProvider>
    );

    const editAction = rendered.getByTestId(`${defaultProps.comment.id}-edit-action`);
    await fireEvent.click(editAction);

    expect(rendered.getByTestId(`${defaultProps.comment.id}-dialog-title`).innerHTML).toContain("__comment.updateCommentTitle");
    expect(rendered.getByTestId(`${defaultProps.comment.id}-name-input`).getAttribute("value")).toBe("name");
    expect(rendered.getByTestId(`${defaultProps.comment.id}-text-input-area`).innerHTML).toBe("text");
  });

  it("should render comment component as Anonymous", async () => {
    const props = {
      ...defaultProps,
      comment: {
        id: 1,
        text: "text",
        name: null,
        postId: 1
      },
    }
    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <Comment {...props} />
      </QueryClientProvider>
    );

    expect(rendered.getByTestId(`${defaultProps.comment.id}-name-box`).innerHTML).toBe("__comment.anonymous:");
  });
});