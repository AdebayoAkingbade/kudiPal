import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
    try {
        const supabase = getSupabaseRouteClient();
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string;

        if (!file || !userId) {
            return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${nanoid()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        // 1. Upload to Supabase Storage
        const { error: storageError } = await supabase.storage
            .from('receipts')
            .upload(filePath, file);

        if (storageError) throw storageError;

        // 2. Insert record into database
        const { data: dbData, error: dbError } = await supabase
            .from('receipts')
            .insert({
                user_id: userId,
                storage_path: filePath,
                file_name: file.name,
                content_type: file.type,
                status: 'pending'
            })
            .select()
            .single();

        if (dbError) throw dbError;

        return NextResponse.json({ success: true, receipt: dbData });

    } catch (error: unknown) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
    }
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Upload failed.";
}

function getSupabaseRouteClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase upload configuration is missing.");
    }

    return createClient(supabaseUrl, supabaseAnonKey);
}
