import { Resend } from 'resend';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In Astro, import.meta.env automatically loads from .env locally
    // and reads Cloudflare Pages environment variables in production.
    const apiKey = import.meta.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("Missing RESEND_API_KEY");
      return new Response(
        JSON.stringify({ error: 'Server configuration error.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(apiKey);

    const { data: resendData, error } = await resend.emails.send({
      from: 'Real Tip Calculator <onboarding@resend.dev>', // You should change this to a verified domain email later, e.g., noreply@realtipcalculator.com
      to: ['lifeturningpoint007@gmail.com'],
      subject: `New Contact Form Submission: ${subject || 'General Feedback'}`,
      replyTo: email,
      html: `
        <h2>New Message from Real Tip Calculator Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'General Feedback'}</p>
        <hr />
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: resendData }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
