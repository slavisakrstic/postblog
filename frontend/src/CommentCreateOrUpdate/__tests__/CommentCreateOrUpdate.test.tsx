import { QueryClientProvider } from "react-query";
import { act, fireEvent, render } from "@testing-library/react";
import { createQueryClient } from "../../services/queryClient";
import axios from "axios";
import CommentCreateOrUpdate from "../CommentCreateOrUpdate";

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

describe("CommentCreateOrUpdate", () => {
  let defaultCreateProps: any;
  let defaultUpdateProps: any;
  const queryClient = createQueryClient();

  beforeEach(() => {
    defaultCreateProps = {
      open: true,
      action: "Create",
      postId: 1,
      handleClose: jest.fn(),
      refetch: jest.fn()
    };

    defaultUpdateProps = {
      open: true,
      comment: {
        id: 1,
        name: "Name",
        text: "Text"
      },
      action: "Update",
      postId: 1,
      handleClose: jest.fn(),
      refetch: jest.fn()
    };
  });

  it("should render create comment component with text and name empty", () => {
    const rendered = render(
      <QueryClientProvider client={queryClient}><CommentCreateOrUpdate {...defaultCreateProps} /></QueryClientProvider>
    );

    expect(rendered.getByTestId(`0-dialog-title`).innerHTML).toContain("__comment.createCommentTitle");
    expect(rendered.getByTestId(`0-name-input`).getAttribute("value")).toBe("");
    expect(rendered.getByTestId(`0-text-input-area`).innerHTML).toBe("");
  });

  it("should render update comment component with text and name", () => {
    const rendered = render(
      <QueryClientProvider client={queryClient}><CommentCreateOrUpdate {...defaultUpdateProps} /></QueryClientProvider>
    );

    expect(rendered.getByTestId(`${defaultUpdateProps.comment.id}-dialog-title`).innerHTML).toContain("__comment.updateCommentTitle");
    expect(rendered.getByTestId(`${defaultUpdateProps.comment.id}-name-input`).getAttribute("value")).toBe(defaultUpdateProps.comment.name);
    expect(rendered.getByTestId(`${defaultUpdateProps.comment.id}-text-input-area`).innerHTML).toBe(defaultUpdateProps.comment.text);
  });

  it("should render create comment component and submit create request", async () => {
    const createMock = jest.fn().mockResolvedValue({ data: null });
    axios.post = createMock;

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <CommentCreateOrUpdate {...defaultCreateProps} />
      </QueryClientProvider>
    );

    expect(rendered.getByTestId(`0-name-input`).getAttribute("value")).toBe("");
    expect(rendered.getByTestId(`0-text-input-area`).innerHTML).toBe("");

    await fireEvent.change(rendered.getByTestId(`0-name-input`), { target: { value: "New Name" } });
    await fireEvent.change(rendered.getByTestId(`0-text-input-area`), { target: { value: "New Text" } });
    expect(rendered.getByTestId(`0-name-input`).getAttribute("value")).toBe("New Name");
    expect(rendered.getByTestId(`0-text-input-area`).innerHTML).toBe("New Text");

    const action = rendered.getByTestId(`0-ok`);
    await act(async () => {
      await fireEvent.click(action);
    });

    expect(createMock).toHaveBeenCalledWith(
      expect.stringContaining(`/v0/comments`),
      {
        "name": "New Name", 
        "postId": 1, 
        "text": "New Text"
      }
    );
    expect(defaultCreateProps.refetch).toHaveBeenCalled();
  });

  it("should render update comment component and submit update request", async () => {
    const updateMock = jest.fn().mockResolvedValue({ data: null });
    axios.put = updateMock;

    const rendered = render(
      <QueryClientProvider client={queryClient}>
        <CommentCreateOrUpdate {...defaultUpdateProps} />
      </QueryClientProvider>
    );

    expect(rendered.getByTestId(`${defaultUpdateProps.comment.id}-name-input`).getAttribute("value")).toBe(defaultUpdateProps.comment.name);
    expect(rendered.getByTestId(`${defaultUpdateProps.comment.id}-text-input-area`).innerHTML).toBe(defaultUpdateProps.comment.text);

    await fireEvent.change(rendered.getByTestId(`${defaultUpdateProps.comment.id}-name-input`), { target: { value: "New Name" } });
    await fireEvent.change(rendered.getByTestId(`${defaultUpdateProps.comment.id}-text-input-area`), { target: { value: "New Text" } });
    expect(rendered.getByTestId(`${defaultUpdateProps.comment.id}-name-input`).getAttribute("value")).toBe("New Name");
    expect(rendered.getByTestId(`${defaultUpdateProps.comment.id}-text-input-area`).innerHTML).toBe("New Text");

    const action = rendered.getByTestId(`${defaultUpdateProps.comment.id}-ok`);
    await act(async () => {
      await fireEvent.click(action);
    });

    expect(updateMock).toHaveBeenCalledWith(
      expect.stringContaining(`/v0/comments/${defaultUpdateProps.comment.id}`),
      {
        "name": "New Name",
        "text": "New Text"
      }
    );
    expect(defaultUpdateProps.refetch).toHaveBeenCalled();
  });
});