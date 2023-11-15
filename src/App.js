import Event from './Controller/Event'

const event = new Event()

class App {
    async run() {
        await event.runEvent()
    }
}

export default App;
