import InputView from '../View/InputView'
import OutputView from '../View/OutputView'
import Menu from '../Model/Menu'
import { MissionUtils } from '@woowacourse/mission-utils'

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

        this.#menu = await this.getMenuInfo()

        OutputView.printPreviewMsg(this.#date)
        this.printMenu()
        this.printTotalPrice()
        OutputView.printGift(this.#totalPrice)
        this.printBenefit(this.#discount)
        OutputView.printTotalDiscount(this.#discount)
        OutputView.printFinalPrice(this.#totalPrice, this.#discount)
        OutputView.printBadge(this.#discount)
    }

    printMenu(){
        OutputView.printMenuMsg()
        this.#menu.map(menu => {
            const name = menu.getName()
            const count = menu.getCount()
            OutputView.printMenuDetail(name, count)
        })
    }

    printTotalPrice(){
        this.#menu.map(menu => {
            const count = menu.getCount()
            const price = menu.getPrice()
            this.#totalPrice += count * price
        })
        OutputView.printTotalPrice(this.#totalPrice)
    }

    printBenefit(){
        OutputView.printBenefitMsg()
        this.#discount += this.christmasDiscount()
        if(this.isWeekday())
            this.#discount += this.weekDayDiscount()
        else this.#discount += this.weekendDiscount()
        this.#discount += this.specialDiscount()
        this.#discount += this.giftDiscount()

        if(this.#discount === 0) OutputView.printMsg(`없음`)
    }

    christmasDiscount(){
        let discount = 0
        if(this.#date <= 25) {
            discount = 1000
            discount += 100 * (this.#date-1)
        }
        if(discount>0) OutputView.printMsg(`크리스마스 디데이 할인: -${discount.toLocaleString()}원`)
        return discount
    }

    weekDayDiscount(){
        let discount = 0
        this.#menu.map(menu => {
            if(menu.getType() === '디저트') discount += 2023
        })
        if(discount>0) OutputView.printMsg(`평일 할인: -${discount.toLocaleString()}원`)
        return discount
    }

    weekendDiscount(){
        let discount = 0
        this.#menu.map(menu => {
            if(menu.getType() === '메인') discount += 2023
        })
        if(discount>0) OutputView.printMsg(`주말 할인: -${discount.toLocaleString()}원`)
        return discount
    }

    isWeekday(){
        if(this.#date%7 !== 1 && this.#date%7 !== 2) return true
        return false
    }

    specialDiscount(){
        if(this.#date%7 === 3 || this.#date === 25){
            OutputView.printMsg(`특별 할인: -1,000원`)
            return 1000
        }
        return 0
    }

    giftDiscount(){
        if(this.#totalPrice > 1200000){
            OutputView.printMsg(`증정 이벤트: -25,000원`)
            return 25000
        }
        return 0
    }

    async getMenuInfo(){
        const menuInfo = await InputView.readMenuInfo()
        console.log(`주문메뉴: ${menuInfo}`)
        try{
            this.checkMenuValidity(menuInfo) // 메뉴 형식이 예시와 다른지 체크 
            const result = this.checkMenuDuplicate(menuInfo) // 중복 메뉴가 있는지 체크

            const menuList = []
            result.map(item => {
                const menu = new Menu(item.name, item.count)
                menuList.push(menu)
            })
            return menuList
        }
        catch(error){
            MissionUtils.Console.print('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
        }
    }

    checkMenuValidity(menuInfo){
        if(!menuInfo.includes('-')) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
    }

    checkMenuDuplicate(menuInfo){
        const menuList = this.handleMenuInfo(menuInfo) // str to array
        const names = menuList.map(item => item.name)
        const duplicateNames = names.filter((name, i) => names.indexOf(name) !== i)

        if(duplicateNames.length > 0) 
            throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')

        return menuList
    }    
    
    handleMenuInfo(menuInfo){
        const result = []   
        menuInfo.split(',').forEach(pair => {
            const [menuName, count] = pair.split('-')
            if(menuName===undefined || count===undefined) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')

            result.push({ name: menuName.trim(), count: count.trim() })
        })
        return result
    }
}

module.exports = Event