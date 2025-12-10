export const metaTags = {
  title: 'Cheese Mints',
  description:
    'Cheese Mints is a decentralized achievement tracking application built on Arweave and AO',
  keywords: ['cheese', 'mints', 'ao', 'permaweb', 'arweave', 'hyperbeam', 'achievements']
}

declare const process: any

const baseMeta: any = [
  { charset: 'utf-8' },
  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1'
  },
  {
    name: 'description',
    content: metaTags.description
  }
]

export const headOptions = {
  titleTemplate: '%s | Cheese Mints',
  title: metaTags.title,
  meta: baseMeta.concat([
    { property: 'og:site_name', content: 'Cheese Mints' },
    { property: 'og:title', content: 'Cheese Mints' },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:image',
      content: 'https://stage.wuzzy.io/wuzzy-og.png'
    },

    //twitter
    { name: 'twitter:site', content: '@wuzzysearch' },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:image',
      content: 'https://stage.wuzzy.io/wuzzy-og.png'
    },
    { name: 'twitter:title', content: 'Wuzzy Search' },
    {
      name: 'twitter:description',
      content: metaTags.description
    },

    {
      name: 'keywords',
      content: metaTags.keywords
    }
  ]),
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: 'https://stage.wuzzy.io/wuzzy-favicon.png'
    }
  ]
}
