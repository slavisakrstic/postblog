import { render } from "@testing-library/react";
import { createQueryClient } from "../../services/queryClient";
import { QueryClientProvider } from 'react-query';
import axios from "axios";
import Main from "../Main";

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

describe("Main", () => {
  const queryClient = createQueryClient();

  it("should render main component", async () => {
    const getMock = jest.fn().mockResolvedValue({
      data: [{
        id: 1,
        title: "title 1",
        blog: "blog 1",
        numberOfComments: 2
      }]
    });
    axios.get = getMock;

    expect(render(<QueryClientProvider client={queryClient}><Main /></QueryClientProvider>)).toMatchSnapshot();
  });
})