
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Fix: Declare Deno global to resolve TypeScript error
declare const Deno: any;

const HOTMART_TOKEN = Deno.env.get("HOTMART_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// PLACEHOLDER PRODUCT IDs - SUBSTITUA PELOS IDs REAIS DA HOTMART
const PRODUCT_ID_CORE = "123456"; // Produto de $37
const PRODUCT_ID_FAMILY = "789012"; // Produto de $17
const PRODUCT_ID_INSURANCE = "987654"; // Produto de $5 (Order Bump 1)
const PRODUCT_ID_OFFLINE_KIT = "456789"; // Produto de $14 (Order Bump 2)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, hottok",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const reqToken = req.headers.get("hottok") || new URL(req.url).searchParams.get("hottok");
    
    if (reqToken !== HOTMART_TOKEN) {
      console.error("Unauthorized Webhook Attempt");
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log("Hotmart Event:", body);

    let userEmail = body.email || body.buyer?.email || body.data?.buyer?.email || body.subscriber?.email;
    const productId = body.prod || body.product?.id || "unknown";

    if (!userEmail) {
        console.error("No email found in webhook payload");
        return new Response("No email found", { status: 400 });
    }
    
    userEmail = userEmail.trim().toLowerCase();

    // Init Supabase Admin
    const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Find User
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    let existingUser = existingUsers?.users.find(u => u.email?.toLowerCase() === userEmail);
    let targetUserId = existingUser?.id;

    if (!existingUser) {
        // Create User if not exists
        console.log("Creating new user for:", userEmail);
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: userEmail,
            email_confirm: true, 
            user_metadata: { name: body.name || body.buyer?.name || "Member" }
        });
        
        if (createError) console.error("Failed to create user:", createError);
        else if (newUser.user) targetUserId = newUser.user.id;
    }

    if (targetUserId) {
        // Determine Updates based on Product ID
        const updates: any = { updated_at: new Date().toISOString() };
        
        // Product Logic
        if (productId === PRODUCT_ID_INSURANCE) {
            updates.has_backup_insurance = true;
            console.log(`Unlocking INSURANCE for ${targetUserId}`);
        } else if (productId === PRODUCT_ID_OFFLINE_KIT) {
            updates.has_offline_kit = true;
            console.log(`Unlocking OFFLINE KIT for ${targetUserId}`);
        } else if (productId === PRODUCT_ID_FAMILY) {
            updates.is_premium = true;
            updates.is_family_plan = true;
            console.log(`Unlocking FAMILY for ${targetUserId}`);
        } else {
            // Default Core Product or Fallback
            updates.is_premium = true;
            console.log(`Unlocking CORE for ${targetUserId}`);
        }

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({ 
                user_id: targetUserId,
                ...updates
            }, { onConflict: 'user_id' });

        if (profileError) {
            console.error("Profile update failed:", profileError);
            return new Response("Db Error", { status: 500 });
        }
        
        console.log("Access Granted successfully.");
    } else {
        console.error("Could not determine User ID for", userEmail);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    console.error("Webhook Error:", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
