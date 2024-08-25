import { marked } from "marked"
import { GetPosts, Post } from "@/services/content"
import { SITE_NAME, SITE_URL, SOCIAL_TWITTER } from "@/utils/site"
import Link from "next/link"

interface Params {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Params) {
  const posts = GetPosts()
  const post = posts.find((i: Post) => i.slug === params.slug)
  if (!post) return {}

  return {
    applicationName: `${post.title} | ${SITE_NAME}`,
    title: `${post.title} | ${SITE_NAME}`,
    metadataBase: new URL(SITE_URL),
    description: post.description,
    openGraph: {
      type: "website",
      title: `${post.title} | ${SITE_NAME}`,
      siteName: SITE_NAME,
      description: post.description,
      url: SITE_URL,
      images: "/opengraph-image",
    },
    twitter: {
      card: "summary_large_image",
      site: SOCIAL_TWITTER,
      title: `${post.title} | ${SITE_NAME}`,
      description: post.description,
      images: "/opengraph-image",
    },
  }
}

export default async function BlogPost({ params }: Params) {
  const posts = GetPosts()
  const post = posts.find((i: Post) => i.slug === params.slug)

  if (!post) return <div>404</div>

  return (
    <div className='flex flex-col gap-2 mb-12'>
      <h1 className='text-2xl font-bold'>{post.title}</h1>
      <p>
        <Link href='/resources' className="text-accent">← Back to overview</Link>
      </p>

      <div className='prose max-w-[1200px] w-11/12 md:w-full'>
        <div dangerouslySetInnerHTML={{ __html: marked.parse(post.body) as string }} />
      </div>
    </div>
  )
}
