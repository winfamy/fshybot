const { EmbedBuilder } = require("discord.js")

const buildEmbed = function(allStarsByClassAndMetric) {
  const fields = Object.keys(allStarsByClassAndMetric).map(classKey => {
    let fieldString = allStarsByClassAndMetric[classKey].map(playerAllStarEntry => `<:druid:1333503819048419328> \`${playerAllStarEntry.rank}\` ${playerAllStarEntry.name}\n`).join(' ')
    return { name: `**${classKey}**`, value: fieldString, inline: (Math.random() > .5) }
  })

  console.log(fields)
  return new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle('<Standards Rankings>')
    .setAuthor({ name: 'author name' })
    .setDescription('description')
    .addFields(fields)
}


module.exports = {
  buildEmbed
}
