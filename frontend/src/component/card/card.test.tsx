import {
  render as rtlRender,
  fireEvent,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import Card, { Props } from "./Card";
import * as TimerCard from "./Card";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import timerReducer, { TimerState } from "../../store/timer";
import userEvent from "@testing-library/user-event";

function render(ui: any, initTimer?: TimerState) {
  const store = configureStore({
    reducer: {
      timer: timerReducer,
    },
    preloadedState: {
      timer: initTimer || {
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
  expect(screen.getByLabelText("input-title")).toHaveStyle({
    display: "none",
  });

  // 時間・日時指定トグルの状態
  const switchButton = screen.getByLabelText("time-set-toggle");
  expect(switchButton).toBeInTheDocument();
  expect(switchButton).not.toBeChecked();
  expect(screen.getByDisplayValue("10:10")).toBeInTheDocument();
  expect(screen.queryByLabelText("time-input")).not.toBeInTheDocument();
});

test("タイトル編集ボタンを押したら、編集モードに切り替わる", () => {
  const mockProps: Props = {
    id: "hoge",
    onDelete: jest.fn(),
  };
  render(<Card {...mockProps} />);
  fireEvent.click(screen.getByLabelText("edit-title"));
  expect(screen.getByLabelText("input-title")).not.toHaveStyle({
    display: "none",
  });
  expect(screen.getByLabelText("title")).toHaveStyle({
    display: "none",
  });
  // もう一度編集ボタンを押したら編集モードがクローズする
  fireEvent.click(screen.getByLabelText("edit-title"));
  expect(screen.getByLabelText("input-title")).toHaveStyle({
    display: "none",
  });
  expect(screen.getByLabelText("title")).not.toHaveStyle({
    display: "none",
  });
});
test.skip("時間設定トグルボタンを押したら、時間指定モードに切り替わる", () => {
  const mockProps: Props = {
    id: "hoge",
    onDelete: jest.fn(),
  };
  render(<Card {...mockProps} />);
  const switchButton = screen.getByLabelText("time-set-toggle");
  expect(switchButton).toBeInTheDocument();
  // FIXME: スイッチのトグルを変更できない
  //   console.log(fireEvent.click(switchButton));
  userEvent.click(switchButton);
  expect(switchButton).toBeChecked();
  expect(screen.queryByDisplayValue("10:10")).not.toBeInTheDocument();
});
test("編集時にタイトル編集ボタンを押したらストアのタイトルが更新される", () => {
  const mockProps: Props = {
    id: "hoge",
    onDelete: jest.fn(),
  };
  render(<Card {...mockProps} />);
  fireEvent.click(screen.getByLabelText("edit-title"));
  expect(screen.getByLabelText("input-title")).not.toHaveStyle({
    display: "none",
  });
  expect(screen.getByLabelText("title")).toHaveStyle({
    display: "none",
  });
  userEvent.type(
    within(screen.getByLabelText("input-title")).getByRole("textbox"),
    "title2"
  );
  // もう一度編集ボタンを押したら編集モードがクローズする
  fireEvent.click(screen.getByLabelText("edit-title"));
  expect(screen.getByLabelText("input-title")).toHaveStyle({
    display: "none",
  });
  expect(screen.getByLabelText("title")).not.toHaveStyle({
    display: "none",
  });
  //   screen.debug();
  expect(screen.getByLabelText("title")).toHaveTextContent("title_hogetitle2");
});
test("スタートを押したら時間設定部分が非活性化する", async () => {
  const mockProps: Props = {
    id: "hoge",
    onDelete: jest.fn(),
  };
  render(<Card {...mockProps} />, {
    length: 1,
    timers: {
      hoge: {
        id: "hoge",
        date: {
          hour: 10,
          minute: 10,
        },
        inputMode: "remain",
        remain: {
          time: 1,
          unit: "h",
        },
        title: "title_hoge",
      },
    },
  });
  fireEvent.click(
    screen.getByRole("button", {
      name: /play/i,
    })
  );

  await waitFor(() => {
    expect(
      screen.getByRole("button", {
        name: /play/i,
      })
    ).not.toBeDisabled();
  });

  expect(screen.getByLabelText("edit-title")).not.toBeDisabled();
  expect(screen.getByLabelText("time-set-toggle")).toBeDisabled();
});
test.skip("スタートし、指定した時間になったらアラートが表示される", async () => {
  const spyAlert = jest.spyOn(TimerCard, "timerAlert").mockReturnValue();
  //   jest.useFakeTimers();
  const mockProps: Props = {
    id: "hoge",
    onDelete: jest.fn(),
  };
  render(<Card {...mockProps} />, {
    length: 1,
    timers: {
      hoge: {
        id: "hoge",
        date: {
          hour: 10,
          minute: 10,
        },
        inputMode: "remain",
        remain: {
          time: 1,
          unit: "s",
        },
        title: "title_hoge",
      },
    },
  });
  fireEvent.click(
    screen.getByRole("button", {
      name: /play/i,
    })
  );
  // FIXME: タイマー完了後のアラート処理のチェック
  //   jest.runAllTimers();
  await waitFor(() => expect(spyAlert).toBeCalled(), {
    timeout: 2000,
  });
});
