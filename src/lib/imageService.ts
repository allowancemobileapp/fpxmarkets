
'use server';

import { query } from './db';

export interface ImageData {
  imageUrl: string; // Changed to string, as service will always provide a valid URL or placeholder
  altText: string;  // Changed to string for the same reason
}

const DEFAULT_PLACEHOLDER_IMAGE = 'https://placehold.co/600x400.png';
const DEFAULT_ALT_TEXT = 'Placeholder image';

/**
 * Cleans up image URLs, specifically removing double slashes after the hostname or in the path.
 * Example: https://domain.com//path//file.jpg -> https://domain.com/path/file.jpg
 * @param url The original URL string.
 * @returns A cleaned URL string.
 */
function cleanImageUrl(url: string | null | undefined): string {
  if (!url || url.trim() === '') {
    return DEFAULT_PLACEHOLDER_IMAGE;
  }
  // Regex to replace multiple slashes with a single slash, but not after the protocol (e.g., http://)
  // It looks for a character that is NOT a colon, followed by one or more slashes, and replaces with the character and one slash.
  let cleanedUrl = url.replace(/([^:])\/\/+/g, '$1/');
  // Special case for Supabase URLs that might have double slash after 'public' if bucket name is empty in path
  // e.g. .../object/public//fpx-market-images...
  cleanedUrl = cleanedUrl.replace(/(\/object\/public)\/\/+/g, '$1/');
  return cleanedUrl;
}


/**
 * Fetches an image URL and alt text from the database by its context tag.
 * @param contextTag The unique context tag for the image.
 * @returns An object containing the imageUrl and altText.
 */
export async function getImageByContextTag(contextTag: string): Promise<ImageData> {
  console.log(`[ImageService] Fetching image for context_tag: ${contextTag}`);
  try {
    const result = await query<{ image_url: string | null; alt_text: string | null }>(
      'SELECT image_url, alt_text FROM images WHERE context_tag = $1 LIMIT 1',
      [contextTag]
    );

    if (result.rows.length > 0) {
      const dbImageUrl = result.rows[0].image_url;
      const finalImageUrl = cleanImageUrl(dbImageUrl);
      const imageData = {
        imageUrl: finalImageUrl,
        altText: result.rows[0].alt_text || `${contextTag.replace(/_/g, ' ')} alt text`,
      };
      console.log(`[ImageService] Found image for ${contextTag}. DB URL: "${dbImageUrl}", Cleaned URL: "${imageData.imageUrl}"`);
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

  const imagesMap: Record<string, ImageData> = {};

  // Initialize with defaults for all requested tags first
  for (const tag of contextTags) {
    imagesMap[tag] = { imageUrl: DEFAULT_PLACEHOLDER_IMAGE, altText: `${tag.replace(/_/g, ' ')} placeholder` };
  }

  try {
    const placeholders = contextTags.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `SELECT image_url, alt_text, context_tag FROM images WHERE context_tag IN (${placeholders})`;

    const result = await query<{ image_url: string | null; alt_text: string | null; context_tag: string }>(sql, contextTags);

    if (result.rows.length > 0) {
      result.rows.forEach(row => {
        const dbImageUrl = row.image_url;
        const finalImageUrl = cleanImageUrl(dbImageUrl);
        imagesMap[row.context_tag] = {
          imageUrl: finalImageUrl,
          altText: row.alt_text || `${row.context_tag.replace(/_/g, ' ')} alt text`,
        };
        console.log(`[ImageService] Processed image for ${row.context_tag}. DB URL: "${dbImageUrl}", Cleaned URL: "${finalImageUrl}"`);
      });
    } else {
       console.warn(`[ImageService] No images found in DB for any of the tags: ${contextTags.join(', ')}. All will use placeholders.`);
    }
    
    // Final check and log for any tags still using placeholders after DB check
    for (const tag of contextTags) {
        if (imagesMap[tag].imageUrl === DEFAULT_PLACEHOLDER_IMAGE) {
            if (!result.rows.find(row => row.context_tag === tag)) {
                 console.warn(`[ImageService] Confirmed: No specific DB image for context_tag: ${tag}. Using default placeholder: ${imagesMap[tag].imageUrl}`);
            }
        }
    }
    return imagesMap;

  } catch (error) {
    console.error(`[ImageService] Error fetching images for context_tags ${contextTags.join(', ')}:`, error);
    // Fallback map is already initialized with defaults, so just return it
    return imagesMap;
  }
}
