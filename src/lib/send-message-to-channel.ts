import { bot } from "../telegram"
import { env } from "./env"
import { notifyAdmin } from "./notify-admin"

export const sendMessageToChannel = async (
  video: { id: string; title: string }
): Promise<void> => {
  const response = await bot.api.sendMessage(
    env.TELEGRAM_CHANNEL_ID,
    `<b>${video.title}</b>\n\n<a href="https://youtu.be/${video.id}">youtu.be/${video.id}</a>`,
    {
      parse_mode: 'HTML',
      link_preview_options: {
        is_disabled: false,
        url: `https://youtu.be/${video.id}`
      }
    }
  )
  await notifyAdmin(video, response)
}
