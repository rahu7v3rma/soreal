import axios from "axios";
import { Resend } from "resend";

export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  react?: React.ReactNode;
}) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: `Soreal Notifications <team@noreply.soreal.app>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      react: options.react,
    });

    if (error) return { error };

    return { data };
  } catch (error) {
    return { error };
  }
}

export async function sendImageGenerationEmail(to: string, imageUrl: string) {
  try {
    const templateUrl =
      "https://api.soreal.app/assets/html/email-templates/image-generation.html";

    const response = await axios.get(templateUrl);
    if (!response.data) {
      throw new Error("Failed to fetch email template", {
        cause: response.data,
      });
    }

    const htmlTemplate = response.data.replaceAll("{{ ImageURL }}", imageUrl);

    return sendEmail({
      to,
      subject: "Your Soreal Image Is Ready",
      html: htmlTemplate,
    });
  } catch (error) {
    return { error };
  }
}
