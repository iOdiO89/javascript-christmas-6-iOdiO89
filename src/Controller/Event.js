import InputView from '../View/InputView'
import OutputView from '../View/OutputView'

class Event{
    #date // 방문 예상 날짜
    #menu // menu 객체 리스트
    #totalPrice // 할인 전 총 금액
    #gift // 사은품
    #badge // 이벤트 뱃지
    #discount // 할인 금액

    constructor(){
        this.#badge = null
        this.#gift = null
        this.#discount = 0
        this.#totalPrice = 0
    }

    async runEvent(){
        OutputView.printWelcomeMsg()
        this.#date = await InputView.readDate()
    }

}

module.exports = Event