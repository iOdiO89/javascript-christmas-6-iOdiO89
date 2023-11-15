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
    }

    async getMenuInfo(){
        const menuInfo = await InputView.readMenuInfo()
        try{
            this.checkMenuValidity(menuInfo) // 메뉴 형식이 예시와 다른지 체크 
            const result = this.handleMenuInfo(menuInfo) // str to array
            this.checkMenuDuplicate(result) // 중복 메뉴가 있는지 체크

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

    handleMenuInfo(menuInfo){
        const result = []   
        menuInfo.split(',').forEach(pair => {
            const [menuName, count] = pair.split('-')
            if(menuName===undefined || count===undefined) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')

            result.push({ name: menuName.trim(), count: count.trim() })
        })
        return result
    }

    checkMenuValidity(menuInfo){
        if(!menuInfo.includes('-')) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
    }

    checkMenuDuplicate(menuList){
        const names = menuList.map(item => item.name)
        const duplicateNames = names.filter((name, i) => names.indexOf(name) !== i)

        if(duplicateNames.length > 0) 
            throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
    }
}

module.exports = Event