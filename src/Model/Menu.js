import menuInfo from '../libs/menuInfo'
import { MissionUtils } from '@woowacourse/mission-utils'

class Menu{
    #name // 메뉴 이름
    #type // 메뉴 종류 (에피타이저, 메인, 디저트, 음료 중 하나)
    #price // 메뉴 1개당 가격
    #count // 주문 개수

    constructor(name, count){
        this.#validate(name, Number(count))

        this.#name = name
        this.#count = Number(count)
        this.#getMenuInfo()
    }

    #validate(name, count){
        try{
            this.#checkMenuName(name) // 메뉴에 았던 음식을 주문했는지 확인
            this.#checkMenuCount(count) // 개수 값 유효성 확인
        }
        catch(error){
            MissionUtils.Console.print('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
        }

    }

    // 입력받은 메뉴이름을 바탕으로 가격, 종류 저장
    #getMenuInfo(){
        menuInfo.map((menu)=>{
            if(menu.name === this.#name){
                this.#price = menu.price
                this.#type = menu.type
                return
            }
        })
    }

    // 메뉴에 없는 음식을 주문했는지 확인
    #checkMenuName(name){
        let incorrectCount = 0
        menuInfo.map((menu) => {
            if(menu.name !== name) incorrectCount += 1
        })
        if(incorrectCount === menuInfo.length)
            throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
    }

    // 개수 값 유효성 확인
    #checkMenuCount(count){
        if(isNaN(count)) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
        if(!Number.isInteger(count)) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
        if(count<1) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
    }

    getName(){
        return this.#name
    }

    getCount(){
        return this.#count
    }

    getPrice(){
        return this.#price
    }

    getType(){
        return this.#type
    }
}

module.exports = Menu