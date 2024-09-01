import RssParser from 'rss-parser'

export const parser = new RssParser({
  customFields: {
    item: [
      'description',
      'guid',
      'author',
      'name',
      'updated',
      'yt:videoId',
      'yt:channelId',
      'media:group',
      'media:title',
      'media:content',
      'media:thumbnail',
      'media:description',
      'media:community',
      'media:starRating',
      'media:statistics'
    ]
  }
})
