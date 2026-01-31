import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    github: z.string().optional(),
    npm: z.string().optional(),
    externalLinks: z
      .array(
        z.object({
          platform: z.enum(['qiita', 'zenn', 'note', 'dev.to', 'medium', 'hatena', 'other']),
          url: z.string().url(),
          title: z.string().optional(),
        })
      )
      .optional()
      .default([]),
  }),
})

export const collections = { blog }
