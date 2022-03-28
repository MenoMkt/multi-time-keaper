import {
  render as rtlRender,
  fireEvent,
  screen,
  within,
} from "@testing-library/react";
import Card, { Props } from "./Card";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import timerReducer from "../../store/timer";

function render(ui: any) {
  const store = configureStore({
    reducer: {
      timer: timerReducer,
    },
    preloadedState: {
      timer: {
        length: 1,
        timers: {
          hoge: {
            id: "hoge",
            date: {
              hour: 10,
              minute: 10,
            },
            inputMode: "date",
            remain: {
              time: 1,
              unit: "s",
            },
            title: "title_hoge",
          },
        },
      },
    },
  });
  const Wrapper = (param: { children: any }) => {
    const { children } = param;
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper });
}

test("初期化したらPropsの値がタイトルに設定される", () => {
  const mockProps: Props = {
    id: "hoge",
    onDelete: jest.fn(),
  };
  render(<Card {...mockProps} />);
  expect(screen.getByText(/title_hoge/i)).toBeInTheDocument();

  // 時間・日時指定トグルの状態
  const switchButton = screen.getByLabelText("time-set-toggle");
  expect(switchButton).toBeInTheDocument();
  expect(within(switchButton).getByRole("checkbox")).not.toBeChecked();
});

test("タイトル編集ボタンを押したら、編集モードに切り替わる");
test("時間設定トグルボタンを押したら、時間指定モードに切り替わる");
test("編集時にタイトル編集ボタンを押したらストアのタイトルが更新される");
test("スタートを押したらタイトル編集ボタンと時間設定部分が非活性化する");
test("スタートし、指定した時間になったらアラートが表示される");
