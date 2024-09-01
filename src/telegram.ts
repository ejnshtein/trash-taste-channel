import { Bot } from 'grammy'
import { env } from './lib/env'

export const bot = new Bot(env.BOT_TOKEN)
