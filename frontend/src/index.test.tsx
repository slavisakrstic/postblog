import ReactDOM from "react-dom";
import App from "./App";

jest.mock("react-dom", ()=> ({render: jest.fn()}))

test("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App/>, div);

  expect(ReactDOM.render).toHaveBeenCalledWith(<App />, div);
});