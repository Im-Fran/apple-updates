const Discord = require('discord.js');

module.exports = function () {
	this.updates_part_1 = function() {
		const part1 = new Discord.MessageEmbed()  
        .setTitle(`Software Updates - Updates Setup Part 1`)
        .setColor("#00d768")
        .setDescription(`\n**Please mention the channel that you want me to send new Apple updates to.** \n *If you don't respond to this message within 3 minutes, the command will time out.*`);
    return { embeds: [part1] };
	}

	this.updates_part_2 = function(selected_channel, selected_options) {
	    const part2 = new Discord.MessageEmbed()
	        .setTitle(`Software Updates - Updates Setup Part 2`)
	        .setDescription(`\n ** React to receive updates notifications to <#${selected_channel.id}>.**
	                *If you don't react to this message within 1 minute, the command will time out. Your options will be recorded automatically after 1 minute.*`)
	        .setColor("#00d768")
	        .addField(`OS Updates`, `\n
	                <:iphone:852824816092315678> iOS Updates
	                <:ipad:852824860089516033> iPadOS Updates
	                <:macbook:852826607286878228> macOS Updates\n`, true)
	        .addField(`OS Updates`, `\n
	        		<:apple_watch:852824628921499688> watchOS Updates
	                <:homepod:852824690166333440> audioOS Updates
	                <:apple_tv:852826560725778442> tvOS Updates\n`, true)
	        .addField(`Package Links`, `\n
	                <:installassistant:852824497202659348> macOS InstallAssistant.pkg Links\n`, true)
	        .addField(`Bot Updates`, `\n
	                <:software_updates:852825269705113610> <@${global.bot.user.id}>'s new features and bug fixes announcements\n`)
	        .addField("Selected Options", selected_options + ".");
	    return { embeds: [part2] };
	}

	this.updates_overall = function(selected_channel, selected_options) {
		const overall = new Discord.MessageEmbed()
		    .setTitle(`Software Updates - Setup Overview`)
		    .setDescription(`**Your setup data has been saved successfully!**
		    Join the Unsupported Macs Discord Server: https://discord.gg/XbbWAsE`)
		    .addField(`Selected channel`, selected_channel, true)
		    .addField(`Selected updates`, selected_options + ".", true)
		    .setColor("#1c95e0")
		    .setTimestamp();
		return { embeds: [overall] };
	}


	this.roles_part_1 = function () {
		const embed = new Discord.MessageEmbed()   
		    .setTitle(`Software Updates - Notification Roles Setup Part 1`)
		    .setColor("#00d768")
		    .setDescription(`\n**Please reply with an OS name that you would like to get ping notifications for.**
		    - \`ios\` : iOS Updates
		    - \`ipados\` : iPadOS Updates
		    - \`watchos\` : watchOS Updates
		    - \`audioos\` : audioOS Updates
		    - \`tvos\` : tvOS Updates
		    - \`macos\` : macOS Updates
		    - \`pkg\` : macOS InstallAssistant.pkg Links
		    - \`bot\` : <@${global.bot.user.id}>'s new feature and bug fixes announcements\n
		    *If you don't respond to this message within 3 minutes, the command will time out.*`);
		return { embeds: [embed] };
	}

	this.roles_part_2 = function (os) {
	    const embed = new Discord.MessageEmbed()      
	        .setTitle(`Software Updates - Notification Roles Setup Part 2`)
	        .setColor("#00d768")
	        .setDescription(`\n**Please mention the role that you would like me to ping when a new ${os} is available.** \n *If you don't respond to this message within 3 minutes, the command will time out.*`);
	    return { embeds: [embed] };
	}

	this.roles_overall = function (selected_role, selected_update, option) {
	    choice = (option) ? "will ping" : "will no longer ping";
	    const overall = new Discord.MessageEmbed()       
	        .setTitle(`Software Updates - Setup Overview`)
	        .setColor("#1c95e0")
	        .setDescription(`**Your setup data has been saved successfully!**
	        From now on, I ${choice} ${selected_role} when a new ${selected_update} is available!`)
	        .setTimestamp();
	    return { embeds: [overall] };
	}

	this.roles_remove = function (roles) {
	    const embed = new Discord.MessageEmbed()    
	        .setTitle(`Software Updates - Notification Roles Removal`)
	        .setColor("#00d768")
	        .setDescription(`\n**Please reply with an OS name that you would like to remove ping notifications for.**
	        Your server has these notification roles configured: 
	        - ${roles.join(`\n - `)}
	        *If you don't respond to this message within 3 minutes, the command will time out.*`);
	    return { embeds: [embed] };
	}

	this.roles_list = function (roles) {
	    const embed = new Discord.MessageEmbed()      
	        .setTitle(`Software Updates - Configured Notification Roles`)
	        .setColor("#00d768")
	        .setDescription(`\n**Your server has these notification roles configured:**
	        - ${roles.join(`\n - `)}`);
	    return { embeds: [embed] };
	}

	this.error_embed = function(content) {
	    const error = new Discord.MessageEmbed()
	        .setTitle("An issue has occured!")
	        .setColor("#c2002a")
	        .setDescription(`${content} \n\n *Please try again later. \n If you need help, join our support server: https://discord.gg/ktHmcbpMNU*`);
	    return { embeds: [error] };
	}
}