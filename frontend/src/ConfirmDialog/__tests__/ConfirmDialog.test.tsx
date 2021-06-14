import { render } from "@testing-library/react"
import ConfirmDialog from "../ConfirmDialog";

jest.mock("react-i18next", () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

describe("ConfirmDialog", () => {
  let defaultProps: any;

  beforeEach(() => {
    defaultProps = {
      id: 1,
      message: "Are you sure you want to delete this comment?",
      open: true,
      handleClose: jest.fn(),
      handleDelete: jest.fn(),
    }
  })

  it("should render appropriate text when action is delete", () => {
    const rendered = render(<ConfirmDialog {...defaultProps} />)
    expect(rendered.getByTestId(`${defaultProps.id}-confirm-text`).innerHTML).toBe("Are you sure you want to delete this comment?")
    expect(rendered.getByTestId(`${defaultProps.id}-ok`)).toBeInTheDocument()
    expect(rendered.getByTestId(`${defaultProps.id}-cancel`)).toBeInTheDocument()
  })
});