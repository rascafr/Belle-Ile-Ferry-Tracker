# Belle-Île Ferry Tracker

## Description

Got stuck with a bunch of friends on Belle-Île-en-Mer (France) because no ferry seats were available, so I developped a simple bot service that sends Telegram push notifications each time a trip is available.

It uses the REST API from www.compagnie-oceane.fr's, checks each minutes if the JSON answer has changed and sends a notification if seats are available along the whole day.

## Installation

```bash
git clone https://github.com/rascafr/Belle-Ile-Ferry-Tracker.git
cd Belle-Ile-Ferry-Tracker
npm i
```

Then, create a config file in `auth/telegramTokens.js` with the following values:

```js
module.exports = {
    bot_token: BOT_TOKEN,
    me_id: YOUR_TELEGRAM_ID
}
```

Use `@userinfobot` to get your own ID, and `@BotFather` to create the bot token.

## Usage

```bash
node service.js DATE_TRIP_SEARCH PORT_FROM PORT_TO
# or npm start
```

With:

- `DATE_TRIP_SEARCH` the timestamp for the date when you want to book a trip
- `PORT_FROM` the departure port ID (example, *Le Palais*: `2`)
- `PORT_TO` the arrival port ID (example, *Quiberon*: `1`)

For production usage, on a server, use pm2 with:

```bash
pm2 start service.js --watch --name ferry-tracker -- DATE_TRIP_SEARCH PORT_FROM PORT_TO
```

## Example notification message

```
🛳️ 🙋‍♂️ Yooo. 6 trip(s) have some seats availables!

📅 16/05/2021 06:30 ⛴️  VINDILIS Le Palais ➡️ Quiberon 💺 9
📅 16/05/2021 08:00 ⛴️  BANGOR Le Palais ➡️ Quiberon 💺 2
```