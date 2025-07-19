import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/constants/supabase";

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(SUPABASE_URL, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface Blog {
  id: string;
  title: string;
  content: string;
  featured_image_url: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  archived?: boolean;
}

export const getBlogs = async ({ archived }: { archived?: boolean } = {}): Promise<Blog[]> => {
  try {
    let query = supabaseAdmin
      .from("blogs")
      .select("*");

    // Only filter by archived status if the parameter is provided
    if (archived !== undefined) {
      query = query.eq("archived", archived);
    }

    const response = await query.order("created_at", { ascending: false });

    if (!response.data || response.error) {
      return [];
    }

    return response.data.map((blog) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      featured_image_url: blog.featured_image_url,
      slug: blog.slug,
      created_at: blog.created_at,
      updated_at: blog.updated_at,
      archived: blog.archived,
    }));
  } catch {
    return [];
  }
};

export const getBlog = async ({ id, slug, archived }: { id?: string; slug?: string; archived?: boolean }): Promise<Blog | null> => {
  if (!id && !slug) {
    return null;
  }

  try {
    let query = supabaseAdmin
      .from("blogs")
      .select("*");

    // Filter by id
    if (id) {
      query = query.eq("id", id);
    }

    // Filter by slug
    if (slug) {
      query = query.eq("slug", slug);
    }

    // Only filter by archived status if the parameter is provided
    if (archived !== undefined) {
      query = query.eq("archived", archived);
    }

    const response = await query.single();

    if (!response.data || response.error) {
      return null;
    }

    return {
      id: response.data.id,
      title: response.data.title,
      content: response.data.content,
      featured_image_url: response.data.featured_image_url,
      slug: response.data.slug,
      created_at: response.data.created_at,
      updated_at: response.data.updated_at,
      archived: response.data.archived,
    };
  } catch {
    return null;
  }
};


