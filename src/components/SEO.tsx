// src/components/seo.js

import Head from 'next/head';

export default function SEO({
  description,
  title,
  siteTitle,
  twitter,
  keywords,
}: {
  description?: string,
  title?: string,
  siteTitle?: string,
  twitter?: string,
  keywords?: string,
}) {
  return (
    <Head>
      <title>{`${title} | ${keywords}`}</title>
      <meta name='description' content={description} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content={title} />
      <meta property='twitter:card' content='summary' />
      <meta property='twitter:creator' content={twitter} />
      <meta property='twitter:title' content={title} />
      <meta property='twitter:description' content={description} />
      <meta
        name='viewport'
        content='initial-scale=1.0, width=device-width'
        key='viewport'
      />
      <meta name='keywords' content={keywords} />
    </Head>
  );
}
