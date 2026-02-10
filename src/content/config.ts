import { defineCollection, z } from 'astro:content';

const conteudos = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.enum(['hardware', 'software', 'networking', 'diagnostics']),
        tags: z.array(z.string()),
        publishDate: z.date(),
        updatedDate: z.date().optional(),
        author: z.string().default('Technician'),
    }),
});

const noticias = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        source: z.string(), // RSS Source Name
        sourceUrl: z.string().url(),
        pubDate: z.date(),
        category: z.enum(['windows', 'linux', 'seguranca', 'hardware', 'atualizacoes-criticas']),
        excerpt: z.string().optional(),
        tags: z.array(z.string()).optional(),
    }),
});

export const collections = {
    'conteudos': conteudos,
    'noticias': noticias,
};
