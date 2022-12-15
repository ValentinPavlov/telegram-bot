const TelegramApi = require('node-telegram-bot-api')

const token = '5809078192:AAFNVDkHVSSnT4LXvDo6FRx_gpc34-mtT6A'

const bot = new TelegramApi(token, {
    polling: true
})

const chats = {}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'},{text: '2', callback_data: '2'},{text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'},{text: '5', callback_data: '5'},{text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'},{text: '8', callback_data: '8'},{text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
}

const againGameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Играть еще раз', callback_data: '/again'}]
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю тебе число от 0 до 9. Попробуй отгадать!')
    const randomNumber = Math.floor(Math.random() *10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}


const bot_start = () => {
    bot.setMyCommands([{
            command: '/start',
            description: 'Начальное приветствие'
        },
        {
            command: '/info',
            description: 'Получить информацию'
        },
        {
            command: '/game',
            description: 'Игра в угадай число'
        }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id

        if (text === '/start') {
            await bot.sendSticker(chatId, `https://telegram.org.ru/uploads/mini/full/636/4f19fef61565c4dab2c05cc9f5820.webp`)
            return bot.sendMessage(chatId, `${msg.from.first_name}, добро пожаловать на проект Fourtune24!`)
        }


        if (text === '/info') {
            return  bot.sendMessage(chatId, `${msg.chat.username}, добро пожаловать на проект Fourtune24!`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }


        return bot.sendMessage(chatId,'Я тебя не понимаю :( Попробуй еще раз!')


    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю! Ты отгадал цифру ${chats[chatId]}`,againGameOptions)
        }
        else {
            console.log(data,chats[chatId])
            return bot.sendMessage(chatId, `К сожалению, ты не отгадал, бот загадал цифру ${chats[chatId]}`,againGameOptions)
        }
        bot.sendMessage(chatId, `Ты выбрал кнопку ${data} `)
    })
}

bot_start()