
'use server';

import { query } from './db';

export interface ImageData {
  imageUrl: string | null;
  altText: string | null;
}

const DEFAULT_PLACEHOLDER_IMAGE = 'https://placehold.co/600x400.png';
const DEFAULT_ALT_TEXT = 'Placeholder image';

/**
 * Fetches an image URL and alt text from the database by its context tag.
 * @param contextTag The unique context tag for the image.
 * @returns An object containing the imageUrl and altText, or defaults if not found.
 */
export async function getImageByContextTag(contextTag: string): Promise<ImageData> {
  console.log(`[ImageService] Fetching image for context_tag: ${contextTag}`);
  try {
    const result = await query<{ image_url: string; alt_text: string | null }>(
      'SELECT image_url, alt_text FROM images WHERE context_tag = $1 LIMIT 1',
      [contextTag]
    );

    if (result.rows.length > 0) {
      const imageData = {
        imageUrl: result.rows[0].image_url,
        altText: result.rows[0].alt_text || DEFAULT_ALT_TEXT,
      };
      console.log(`[ImageService] Found image for ${contextTag}:`, imageData.imageUrl);
      return imageData;
    } else {
      console.warn(`[ImageService] No image found for context_tag: ${contextTag}. Using default placeholder.`);
      return { imageUrl: DEFAULT_PLACEHOLDER_IMAGE, altText: `${contextTag.replace(/_/g, ' ')} placeholder` };
    }
  } catch (error) {
    console.error(`[ImageService] Error fetching image for context_tag ${contextTag}:`, error);
    return { imageUrl: DEFAULT_PLACEHOLDER_IMAGE, altText: `${contextTag.replace(/_/g, ' ')} placeholder (error)` };
  }
}

/**
 * Fetches multiple images by their context tags.
 * @param contextTags An array of context tags.
 * @returns A Promise that resolves to a Record mapping context tags to ImageData.
 */
export async function getImagesByContextTags(contextTags: string[]): Promise<Record<string, ImageData>> {
  console.log(`[ImageService] Fetching images for context_tags: ${contextTags.join(', ')}`);
  if (contextTags.length === 0) {
    return {};
  }

  try {
    const placeholders = contextTags.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `SELECT image_url, alt_text, context_tag FROM images WHERE context_tag IN (${placeholders})`;

    const result = await query<{ image_url: string; alt_text: string | null; context_tag: string }>(sql, contextTags);

    const imagesMap: Record<string, ImageData> = {};

    // Initialize with defaults for all requested tags
    for (const tag of contextTags) {
      imagesMap[tag] = { imageUrl: DEFAULT_PLACEHOLDER_IMAGE, altText: `${tag.replace(/_/g, ' ')} placeholder` };
    }

    // Populate with found images from DB
    if (result.rows.length > 0) {
      result.rows.forEach(row => {
        imagesMap[row.context_tag] = {
          imageUrl: row.image_url,
          altText: row.alt_text || DEFAULT_ALT_TEXT, // Use DB alt text or default
        };
        console.log(`[ImageService] Found image for ${row.context_tag}:`, row.image_url);
      });
    } else {
       console.warn(`[ImageService] No images found for any of the tags: ${contextTags.join(', ')} in a single query. Individual fallbacks will apply.`);
    }
    
    // Log which tags were not found and are using defaults
    for (const tag of contextTags) {
        if (!result.rows.find(row => row.context_tag === tag)) {
            console.warn(`[ImageService] No specific DB image found for context_tag: ${tag}. Using default placeholder set above.`);
        }
    }
    return imagesMap;

  } catch (error) {
    console.error(`[ImageService] Error fetching images for context_tags ${contextTags.join(', ')}:`, error);
    const defaultResults: Record<string, ImageData> = {};
    contextTags.forEach(tag => {
      defaultResults[tag] = { imageUrl: DEFAULT_PLACEHOLDER_IMAGE, altText: `${tag.replace(/_/g, ' ')} placeholder (error)` };
    });
    return defaultResults;
  }
}
