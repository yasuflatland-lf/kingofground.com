import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ID を「拡張子を除いた相対パス」にそろえる（既定の slug 化で文字が変わらないようにする）
const stripExtension = ({ entry }: { entry: string }) => entry.replace(/\.[^.]+$/, '');

const blogs = defineCollection({
  loader: glob({ base: './src/content/blogs', pattern: '**/*.md', generateId: stripExtension }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

const results = defineCollection({
  loader: glob({ base: './src/content/results', pattern: '**/*.md', generateId: stripExtension }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    venue: z.string().optional(),
    classes: z
      .array(
        z.object({
          name: z.string(),
          placements: z
            .array(z.object({ rank: z.number().int().positive(), rider: z.string() }))
            .min(1),
        }),
      )
      .min(1),
  }),
});

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.md', generateId: stripExtension }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().default(0),
  }),
});

const localized = z.object({ ja: z.string(), en: z.string() });

const guideCategories = defineCollection({
  loader: glob({
    base: './src/content/guide-categories',
    pattern: '*.yaml',
    generateId: stripExtension,
  }),
  schema: z.object({ order: z.number().int(), title: localized, description: localized }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md', generateId: stripExtension }),
  schema: z.object({ title: z.string(), description: z.string() }),
});

export const collections = { blogs, results, guides, guideCategories, pages };
