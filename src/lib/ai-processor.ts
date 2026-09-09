import OpenAI from 'openai';
import { supabase } from './supabase';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type ReceiptAnalysis = {
    amount?: number | string;
    currency?: string;
    category?: string;
    merchant_name?: string;
    transaction_date?: string;
    description?: string;
};

export async function processReceipt(receiptId: string, storagePath: string) {
    try {
        // 1. Get the public URL for the file from Supabase Storage
        const { data: { publicUrl } } = supabase.storage
            .from('receipts')
            .getPublicUrl(storagePath);

        // 2. Use OpenAI Vision or GPT-4o to analyze the receipt
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze this receipt. Extract the following information in JSON format: amount, currency, merchant_name, transaction_date (YYYY-MM-DD), category (food, transport, utilities, inventory, rent, other), and description." },
                        {
                            type: "image_url",
                            image_url: {
                                "url": publicUrl,
                            },
                        },
                    ],
                },
            ],
            response_format: { type: "json_object" },
        });

        const analysis = JSON.parse(response.choices[0].message.content || '{}') as ReceiptAnalysis;

        // 3. Update the receipt status and raw JSON
        const { error: updateError } = await supabase
            .from('receipts')
            .update({
                status: 'completed',
                ocr_raw_json: analysis
            })
            .eq('id', receiptId);

        if (updateError) throw updateError;

        // 4. Extract user_id for the expense record
        const { data: receiptData } = await supabase
            .from('receipts')
            .select('user_id')
            .eq('id', receiptId)
            .single();

        // 5. Create structured expense record
        const { error: expenseError } = await supabase
            .from('expenses')
            .insert({
                user_id: receiptData?.user_id,
                receipt_id: receiptId,
                amount: analysis.amount,
                currency: analysis.currency || 'NGN',
                category: analysis.category,
                merchant_name: analysis.merchant_name,
                transaction_date: analysis.transaction_date,
                description: analysis.description,
            });

        if (expenseError) throw expenseError;

        return { success: true, analysis };

    } catch (error: unknown) {
        console.error('AI Processing Error:', error);

        // Mark receipt as error state
        await supabase
            .from('receipts')
            .update({ status: 'error' })
            .eq('id', receiptId);

        return { success: false, error: error instanceof Error ? error.message : "AI processing failed." };
    }
}
