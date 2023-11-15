import menuInfo from '../libs/menuInfo'

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
        this.#checkMenuName(name)
        this.#checkMenuCount(count)
    }

    #getMenuInfo(){
        menuInfo.map((menu)=>{
            if(menu.name === this.#name){
                this.#price = menu.price
                this.#type = menu.type
                return
            }
        })
    }

    #checkMenuName(name){
        menuInfo.map((menu) => {
            if(menu.name === name) return
        })

        throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
    }

    #checkMenuCount(count){
        const number = Number(count)

        if(isNaN(number)) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
        if(!Number.isInteger(number)) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
        if(number<1) throw new Error('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
    }
}

module.exports = Menu