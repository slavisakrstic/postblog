import { QueryClientProvider } from "react-query";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { createQueryClient } from "../../services/queryClient";
import axios from "axios";
import Post from "../Post";

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


describe("Post", () => {
  let defaultProps: any;
  const queryClient = createQueryClient();

  beforeEach(() => {
    defaultProps = {};
  })

  it("should render Post component and fetch all posts", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      data: [{
        id: 1,
        title: "title 1",
        blog: "blog 1",
        numberOfComments: 2,
      }, {
        id: 2,
        title: "title 2",
        blog: "blog 2",
        numberOfComments: 0,
      }]
    });
    axios.get = fetchMock;

    const rendered = render(
      <QueryClientProvider client={queryClient}><Post {...defaultProps} /></QueryClientProvider>
    );

    expect(axios.get).toBeCalledWith(expect.stringContaining("/v0/posts"),)

    await waitFor(async () => {
      expect(rendered.getByTestId("1-numberOfComments").innerHTML).toContain("2");
      expect(rendered.getByTestId("1-title").innerHTML).toBe("title 1");
      expect(rendered.getByTestId("1-blog").innerHTML).toBe("blog 1");
      expect(rendered.getByTestId("1-view-action")).toBeInTheDocument();
      expect(rendered.getByTestId("1-edit-action")).toBeInTheDocument();
      expect(rendered.getByTestId("1-delete-action")).toBeInTheDocument();

      expect(rendered.getByTestId("2-numberOfComments").innerHTML).toContain("0");
      expect(rendered.getByTestId("2-title").innerHTML).toBe("title 2");
      expect(rendered.getByTestId("2-blog").innerHTML).toBe("blog 2");
      expect(rendered.getByTestId("2-view-action")).toBeInTheDocument();
      expect(rendered.getByTestId("2-edit-action")).toBeInTheDocument();
      expect(rendered.getByTestId("2-delete-action")).toBeInTheDocument();

      await fireEvent.click(rendered.getByTestId("1-view-action"));
      expect(mockHistoryPush).toBeCalled();
    });
  });
});