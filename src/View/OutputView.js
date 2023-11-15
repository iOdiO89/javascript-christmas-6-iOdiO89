import { MissionUtils } from '@woowacourse/mission-utils'
import Menu from '../Model/Menu'

const OutputView = {
    printWelcomeMsg(){
        MissionUtils.Console.print("안녕하세요! 우테코 식당 12월 이벤트 플래너입니다.")
    },

    printPreviewMsg(date){
        MissionUtils.Console.print(`12월 ${date}일에 우테코 식당에서 받을 이벤트 혜택 미리 보기!`)
        MissionUtils.Console.print(``)
    },

    printMenuMsg() {
        MissionUtils.Console.print("<주문 메뉴>")
    }, 

    printMenuDetail(name, count){
        MissionUtils.Console.print(`${name} ${count}개`)
    },

    printTotalPrice(totalPrice) {
        MissionUtils.Console.print(``)
        MissionUtils.Console.print("<할인 전 총주문 금액>")
        MissionUtils.Console.print(`${totalPrice.toLocaleString()}원`)
        MissionUtils.Console.print(``)
    },

    printGift(totalPrice) {
        MissionUtils.Console.print("<증정 메뉴>")
        if(totalPrice >= 120000)
            MissionUtils.Console.print('샴페인 1개')
        else
            MissionUtils.Console.print('없음')
        MissionUtils.Console.print('')
    },

    printBenefitMsg(){
        MissionUtils.Console.print("<혜택 내역>")
    },

    printMsg(msg){
        MissionUtils.Console.print(`${msg}`)
    },

    printTotalDiscount(discount){
        MissionUtils.Console.print('')
        MissionUtils.Console.print("<총혜택 금액>")
        if(discount > 0)
            MissionUtils.Console.print(`-${discount.toLocaleString()}원`)
        else
            MissionUtils.Console.print('0원')
        MissionUtils.Console.print('')
    },

    printFinalPrice(totalPrice, discount){
        MissionUtils.Console.print("<할인 후 예상 결제 금액>")
        MissionUtils.Console.print(`${(totalPrice-discount).toLocaleString()}원`)
        MissionUtils.Console.print('')
    },

    printBadge(discount){
        MissionUtils.Console.print("<12월 이벤트 배지>")
        if(discount < 5000)
            MissionUtils.Console.print("없음")
        else if(discount < 10000)
            MissionUtils.Console.print("별")
        else if(discount < 20000)
            MissionUtils.Console.print("트리")
        else if(discount >= 20000)
            MissionUtils.Console.print("산타")
    },
    
    printGiftDiscount(){
        MissionUtils.Console.print("증정 이벤트: -25,000원")
    },

    printSpecialDiscount(){
        MissionUtils.Console.print("특별 할인: -1,000원")
    }
}

export default OutputView;