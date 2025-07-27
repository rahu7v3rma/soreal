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
  id: number;
  title: string;
  content: string;
  featured_image_url: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  archived?: boolean;
}

export const getBlogs = async ({
  archived,
  limit = 10,
  page = 1,
  search,
  sort = { updated_at: "desc" },
  ids,
  slugs
}: {
  archived?: boolean;
  limit?: number;
  page?: number;
  search?: { title?: string; content?: string; slug?: string };
  sort?: { updated_at?: "desc" | "asc" };
  ids?: number[];
  slugs?: string[];
} = {}): Promise<Blog[]> => {
  try {
    let query = supabaseAdmin
      .from("blogs")
      .select("*");

    // Filter by IDs if provided
    if (ids && ids.length > 0) {
      query = query.in("id", ids);
    }

    // Filter by slugs if provided
    if (slugs && slugs.length > 0) {
      query = query.in("slug", slugs);
    }

    // Only filter by archived status if the parameter is provided
    if (archived !== undefined) {
      query = query.eq("archived", archived);
    }

    // Apply search filters with OR logic across fields
    if (search) {
      const searchConditions = [];
      if (search.title) {
        searchConditions.push(`title.ilike.%${search.title}%`);
      }
      if (search.content) {
        searchConditions.push(`content.ilike.%${search.content}%`);
      }
      if (search.slug) {
        searchConditions.push(`slug.ilike.%${search.slug}%`);
      }

      if (searchConditions.length > 0) {
        query = query.or(searchConditions.join(','));
      }
    }

    // Apply sorting using the sort object
    if (sort?.updated_at) {
      const ascending = sort.updated_at === "asc";
      query = query.order("updated_at", { ascending });
    }

    // Apply pagination - calculate skip from page
    const skip = (page - 1) * limit;
    query = query.range(skip, skip + limit - 1);

    const response = await query;

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

export const updateBlog = async (
  id: number,
  updateData: {
    title?: string;
    content?: string;
    slug?: string;
    featured_image_url?: string | null;
    archived?: boolean;
  }
): Promise<Blog | null> => {
  try {
    const response = await supabaseAdmin
      .from("blogs")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

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

export const deleteBlogs = async (blogIds: number[]) => {
  try {
    await supabaseAdmin
      .from("blogs")
      .delete()
      .in("id", blogIds);
  } catch (error) {
    throw error;
  }
};
