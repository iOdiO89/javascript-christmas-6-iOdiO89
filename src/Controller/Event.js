import InputView from '../View/InputView'
import OutputView from '../View/OutputView'
import Menu from '../Model/Menu'
import { MissionUtils } from '@woowacourse/mission-utils'

class Event{
    #date // 방문 예상 날짜
    #menu // menu 객체 리스트
    #totalPrice // 할인 전 총 금액
    #gift // 증정품
    #badge // 이벤트 뱃지
    #discount // 할인 금액
    #giftPrice // 증정품 가격

    constructor(){
        this.#badge = null
        this.#gift = null
        this.#discount = 0
        this.#totalPrice = 0
        this.#giftPrice = 0
    }

    // 이벤트 플래너 전체 진행
    async runEvent(){
        OutputView.printWelcomeMsg() // 안녕하세요! 우테코 식당 12월 이벤트 플래너입니다.
        this.#date = await InputView.readDate() // 날짜 입력받기
        this.#menu = await this.#getMenuInfo() // 메뉴, 개수 입력받기
        OutputView.printPreviewMsg(this.#date) // 12월 {날짜}에 우테코 식당에서 받을 이벤트 혜택 미리 보기!
        this.#printMenu() // 주문 메뉴 출력
        this.#printTotalPrice() // 할인 전 총주문 금액 출력
        OutputView.printGift(this.#totalPrice) // 증정 메뉴 출력
        this.#printBenefit(this.#discount) // 혜택 내역 출력
        OutputView.printTotalDiscount(this.#discount + this.#giftPrice) // 총혜택 금액 출력
        OutputView.printFinalPrice(this.#totalPrice, this.#discount) // 할인 후 예상 결제 금액 출력
        OutputView.printBadge(this.#discount + this.#giftPrice) // 12월 이벤트 배지 출력
    }

    // 메뉴 이름, 개수 개별 출력
    #printMenu(){
        OutputView.printMenuMsg()
        this.#menu.map(menu => {
            const name = menu.getName()
            const count = menu.getCount()
            OutputView.printMenuDetail(name, count)
        })
    }

    // 할인 전 총주문 금액 출력
    #printTotalPrice(){
        this.#totalPrice = 0
        this.#menu.map(menu => {
            const count = menu.getCount()
            const price = menu.getPrice()
            this.#totalPrice += count * price
        })
        OutputView.printTotalPrice(this.#totalPrice)
    }

    // 헤택 내역 출력
    #printBenefit(){
        OutputView.printBenefitMsg()
        this.#discount = 0 // init
        this.#giftPrice = 0
        if(this.#totalPrice >= 10000){
            this.#discount += this.#christmasDiscount() // 크리스마스 디데이 할인
            if(this.#isWeekday())
                this.#discount += this.#weekDayDiscount() // 평일 할인
            else this.#discount += this.#weekendDiscount() // 주말 할인
            this.#discount += this.#specialDiscount() // 특별 할인
            this.#giftPrice = this.#giftDiscount() // 증정 이벤트
        }
        if((this.#discount+this.#giftPrice) === 0) OutputView.printMsg(`없음`)
    }

    // 크리스마스 디데이 할인
    #christmasDiscount(){
        let discount = 0
        if(this.#date <= 25) {
            discount = 1000
            discount += 100 * (this.#date-1)
        }
        if(discount>0) OutputView.printMsg(`크리스마스 디데이 할인: -${discount.toLocaleString()}원`)
        return discount
    }

    // 평일 할인
    #weekDayDiscount(){
        let discount = 0
        this.#menu.map(menu => {
            if(menu.getType() === '디저트') discount += (2023 * menu.getCount())
        })
        if(discount>0) OutputView.printMsg(`평일 할인: -${discount.toLocaleString()}원`)
        return discount
    }

    // 주말 할인
    #weekendDiscount(){
        let discount = 0
        this.#menu.map(menu => {
            if(menu.getType() === '메인') discount += (2023 * menu.getCount())
        })
        if(discount>0) OutputView.printMsg(`주말 할인: -${discount.toLocaleString()}원`)
        return discount
    }

    // 평일 or 주말 확인. 평일이면 return true / 주말이면 return false
    #isWeekday(){
        if(this.#date%7 !== 1 && this.#date%7 !== 2) return true
        return false
    }

    // 특별 할인
    #specialDiscount(){
        if(this.#date%7 === 3 || this.#date === 25){
            OutputView.printMsg(`특별 할인: -1,000원`)
            return 1000
        }
        return 0
    }

    // 증정 이벤트
    #giftDiscount(){
        if(this.#totalPrice > 120000){
            OutputView.printMsg(`증정 이벤트: -25,000원`)
            return 25000
        }
        return 0
    }

    // 메뉴 이름, 개수 입력받기
    async #getMenuInfo(){
        while(true){
            try{
                const menuInfo = await InputView.readMenuInfo()
                this.#checkMenuValidity(menuInfo) // 메뉴 형식이 예시와 다른지 체크 

                const menuArray = this.#convertMenuArray(menuInfo) // str to array
                const result = this.#checkMenuDuplicate(menuArray) // 중복 메뉴가 있는지 체크

                const menuList = []
                result.map(item => {
                    const menu = new Menu(item.name, item.count)
                    menuList.push(menu)
                })
                this.#checkMenuCount(menuList) // 메뉴 총합이 20 넘는지 확인
                this.#checkOnlyDrink(menuList)
                return menuList 
            }
            catch(error){
                MissionUtils.Console.print('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
            } 
        }
    }

    // '메뉴이름-개수' 형식으로 되어있는지 확인
    #checkMenuValidity(menuInfo){
        if(!menuInfo.includes('-')) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
    }

    // string으로 받은 메뉴 이름, 개수를 array로 변환
    #convertMenuArray(menuInfo){
        const result = []   
        menuInfo.split(',').forEach(pair => {
            const [menuName, count] = pair.split('-')
            this.#checkMenuUndefined(menuName, count)
            result.push({ name: menuName.trim(), count: count.trim() })
        })
        return result
    }

    // 메뉴 이름, 개수를 모두 입력했는지 확인
    #checkMenuUndefined(name, count){
        if(name===undefined || count===undefined) 
            throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
    }

    // 메뉴 20개 넘는지 확인
    #checkMenuCount(menuList){
        let totalCount = 0
        menuList.forEach(menu => {
            totalCount += menu.getCount()
        })
        if(totalCount > 20)
            throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
        return
    }

    // 메뉴 중복 여부 확인
    #checkMenuDuplicate(menuList){
        const names = menuList.map(item => item.name)
        const duplicateNames = names.filter((name, i) => names.indexOf(name) !== i)

        if(duplicateNames.length > 0) 
            throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')

        return menuList
    } 
    
    #checkOnlyDrink(menuList){
        let drinkCount = 0
        menuList.map(menu => {
            if(menu.getType() === '음료') drinkCount += 1
        })
        
        if(drinkCount === menuList.length)
            throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
    }
}

module.exports = Event