import { MissionUtils } from '@woowacourse/mission-utils'

const InputView = {
    async readDate() {
        try{
            const input = await MissionUtils.Console.readLineAsync("12월 중 식당 예상 방문 날짜는 언제인가요? (숫자만 입력해 주세요!)")

            const date = Number(input)
            this.checkIsNumber(date)
            this.checkIsInteger(date)
            this.checkDateRange(date)
    
            return date
        }
        catch(error){
            MissionUtils.Console.print('[ERROR] 유효하지 않은 날짜입니다. 다시 입력해 주세요.')
        }

    },

    checkIsNumber(number){
        if (isNaN(number)) 
            throw new Error('[ERROR] 유효하지 않은 날짜입니다. 다시 입력해 주세요.')
    },

    checkIsInteger(number){
        if(!Number.isInteger(number))
            throw new Error('[ERROR] 유효하지 않은 날짜입니다. 다시 입력해 주세요.')
    },

    checkDateRange(date){
        if(date<1 || date>31) 
            throw new Error('[ERROR] 유효하지 않은 날짜입니다. 다시 입력해 주세요.')
    }
}

export default InputView;