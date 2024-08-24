import { GetPosts } from "@/services/content";
import { SITE_NAME, SITE_URL, SOCIAL_TWITTER } from "@/utils/site";
import Link from "next/link";

const title = `Learn | ${SITE_NAME}`;
const description =
  "Learn more about how gas works, why it matters and help you set optimal gas fees to use the Ethereum network more efficiently.";

export async function generateMetadata() {
  return {
    applicationName: title,
    title: title,
    metadataBase: new URL(SITE_URL),
    description: description,
    openGraph: {
      type: "website",
      title: title,
      siteName: SITE_NAME,
      description: description,
      url: SITE_URL,
      images: "/opengraph-image",
    },
    twitter: {
      card: "summary_large_image",
      site: SOCIAL_TWITTER,
      title: title,
      description: description,
      images: "/opengraph-image",
    },
  };
}

export default async function Page() {
  const posts = GetPosts()

  return (
      <div className="grid gap-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/learn/${post.slug}`}>
            <article className='flex rounded-xl bg-base-300 p-4'>
                <div className='w-full'>
                    <h2 className='text-xl font-bold mt-2'>{post.title}</h2>
                    <p className='flex flex-row items-center gap-1 text-sm mt-4'>{post.description}</p>
                </div>
            </article>
          </Link>
        ))}
    </div>
  );
}
