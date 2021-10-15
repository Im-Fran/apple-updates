// Send macOS Installers

const Discord = require("discord.js");

require('../../applesilicon/main/manager.js')();
require('../../applesilicon/embed.js')();
require('../../applesilicon/misc.js')();

let macos_public_catalog = "https://swscan.apple.com/content/catalogs/others/index-11-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog";
let macos_beta_catalog = "https://swscan.apple.com/content/catalogs/others/index-10.16beta-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog"
let macos_new_beta_catalog = "https://swscan.apple.com/content/catalogs/others/index-12seed-12-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog"; // macOS Monterey

function get_links(xml_update) {
    let links = [];
    for (let update in xml_update) {
        let pkgurl = xml_update[update]['xml_pkg'];
        let version = xml_update[update]['xml_version'];
        let build = xml_update[update]['xml_build'];
        let size = xml_update[update]['xml_size'];

        links.push(`macOS ${version} (Build ${build} - Size ${formatBytes(size)}): [InstallAssistant.pkg](${pkgurl})`)
    }
    return links;
}

module.exports = {
    name: 'latest',
    command: 'latest',
    category: 'Apple',
    usage: '`apple!latest`',
    cooldown: 60,
    description: 'Get the latest macOS Full Installer Packages.',
    async execute(message, args) {
        try {
            let pkg_beta = await get_pkg_assets(macos_beta_catalog, 'beta_pkg');
            let pkg_beta_new = await get_pkg_assets(macos_new_beta_catalog, 'beta_pkg');
            let pkg_public = await get_pkg_assets(macos_public_catalog, 'public_pkg');

            let public_array = get_links(pkg_public);
            let beta_array = get_links(pkg_beta).concat(get_links(pkg_beta_new).filter((item) => get_links(pkg_beta).indexOf(item) < 0)).filter((i) => public_array.indexOf(i) < 0);

            const embed = new Discord.MessageEmbed()
                .setTitle("macOS Full Installer Packages")
                .setDescription(`
            **Public Release Installers:**
            ${public_array.join('\n')}\n
            **Beta Release Installers:**
            ${beta_array.join('\n')}
            `
                ).setColor(randomColor())
                .setTimestamp();
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            return message.channel.send(minor_error_embed(error));
        }
    },
};
