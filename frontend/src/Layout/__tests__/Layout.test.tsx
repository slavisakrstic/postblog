import { QueryClientProvider } from "react-query";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { createQueryClient } from "../../services/queryClient";
import axios from "axios";
import Layout from "../Layout";

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

describe("Layout", () => {
  let defaultProps: any;
  const queryClient = createQueryClient();
  const apiDataGet = {
    data: {
      id: 1,
      title: "title 1",
      blog: "blog 1",
      numberOfComments: 2
    }
  };

  beforeEach(() => {
    defaultProps = {
      children: (<></>)
    };
  })

  it("should render Layout component and create new post", async () => {
    const getMock = jest.fn().mockResolvedValue(apiDataGet);
    axios.get = getMock;

    const rendered = render(
      <QueryClientProvider client={queryClient}><Layout {...defaultProps} /></QueryClientProvider>
    );

    await waitFor(async () => {
      expect(rendered.getByTestId("general-title").innerHTML).toContain("__general.title");
      expect(rendered.getByTestId("new-post")).toBeInTheDocument();

      await fireEvent.click(rendered.getByTestId("new-post"));
      expect(rendered.getByTestId("0-cancel")).toBeInTheDocument();

      await fireEvent.click(rendered.getByTestId("0-cancel"));
      expect(rendered.getByTestId("new-post")).toBeInTheDocument();
    });
  });
});