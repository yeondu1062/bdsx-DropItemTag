/* ____                 ___ _               _____           
  |  _ \ _ __ ___  _ __|_ _| |_ ___ _ __ __|_   _|_ _  __ _ 
  | | | | '__/ _ \| '_ \| || __/ _ \ '_ ` _ \| |/ _` |/ _` |
  | |_| | | | (_) | |_) | || ||  __/ | | | | | | (_| | (_| |
  |____/|_|  \___/| .__/___|\__\___|_| |_| |_|_|\__,_|\__, |
        	  |_|                                 |___/ 
    written by @yeondu1062.
*/

import { readFileSync, writeFileSync } from "fs";
import { bedrockServer } from "bdsx/launcher";
import { events } from "bdsx/event";
import { join } from "path";

const Setting = JSON.parse(readFileSync(join(__dirname, 'setting.json'), 'utf8'));

declare global {
    interface StringConstructor {
        format: (text: string, fill: {[key: string]: string}) => string
    }
}

var interval: NodeJS.Timeout

String.format = (text, fill) => {
    Object.entries(fill).forEach(value => text = text.replace('{' + value[0] + '}', value[1])); return text;
}

events.serverOpen.on(() => {
    console.log("[DropItemTag] - loaded successfully!");
    interval = setInterval(() => {
        bedrockServer.level.getEntities().forEach(itemActor => {
            if(!itemActor.isItem()) return;
            itemActor.setNameTag(String.format(Setting.tagText, {name: itemActor.itemStack.getCustomName(), amount: String(itemActor.itemStack.amount)}));
        });
    }, Setting.updateTick);
})

events.serverClose.on(() => {
	clearInterval(interval);
})

writeFileSync(process.cwd() + "/behavior_packs/vanilla_1.16.100/entities/item.json", JSON.stringify({
	"format_version": "1.16.100",
	"minecraft:entity": {
		"description": {
			"identifier": "minecraft:item"
		},
		"components": {
			"minecraft:nameable": {
				"always_show": true
			}
		}
	}
}))
