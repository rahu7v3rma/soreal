import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/nextjs";

const Deno = {
  env: {
    get: (key: string): string | undefined => {
      return process.env[key];
    },
  },
};

const logger = {
  now: () => {
    return new Date().toISOString();
  },
  info: (message: string, object?: any) => {
    console.info(`${logger.now()} - INFO - ${message}`);
    if (object) {
      console.info(JSON.stringify(object));
    }
  },
  error: (message: string, error?: any) => {
    console.error(`${logger.now()} - ERROR - ${message}`);
    if (error) {
      console.error(JSON.stringify(error));
    }
  },
};

Sentry.init({
  dsn: Deno.env.get("SENTRY_DSN"),
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});

const cleanupUserReference = async () => {
  try {
    logger.info("Started cleaning up user reference images");

    // Setup Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all users
    const { data: users, error: usersError } = await supabase
      .from("user_profiles")
      .select("user_id");
    
    if (usersError || !users) {
      throw new Error("Error fetching users", { cause: usersError });
    }

    if (users?.length === 0) {
      logger.info("No users found");
      return new Response(
        JSON.stringify({
          success: true,
          message: "No users found to clean up",
        })
      );
    }

    logger.info(`Found ${users.length} users`);

    // Process each user
    const processedUsers = [];
    let totalImagesDeleted = 0;

    for (const user of users) {
      try {
        const userId = user.user_id;
        logger.info(`Processing reference images for user ${userId}`);

        // List reference images for the user
        const { data: referenceImages, error: listError } = await supabase.storage
          .from("assets")
          .list(`users/${userId}/reference`, {});

        if (listError) {
          // Skip if the folder doesn't exist (error message includes "fewer than 1")
          if (listError.message.toLowerCase().includes("fewer than 1")) {
            logger.info(`No reference folder found for user ${userId}`);
            continue;
          }
          throw new Error("Failed to list reference images", {
            cause: listError,
          });
        }

        if (!referenceImages || referenceImages.length === 0) {
          logger.info(`No reference images found for user ${userId}`);
          continue;
        }

        logger.info(`Found ${referenceImages.length} reference images for user ${userId}`);

        // Prepare paths for deletion
        const pathsToDelete = referenceImages.map(
          (file) => `users/${userId}/reference/${file.name}`
        );

        // Delete reference images
        const { data: deleteData, error: deleteError } = await supabase.storage
          .from("assets")
          .remove(pathsToDelete);

        if (deleteError) {
          throw new Error("Failed to delete reference images", {
            cause: deleteError,
          });
        }

        totalImagesDeleted += referenceImages.length;
        processedUsers.push(userId);

        logger.info(
          `Successfully deleted ${referenceImages.length} reference images for user ${userId}`
        );
      } catch (error) {
        logger.error(
          `Error processing reference images for user ${user.user_id}:`,
          error
        );

        Sentry.captureException("Error processing user reference images", {
          extra: {
            userId: user.user_id,
            cause: error,
          },
        });

        continue;
      }
    }

    logger.info(
      `Successfully processed ${processedUsers.length} out of ${users.length} users, deleted ${totalImagesDeleted} images in total`
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          processedUsers: processedUsers.length,
          totalUsers: users.length,
          totalImagesDeleted,
        },
      })
    );
  } catch (error) {
    logger.error("Unexpected error while cleaning up reference images:", error);

    Sentry.captureException("Unexpected error while cleaning up reference images", {
      extra: {
        cause: error,
      },
    });

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to clean up reference images",
      }),
      { status: 500 }
    );
  }
};

export default cleanupUserReference; 