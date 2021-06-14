import renderer from "react-test-renderer";
import { I18nextProvider } from "react-i18next";
import App from "./App";
import i18n from "./core/i18n";

test("should show App component", () => {
  const component = renderer.create(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );
  const componentTree = component.toJSON()
  expect(componentTree).toMatchSnapshot()
});
