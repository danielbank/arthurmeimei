import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

function renderAuthor(slug: string) {
  const author = allAuthors.find((p) => p.slug === slug) as Authors
  const mainContent = coreContent(author)
  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.body.code} />
    </AuthorLayout>
  )
}

export default function Page() {
  const authors = allAuthors

  return <>{authors.map((author) => renderAuthor(author.slug))}</>
}
