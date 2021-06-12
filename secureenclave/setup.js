const Discord = require('discord.js');
const firebase = require("firebase-admin");
const db = firebase.firestore();

const ios_database = db.collection('discord').doc('ios');
const ipados_database = db.collection('discord').doc('ipados');
const watchos_database = db.collection('discord').doc('watchos');
const tvos_database = db.collection('discord').doc('tvos');
const audioos_database = db.collection('discord').doc('audioos');
const macos_database = db.collection('discord').doc('macos');
const pkg_database = db.collection('discord').doc('pkg');
const delta_database = db.collection('discord').doc('delta');
const bot_database = db.collection('discord').doc('bot');

// ================ UPDATES CHANNEL SETUP ===================

function part1embed() {
    const part1 = new Discord.MessageEmbed()
        .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
        .setTitle(`Software Updates - Updates Setup Part 1`)
        .setColor("#00af00")
        .setDescription(`\n**Please mention the channel that you want me to send new Apple updates to.** \n *If you don't respond to this message within 3 minutes, the command will time out.*`);
    return part1;
}

function part2embed(selected_channel, selected_options) {
    const part2 = new Discord.MessageEmbed()
        .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
        .setTitle(`Software Updates - Updates Setup Part 2`)
        .setDescription(`\n ** React to receive updates notifications to <#${selected_channel.id}>.**
                *If you don't react to this message within 3 minutes, the command will time out. Your options will be recorded automatically after 1 minute.*`)
        .setColor("#00af00")
        .addField(`OS Updates`, `\n
                <:iphone:852824816092315678> iOS Updates
                <:ipad:852824860089516033> iPadOS Updates
                <:apple_watch:852824628921499688> watchOS Updates
                <:homepod:852824690166333440> audioOS Updates
                <:apple_tv:852826560725778442> tvOS Updates
                <:macbook:852826607286878228> macOS Updates\n`, true)
        .addField(`Package Links`, `\n
                <:installassistant:852824497202659348> macOS InstallAssistant.pkg Links
                <:delta:852825130610065418> macOS Delta Updates Links\n`, true)
        .addField(`Bot Updates`, `\n
                <:software_updates:852825269705113610> New features and bug fixes announcements\n`,)
        .addField("Selected Options", selected_options + ".");
    return part2;
}

function errorembed(content) {
    const error = new Discord.MessageEmbed()
        .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
        .setTitle("An issue has occured!")
        .setColor("#c2002a")
        .setDescription(`${content} \n\n *Please try again later. \n If you need help, join our support server: https://discord.gg/ktHmcbpMNU*`);
    return error;
}

function overall_embed(selected_channel, selected_options) {
    const overall = new Discord.MessageEmbed()
        .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
        .setTitle(`Software Updates - Setup Overview`)
        .setDescription(`**Your setup data has been saved successfully!**
        Join the Unsupported Macs Discord Server: https://discord.gg/XbbWAsE`)
        .addField(`Selected channel`, selected_channel, true)
        .addField(`Selected updates`, selected_options + ".", true)
        .setColor("#234470")
        .setTimestamp();
    return overall;
}

async function run_setup_updates(message, args) {

    var msg = await message.channel.send(part1embed());

    const reply = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 })

    if (!reply.size) return message.channel.send(errorembed("You did not reply within 3 minutes so the command was cancelled."));
    if (!reply.first().content.match(/^<#!?(\d+)>$/)) return message.channel.send(errorembed("I may not have the necessary permissions to fetch the channel or I was unable to read your message."));
    let selected_channel = global.bot.channels.cache.get(reply.first().content.match(/^<#!?(\d+)>$/)[1]);
    if (selected_channel == undefined) return message.channel.send(errorembed("I may not have the necessary permissions to fetch the channel or the chosen channel does not exist."));
    await reply.first().delete();

    await msg.edit(part2embed(selected_channel, "Your selected options will appear here."));
    let warning = await message.channel.send("**PLEASE WAIT FOR THE REACTIONS TO FULLY-LOAD BEFORE YOU CAN REACT TO THE MESSAGE OR YOUR OPTIONS WON'T BE RECORDED.**")

    let options = [];

    await msg.react("852824816092315678");
    await msg.react("852824860089516033");
    await msg.react("852824628921499688");
    await msg.react("852824690166333440");
    await msg.react("852826560725778442");
    await msg.react("852826607286878228");
    await msg.react("852824497202659348");
    await msg.react("852825130610065418");
    await msg.react("852825269705113610");

    const filter = (reaction, user) => user.id == message.author.id;

    var collector = msg.createReactionCollector(filter, {
        time: 60000,
        dispose: true
    });

    collector.on("collect", async (reaction, user) => {
        if (warning != undefined) {
            warning.delete();
            warning = undefined;
        }
        switch (reaction.emoji.id) {
            case "852824816092315678":
                options.push(" iOS Updates")
                msg.edit(part2embed(selected_channel, options.join()));
                break;
            case "852824860089516033":
                options.push(" iPadOS Updates")
                msg.edit(part2embed(selected_channel, options.join()));
                break;
            case "852824628921499688":
                options.push(" watchOS Updates")
                msg.edit(part2embed(selected_channel, options.join()));
                break;
            case "852824690166333440":
                options.push(" audioOS Updates")
                msg.edit(part2embed(selected_channel, options.join()));
                break;
            case "852826560725778442":
                options.push(" tvOS Updates")
                msg.edit(part2embed(selected_channel, options.join()));
                break;
            case "852826607286878228":
                options.push(" macOS Updates")
                msg.edit(part2embed(selected_channel, options.join()));
                break;
            case "852824497202659348":
                options.push(" macOS InstallAssistant.pkg Links")
                msg.edit(part2embed(selected_channel, options.join()));
                break;
            case "852825130610065418":
                options.push(" macOS Delta Update Links")
                msg.edit(part2embed(selected_channel, options.join()));
                break;
            case "852825269705113610":
                options.push(" Bot Updates")
                msg.edit(part2embed(selected_channel, options.join()));
                break;
            default:
                break;
        }
    });

    collector.on("remove", async (reaction, user) => {
        switch (reaction.emoji.id) {
            case "852824816092315678":
                if (options.includes(" iOS Updates")) options.splice(options.indexOf(" iOS Updates"), 1);
                (options.join()) ? msg.edit(part2embed(selected_channel, options.join())) : msg.edit(part2embed(selected_channel, "Your selected options will appear here."));
                break;
            case "852824860089516033":
                if (options.includes(" iPadOS Updates")) options.splice(options.indexOf(" iPadOS Updates"), 1);
                (options.join()) ? msg.edit(part2embed(selected_channel, options.join())) : msg.edit(part2embed(selected_channel, "Your selected options will appear here."));
                break;
            case "852824628921499688":
                if (options.includes(" watchOS Updates")) options.splice(options.indexOf(" watchOS Updates"), 1);
                (options.join()) ? msg.edit(part2embed(selected_channel, options.join())) : msg.edit(part2embed(selected_channel, "Your selected options will appear here."));
                break;
            case "852824690166333440":
                if (options.includes(" audioOS Updates")) options.splice(options.indexOf(" audioOS Updates"), 1);
                (options.join()) ? msg.edit(part2embed(selected_channel, options.join())) : msg.edit(part2embed(selected_channel, "Your selected options will appear here."));
                break;
            case "852826560725778442":
                if (options.includes(" tvOS Updates")) options.splice(options.indexOf(" tvOS Updates"), 1);
                (options.join()) ? msg.edit(part2embed(selected_channel, options.join())) : msg.edit(part2embed(selected_channel, "Your selected options will appear here."));
                break;
            case "852826607286878228":
                if (options.includes(" macOS Updates")) options.splice(options.indexOf(" macOS Updates"), 1);
                (options.join()) ? msg.edit(part2embed(selected_channel, options.join())) : msg.edit(part2embed(selected_channel, "Your selected options will appear here."));
                break;
            case "852824497202659348":
                if (options.includes(" macOS InstallAssistant.pkg Links")) options.splice(options.indexOf(" macOS InstallAssistant.pkg Links"), 1);
                (options.join()) ? msg.edit(part2embed(selected_channel, options.join())) : msg.edit(part2embed(selected_channel, "Your selected options will appear here."));
                break;
            case "852825130610065418":
                if (options.includes(" macOS Delta Update Links")) options.splice(options.indexOf(" macOS Delta Update Links"), 1);
                (options.join()) ? msg.edit(part2embed(selected_channel, options.join())) : msg.edit(part2embed(selected_channel, "Your selected options will appear here."));
                break;
            case "852825269705113610":
                if (options.includes(" Bot Updates")) options.splice(options.indexOf(" Bot Updates"), 1);
                (options.join()) ? msg.edit(part2embed(selected_channel, options.join())) : msg.edit(part2embed(selected_channel, "Your selected options will appear here."));
                break;
            default:
                break;
        }
    });

    collector.on('end', async collected => {
        if (warning != undefined) warning.delete();
        if (options.length < 1) return message.channel.send(errorembed("You did not react to the message within 3 minutes so the command was cancelled."));

        (options.includes(" Bot Updates")) ? await bot_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }) : await bot_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });
        (options.includes(" iOS Updates")) ? await ios_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }) : await ios_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });
        (options.includes(" iPadOS Updates")) ? await ipados_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }) : await ipados_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });
        (options.includes(" watchOS Updates")) ? await watchos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }) : await watchos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });
        (options.includes(" audioOS Updates")) ? await audioos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }) : await audioos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });
        (options.includes(" macOS Updates")) ? await macos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }) : await macos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });
        (options.includes(" tvOS Updates")) ? await tvos_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }) : await tvos_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });
        (options.includes(" macOS InstallAssistant.pkg Links")) ? await pkg_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }) : await pkg_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });
        (options.includes(" macOS Delta Update Links")) ? await delta_database.update({ [`${selected_channel.guild.id}`]: `${selected_channel.id}` }) : await delta_database.update({ [`${selected_channel.guild.id}`]: firebase.firestore.FieldValue.delete() });

        if (msg != undefined) msg.delete();
            message.channel.send(overall_embed(`<#${selected_channel.id}>`, options.join()));
            return message.channel.send("Join our support server: https://discord.gg/ktHmcbpMNU")
    });
}

exports.run = async (message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(errorembed("You do not have the \"MANAGE SERVER\" permission to use this command!"));
    if (!message.guild.me.hasPermission(["VIEW_CHANNEL", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES"])) {
        return message.channel.send(errorembed("I do not have the necessary permissions to work properly! \n\n ***Please make sure I have the following permissions:*** \n- View Channels\n- Add Reactions\n- Use External Emojis\n- Manage Messages"));
    }

    run_setup_updates(message, args);
}

/* // ================ PING ROLES SETUP ===================

function part1embed_roles() {
    const part1 = new Discord.MessageEmbed()
        .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
        .setTitle(`Software Updates - Ping Roles Setup Part 1`)
        .setDescription(`\n ** React to set up a ping role for an OS.**
                *If you don't react to this message within 3 minutes, the command will time out. Your options will be recorded automatically after 1 minute.*`)
        .addField(`OS Updates`, `\n
                <:iphone:852824816092315678> iOS Updates
                <:ipad:852824860089516033> iPadOS Updates
                <:apple_watch:852824628921499688> watchOS Updates
                <:homepod:852824690166333440> audioOS Updates
                <:apple_tv:852826560725778442> tvOS Updates
                <:mac:852826607286878228> macOS Updates\n`, true)
        .addField(`Other Updates`, `\n
                <:installassistant:852824497202659348> macOS InstallAssistant.pkg Links
                <:delta_update:852825130610065418> macOS Delta Updates Links\n`, true);
    return part1;
}

function part2embed_roles(os) {
    const part2 = new Discord.MessageEmbed()
        .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
        .setTitle(`Software Updates - Ping Roles Setup Part 2`)
        .setDescription(`\n**Please mention the role that you want me to ping when a new ${os} is available.** \n *If you don't respond to this message within 3 minutes, the command will time out.*`);
    return part2;
}

function overall_embed_role(selected_role, selected_update) {
    const overall = new Discord.MessageEmbed()
        .setAuthor(`Unsupported Macs`, `https://i.imgur.com/5JatAyq.png`)
        .setTitle(`Software Updates - Setup Overview`)
        .setDescription(`**Your setup data has been saved successfully!**
        From now on, I will ping ${selected_role} when a new ${selected_update} is available!`)
        .setTimestamp();
    return overall;
}

async function run_setup_roles(message, args) {
    var msg = await message.channel.send(part1embed_roles("Your selected options will appear here."));
    let warning = await message.channel.send("**PLEASE WAIT FOR THE REACTIONS TO FULLY-LOAD BEFORE YOU CAN REACT TO THE MESSAGE OR YOUR OPTIONS WON'T BE RECORDED.**")

    await msg.react("852824816092315678");
    await msg.react("852824860089516033");
    await msg.react("852824628921499688");
    await msg.react("852824690166333440");
    await msg.react("852826560725778442");
    await msg.react("852826607286878228");
    await msg.react("852824497202659348");
    await msg.react("852825130610065418");

    const filter = (reaction, user) => user.id !== message.client.user.id;

    var collector = msg.createReactionCollector(filter, {
        time: 60000,
        dispose: true
    });

    const options = [];

    collector.on("collect", async (reaction, user) => {
        if (warning != undefined) {
            warning.delete();
            warning = undefined;
        }
        switch (reaction.emoji.id) {
            case "852824816092315678":
                options.push("ios");

                await message.channel.send(part2embed_roles("iOS Update"));
                var reply = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 })
                if (!reply.size) return message.channel.send(errorembed("You did not reply within 3 minutes so the command was cancelled."));
                if (!reply.first().content.match(/^<@&!?(\d+)>$/)) return message.channel.send(errorembed("It's either I am missing permissions to fetch the channel, or I am unable to read your message."));
                collector.stop();

                await message.channel.send(overall_embed_role(`<@&${reply.first().content.match(/^<@&!?(\d+)>$/)[1]}>`, "iOS Update"));
                break;
            case "852824860089516033":
                await message.channel.send(part2embed_roles("iPadOS Update"));
                var reply = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 })
                if (!reply.size) return message.channel.send(errorembed("You did not reply within 3 minutes so the command was cancelled."));
                if (!reply.first().content.match(/^<@&!?(\d+)>$/)) return message.channel.send(errorembed("It's either I am missing permissions to fetch the channel, or I am unable to read your message."));
                collector.stop();
                await message.channel.send(overall_embed_role(`<@&${reply.first().content.match(/^<@&!?(\d+)>$/)[1]}>`, "iPadOS Update"));
                break;
            case "852824628921499688":
                await message.channel.send(part2embed_roles("watchOS Update"));
                var reply = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 })
                if (!reply.size) return message.channel.send(errorembed("You did not reply within 3 minutes so the command was cancelled."));
                if (!reply.first().content.match(/^<@&!?(\d+)>$/)) return message.channel.send(errorembed("It's either I am missing permissions to fetch the channel, or I am unable to read your message."));
                collector.stop();
                await message.channel.send(overall_embed_role(`<@&${reply.first().content.match(/^<@&!?(\d+)>$/)[1]}>`, "watchOS Update"));
                break;
            case "852824690166333440":
                await message.channel.send(part2embed_roles("audioOS Update"));
                var reply = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 })
                if (!reply.size) return message.channel.send(errorembed("You did not reply within 3 minutes so the command was cancelled."));
                if (!reply.first().content.match(/^<@&!?(\d+)>$/)) return message.channel.send(errorembed("It's either I am missing permissions to fetch the channel, or I am unable to read your message."));
                collector.stop();
                await message.channel.send(overall_embed_role(`<@&${reply.first().content.match(/^<@&!?(\d+)>$/)[1]}>`, "audioOS Update"));
                break;
            case "852826560725778442":
                await message.channel.send(part2embed_roles("tvOS Update"));
                var reply = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 })
                if (!reply.size) return message.channel.send(errorembed("You did not reply within 3 minutes so the command was cancelled."));
                if (!reply.first().content.match(/^<@&!?(\d+)>$/)) return message.channel.send(errorembed("It's either I am missing permissions to fetch the channel, or I am unable to read your message."));
                collector.stop();
                await message.channel.send(overall_embed_role(`<@&${reply.first().content.match(/^<@&!?(\d+)>$/)[1]}>`, "tvOS Update"));
                break;
            case "852826607286878228":
                await message.channel.send(part2embed_roles("macOS Update"));
                var reply = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 })
                if (!reply.size) return message.channel.send(errorembed("You did not reply within 3 minutes so the command was cancelled."));
                if (!reply.first().content.match(/^<@&!?(\d+)>$/)) return message.channel.send(errorembed("It's either I am missing permissions to fetch the channel, or I am unable to read your message."));
                collector.stop();
                await message.channel.send(overall_embed_role(`<@&${reply.first().content.match(/^<@&!?(\d+)>$/)[1]}>`, "macOS Update"));
                break;
            case "852824497202659348":
                await message.channel.send(part2embed_roles("macOS InstallAssistant.pkg Link"));
                var reply = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 })
                if (!reply.size) return message.channel.send(errorembed("You did not reply within 3 minutes so the command was cancelled."));
                if (!reply.first().content.match(/^<@&!?(\d+)>$/)) return message.channel.send(errorembed("It's either I am missing permissions to fetch the channel, or I am unable to read your message."));
                collector.stop();
                await message.channel.send(overall_embed_role(`<@&${reply.first().content.match(/^<@&!?(\d+)>$/)[1]}>`, "macOS InstallAssistant.pkg Link"));
                break;
            case "852825130610065418":
                await message.channel.send(part2embed_roles("macOS Delta Updates Link"));
                var reply = await message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 180000 })
                if (!reply.size) return message.channel.send(errorembed("You did not reply within 3 minutes so the command was cancelled."));
                if (!reply.first().content.match(/^<@&!?(\d+)>$/)) return message.channel.send(errorembed("It's either I am missing permissions to fetch the channel, or I am unable to read your message."));
                collector.stop();
                await message.channel.send(overall_embed_role(`<@&${reply.first().content.match(/^<@&!?(\d+)>$/)[1]}>`, "macOS Delta Updates Link"));
                break;
            default:
                break;
        }
    });
} */