import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidEmail } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { email, source = "homepage", name } = await request.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, is_active")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { error: "You're already subscribed!" },
          { status: 400 }
        );
      }

      // Reactivate subscription
      await supabase
        .from("subscribers")
        .update({ is_active: true })
        .eq("id", existing.id);

      return NextResponse.json({ success: true, message: "Welcome back!" });
    }

    // Create new subscriber
    const { error } = await supabase.from("subscribers").insert({
      email: email.toLowerCase(),
      name: name || null,
      source,
      is_active: true,
    });

    if (error) {
      console.error("Error creating subscriber:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thanks for subscribing!",
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
