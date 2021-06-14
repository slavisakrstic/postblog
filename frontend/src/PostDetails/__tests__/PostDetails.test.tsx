import { QueryClientProvider } from "react-query";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { createQueryClient } from "../../services/queryClient";
import axios from "axios";
import PostDetails from "../PostDetails";

jest.mock("axios");

const mockHistoryPush = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));


jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    postId: "1",
  }),
  useRouteMatch: () => ({ url: "/posts/1", params: { postId: 1 } }),
}));

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

describe("PostDetails", () => {
  let defaultProps: any;
  const queryClient = createQueryClient();
  const apiData = {
    data: {
      id: 1,
      title: "title 1",
      blog: "blog 1",
      numberOfComments: 2,
      comments: [{
        id: 1,
        name: "Comment 1",
        text: "Text 1"
      }, {
        id: 2,
        text: "Text 2"
      }]
    }
  }

  beforeEach(() => {
    defaultProps = {
      portId: 1
    };
  })

  it("should render PostDetails component and fetch all comments", async () => {
    const fetchMock = jest.fn().mockResolvedValue(apiData);
    axios.get = fetchMock;

    const rendered = render(
      <QueryClientProvider client={queryClient}><PostDetails {...defaultProps} /></QueryClientProvider>
    );

    expect(axios.get).toBeCalledWith(expect.stringContaining(`/v0/posts/${defaultProps.portId}/comments`),)

    await waitFor(() => {
      expect(rendered.getByTestId("backToPosts")).toBeInTheDocument();

      expect(rendered.getByTestId("1-title").innerHTML).toBe("title 1");
      expect(rendered.getByTestId("1-blog").innerHTML).toBe("blog 1");

      expect(rendered.getByTestId("1-name-box").innerHTML).toBe("Comment 1:");
      expect(rendered.getByTestId("1-text").innerHTML).toBe("Text 1");

      expect(rendered.getByTestId("2-name-box").innerHTML).toBe("__comment.anonymous:");
      expect(rendered.getByTestId("2-text").innerHTML).toBe("Text 2");
    });
  });

  it("should render PostDetails component and fetch all comments and go back", async () => {
    const fetchMock = jest.fn().mockResolvedValue(apiData);
    axios.get = fetchMock;

    const rendered = render(
      <QueryClientProvider client={queryClient}><PostDetails {...defaultProps} /></QueryClientProvider>
    );

    expect(axios.get).toBeCalledWith(expect.stringContaining(`/v0/posts/${defaultProps.portId}/comments`),)

    await waitFor(async () => {
      expect(rendered.getByTestId("backToPosts")).toBeInTheDocument();
      await fireEvent.click(rendered.getByTestId("backToPosts"));
      expect(mockHistoryPush).toHaveBeenCalledWith("/posts");
    });
  });

  it("should render PostDetails component and fetch all comments and create new comment", async () => {
    const fetchMock = jest.fn().mockResolvedValue(apiData);
    axios.get = fetchMock;

    const rendered = render(
      <QueryClientProvider client={queryClient}><PostDetails {...defaultProps} /></QueryClientProvider>
    );

    expect(axios.get).toBeCalledWith(expect.stringContaining(`/v0/posts/${defaultProps.portId}/comments`),)

    await waitFor(async () => {
      expect(rendered.getByTestId("create-action")).toBeInTheDocument();
      fireEvent.click(rendered.getByTestId("create-action"));
      fireEvent.click(rendered.getByTestId("0-cancel"));

      expect(rendered.getByTestId("1-title").innerHTML).toBe("title 1");
      expect(rendered.getByTestId("1-blog").innerHTML).toBe("blog 1");
    });
  });
});