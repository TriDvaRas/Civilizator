import { Snowflake, ThreadChannel } from "discord.js";

export async function findGameMessage(threadId: Snowflake, messageId: Snowflake,) {
    const thread: ThreadChannel = client.channels.cache.get(threadId) as ThreadChannel
    const gameMessage = thread.messages.cache.get(messageId)
    if (gameMessage)
        return gameMessage
    await thread.messages.fetch()
}