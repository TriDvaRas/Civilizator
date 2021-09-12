import { Interaction } from "discord.js";
import buttonHandler from "./buttonHandler";
import slashCommandHandler from "./slashCommandHandler";

export default async function interactionHandler(interaction: Interaction): Promise<void> {
    if (interaction.isCommand()) {
        
        await slashCommandHandler(interaction)
    }
    else if (interaction.isButton()) {

        await buttonHandler(interaction)
    }
    else
        log.warn(`Unknown interaction`);

}