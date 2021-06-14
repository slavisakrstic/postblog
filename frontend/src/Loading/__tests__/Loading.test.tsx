import { render } from "@testing-library/react";
import Loading from "../Loading";

describe("Loading", () => {
  it("should render loading component", async () => {
    const rendered = render(<Loading />);
    expect(rendered.getByTestId("linear-progress-id")).toBeInTheDocument();
  });
});