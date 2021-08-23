import { Message, Snowflake, ThreadChannel } from "discord.js";

export async function findGameMessage(threadId: Snowflake, messageId: Snowflake,) {
    const thread: ThreadChannel = client.channels.cache.get(threadId) as ThreadChannel
    return await thread.messages.fetch(messageId)
}
export async function findPickMessages(threadId: Snowflake, messageIds: Snowflake[],) {
    const thread: ThreadChannel = client.channels.cache.get(threadId) as ThreadChannel

    return await Promise.all(messageIds.map(async (messageId: Snowflake) => {
        return new Promise<Message | null>((resolve, reject) => {
            thread.messages.fetch(messageId).then(resolve).catch(() => resolve(null))
        })
    }))
}