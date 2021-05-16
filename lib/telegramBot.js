const TelegramBotAPI = require('telegram-bot-api');
const { bot_token, me_id } = require('./../auth/telegramTokens');

class TelegramBot {
    constructor() {
        this.client = new TelegramBotAPI({token: bot_token});
    }

    async notifyMe(message) {
        try {
            const feedback = await this.client.sendMessage({
                chat_id: me_id, text: message, parse_mode: 'html'
            });
            const { first_name, last_name } = feedback.chat;
            console.log('[TelegramBot] message sent to', first_name, last_name);
        } catch(e) {
            console.error('Cannot send Telegram message. Try to start chat before.', e);
        }
    }
}

// export as a singleton, since we don't need many instances for the demo
module.exports = new TelegramBot();
