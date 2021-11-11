import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameSetButtons, getSettingsButtons } from "../managers/buttonManager";
import { createGameSetEmbed, createSettingsEmbed } from "../managers/embedManager";
import { AliasLanguages, IFullGame, IGuild } from "../types/api";
import { IGuildUpdateArgs } from "../types/apiReqs";

export default {
    customId: 'settings-locales-toggle',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const guildConfig = await api.get(`/guild/${interaction.guild?.id}`) as IGuild
        const newLocales = guildConfig.locales.includes(args[0] as AliasLanguages) ? guildConfig.locales.filter(x => x !== args[0]) : [...guildConfig.locales, args[0] as AliasLanguages]
        const newGuildConfig = await api.patch(`/guild/${interaction.guild?.id}`, {
            locales: newLocales
        } as IGuildUpdateArgs) as IGuild
        await interaction.update({ embeds: [createSettingsEmbed(newGuildConfig, 'locale')], components: getSettingsButtons(newGuildConfig, 'locale') })
    }
}