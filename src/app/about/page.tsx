import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from '@/app/seo'

export const metadata = genPageMetadata({ title: 'About' })

function renderAuthor(slug: string) {
  const author = allAuthors.find((p) => p.slug === slug) as Authors
  const mainContent = coreContent(author)
  return (
    <AuthorLayout content={mainContent} key={author.slug}>
      <MDXLayoutRenderer code={author.body.code} />
    </AuthorLayout>
  )
}

export default function Page() {
  const authors = allAuthors

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
        About the Authors
      </h1>
      {authors.map((author) => renderAuthor(author.slug))}
    </div>
  )
}
