import App from "../src/App.js"
import { MissionUtils } from "@woowacourse/mission-utils"
import { EOL as LINE_SEPARATOR } from "os"

const mockQuestions = (inputs) => {
    MissionUtils.Console.readLineAsync = jest.fn()

    MissionUtils.Console.readLineAsync.mockImplementation(() => {
        const input = inputs.shift()

        return Promise.resolve(input)
    });
};

const getLogSpy = () => {
    const logSpy = jest.spyOn(MissionUtils.Console, "print")
    logSpy.mockClear()

    return logSpy
};

const getOutput = (logSpy) => {
    return [...logSpy.mock.calls].join(LINE_SEPARATOR)
}

const expectLogContains = (received, expectedLogs) => {
    expectedLogs.forEach((log) => {
        expect(received).toContain(log);
    })
}

const runDateException = async (input) => {
    // given
    const INVALID_DATE_MESSAGE = "[ERROR] 유효하지 않은 날짜입니다. 다시 입력해 주세요.";
    const INPUTS_TO_END = ["1", "해산물파스타-2"];
    const logSpy = getLogSpy();
    mockQuestions([input, ...INPUTS_TO_END]);

    // when
    const app = new App();
    await app.run();

    // then
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(INVALID_DATE_MESSAGE));
}

const runMenuException = async (input) => {
    // given
    const INVALID_ORDER_MESSAGE = "[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.";
    const INPUTS_TO_END = ["해산물파스타-2"];
    const logSpy = getLogSpy();
    mockQuestions(["3", input, ...INPUTS_TO_END]);

    // when
    const app = new App();
    await app.run();

    // then
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(INVALID_ORDER_MESSAGE));
  }

describe("기능 테스트", () => {
    test("모든 타이틀 출력", async () => {
        // given
        const logSpy = getLogSpy();
        mockQuestions(["3", "티본스테이크-1,바비큐립-1,초코케이크-2,제로콜라-1"]);

        // when
        const app = new App();
        await app.run();

        // then
        const expected = [
        "<주문 메뉴>",
        "<할인 전 총주문 금액>",
        "<증정 메뉴>",
        "<혜택 내역>",
        "<총혜택 금액>",
        "<할인 후 예상 결제 금액>",
        "<12월 이벤트 배지>",
        ];

        expectLogContains(getOutput(logSpy), expected);
    })
    
    test("혜택 내역 타이틀과 없음 출력", async () => {
        // given
        const logSpy = getLogSpy();
        mockQuestions(["26", "타파스-1,제로콜라-1"]);

        // when
        const app = new App();
        await app.run();

        // then
        const expected = ["<혜택 내역>" + LINE_SEPARATOR + "없음"];

        expectLogContains(getOutput(logSpy), expected);
    })

    test("증정 메뉴 타이틀과 없음 출력 ", async () => {
        // given
        const logSpy = getLogSpy();
        mockQuestions(["26", "타파스-1,제로콜라-1"]);

        // when
        const app = new App();
        await app.run();

        // then
        const expected = ["<증정 메뉴>" + LINE_SEPARATOR + "없음"];

        expectLogContains(getOutput(logSpy), expected);
    })

    test("금액에 맞게 배지 잘 출력되는지 확인", async () => {
        // given
        const logSpy = getLogSpy();
        mockQuestions(["3", "티본스테이크-2,바비큐립-1,초코케이크-2,제로콜라-1"]);

        // when
        const app = new App();
        await app.run();

        // then
        const expected = [
        "산타"
        ];

        expectLogContains(getOutput(logSpy), expected);
    })
})

describe("예외 테스트", () => {
    test("[날짜] 숫자가 아닌 경우", async () => {
        await runDateException("a")
    })
    test("[날짜] 정수가 아닌 경우", async () => {
        await runDateException("1.1")
    })
    test("[날짜] 1-31 사이 숫자가 아닌 경우", async () => {
        await runDateException("32")
    })

    test("[주문] 주문 형식이 잘못된 경우", async () => {
        await runMenuException("제로콜라1,바비큐립1")
    })
    test("[주문] 메뉴에 없는 음식을 주문한 경우", async () => {
        await runMenuException("펩시콜라-1,바비큐립-1")
    })
    test("[주문] 중복된 메뉴가 있는 경우", async () => {
        await runMenuException("바비큐립-1,바비큐립-2")
    })
    test("[주문] 메뉴 개수가 20개 초과인 경우", async () => {
        await runMenuException("바비큐립-15,제로콜라-20")
    })
    test("[주문] 음료만 주문한 경우", async () => {
        await runMenuException("제로콜라-5")
    })
})
