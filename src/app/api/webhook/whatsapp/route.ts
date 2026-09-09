import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';
import OpenAI from 'openai';

type ExpenseRow = {
    date?: string | null;
    merchant_name?: string | null;
    amount?: number | string | null;
};

export async function POST(req: Request) {
    try {
        const supabase = getSupabaseClient();
        const twilioClient = getTwilioClient();
        const openai = getOpenAIClient();
        const twilioNumber = requiredEnv("TWILIO_WHATSAPP_NUMBER");

        // Twilio sends application/x-www-form-urlencoded
        const bodyText = await req.text();
        const urlParams = new URLSearchParams(bodyText);
        
        // Sender: whatsapp:+23480123...
        const twilioFrom = urlParams.get('From'); 
        const messageBody = urlParams.get('Body');
        
        if (!twilioFrom || !messageBody) {
            return NextResponse.json({ error: 'Invalid Payload' }, { status: 400 });
        }
        
        console.log(`Received WhatsApp message from ${twilioFrom}: ${messageBody}`);
        
        const senderPhone = twilioFrom.replace('whatsapp:', '');
        
        // 1. Look up user by WhatsApp number
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('whatsapp_number', senderPhone)
            .single();
            
        if (profileError || !profile) {
            // Unrecognized user
            await twilioClient.messages.create({
                body: "Hello! KudiPal doesn't recognize this number. Please log in to your dashboard and connect your WhatsApp number.",
                from: `whatsapp:${twilioNumber}`,
                to: twilioFrom
            });
            return NextResponse.json({ status: 'unregistered_handled' });
        }
        
        // 2. Fetch context for the AI (e.g., this month's expenses)
        const { data: expenses } = await supabase
            .from('expenses')
            .select('*')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: false })
            .limit(10);
            
        // Prepare context
        const businessName = profile.business_name || 'your business';
        const contextStr = expenses && expenses.length > 0
            ? `Recent expenses:\n${(expenses as ExpenseRow[]).map(e => `- ${e.date || ''}: ${e.merchant_name} (₦${e.amount})`).join('\n')}`
            : 'No recent expenses recorded.';
            
        // 3. Ask OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are KudiPal, a friendly, smart, and trustworthy AI money assistant for a Nigerian business owner named ${profile.email}. Their business is called "${businessName}". Keep your answers extremely concise, helpful, and formatted well for WhatsApp (using *bolding* for emphasis). Sound clear, calm, and practical rather than corporate. Refer to the business data provided below if relevant.\n\nContext:\n${contextStr}`
                },
                {
                    role: "user",
                    content: messageBody
                }
            ],
            max_tokens: 250,
            temperature: 0.7,
        });
        
        const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I'm having trouble analyzing your request right now.";
        
        // 4. Send response back to WhatsApp via Twilio
        await twilioClient.messages.create({
            body: aiResponse,
            from: `whatsapp:${twilioNumber}`,
            to: twilioFrom
        });
        
        return NextResponse.json({ status: 'success' });
        
    } catch (error: unknown) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
    }
}

function getSupabaseClient() {
    return createClient(
        requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
        requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    );
}

function getTwilioClient() {
    const accountSid = requiredEnv("TWILIO_ACCOUNT_SID");
    const authToken = requiredEnv("TWILIO_AUTH_TOKEN");

    if (!accountSid.startsWith("AC")) {
        throw new Error("TWILIO_ACCOUNT_SID must start with AC.");
    }

    return twilio(accountSid, authToken);
}

function getOpenAIClient() {
    return new OpenAI({
        apiKey: requiredEnv("OPENAI_API_KEY"),
    });
}

function requiredEnv(name: string) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is required.`);
    }
    return value;
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown webhook processing error";
}
