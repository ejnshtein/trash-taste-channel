import { envsafe, num, port, str } from 'envsafe'

export const env = envsafe({
    TELEGRAM_CHANNEL_ID: num(),
    YT_CHANNEL_ID: str(),
    SECRET_TOKEN: str(),
    PORT: port({
        devDefault: 3000
    }),
    NODE_ENV: str({
        devDefault: 'development',
        choices: ['development', 'production']
    }),
    BOT_TOKEN: str(),
    ADMIN_ID: num()
})

export const isDev = env.NODE_ENV === 'development'