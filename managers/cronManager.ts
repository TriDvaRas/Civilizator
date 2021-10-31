import cron from 'node-cron'
import { nextPresence } from './presenceManager'
import { submitStats } from './statsManager'

export function initCrons() {
    const activeCrons = process.env.CRONS?.split(`,`) || []
    // save daily stats 
    if (activeCrons.includes(`stats`))
        cron.schedule('59 23 * * *', submitStats)
    // update pressence 
    if (activeCrons.includes(`presences`))
        cron.schedule('*/10 * * * * *', nextPresence)
    log.info(`InitCrons done [${activeCrons.join(` `)}]`)
}