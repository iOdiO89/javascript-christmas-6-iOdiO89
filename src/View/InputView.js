import { MissionUtils } from '@woowacourse/mission-utils'

const InputView = {
    async readDate() {
        while(true){
            try{
                const input = await MissionUtils.Console.readLineAsync("12월 중 식당 예상 방문 날짜는 언제인가요? (숫자만 입력해 주세요!)")
                console.log(`날짜 : ${input}`)
                const date = Number(input)
                this.checkIsNumber(date)
                this.checkIsInteger(date)
                this.checkDateRange(date)
        
                return date
            }
            catch(error){
                MissionUtils.Console.print('[ERROR] 유효하지 않은 날짜입니다. 다시 입력해 주세요.')
            }
        }

    },

    async readMenuInfo(){
        try{
            const input = await MissionUtils.Console.readLineAsync("주문하실 메뉴를 메뉴와 개수를 알려 주세요. (e.g. 해산물파스타-2,레드와인-1,초코케이크-1)")
            return input
        }
        catch(error){
            MissionUtils.Console.print('[ERROR] 유효하지 않은 주문입니다. 다시 입력해 주세요.')
        }
    },

    checkIsNumber(number){
        if (isNaN(number)) 
            throw new Error('[ERROR] 유효하지 않은 날짜입니다. 다시 입력해 주세요.')
    },

    checkIsInteger(number){
        if(!Number.isInteger(number))
            throw new Error('[ERROR] 3유효하지 않은 날짜입니다. 다시 입력해 주세요.')
    },

    checkDateRange(date){
        if(date<1 || date>31) 
            throw new Error('[ERROR] 4유효하지 않은 날짜입니다. 다시 입력해 주세요.')
    }
}

export default InputView;