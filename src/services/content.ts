
import { join } from 'path'
import matter from 'gray-matter'
import fs from 'fs'

const baseFolder = 'content'

export interface Post {
    slug: string
    title: string
    description: string
    body: string
}

export function GetPosts() {
    const dir = join(process.cwd(), baseFolder, 'posts')
    const files = fs.readdirSync(dir, { withFileTypes: true })
        .filter(i => i.isFile() && i.name.endsWith('.md'))

    const items = files.map(i => {
        const fullPath = join(dir, i.name)
        const content = fs.readFileSync(fullPath, 'utf8')
        if (!content) {
            console.log('File has no content..', i.name)
        }

        if (content) {
            const doc = matter(content)
            return {
                ...doc.data,
                slug: i.name.replace('.md', ''),
                body: doc.content
            }
        }
    }).filter(i => !!i) as Array<Post>

    return items
}
