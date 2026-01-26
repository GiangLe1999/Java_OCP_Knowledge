import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'parent-topics.json');

export async function GET() {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ parentTopics: [] });
    }
}

export async function POST(request: NextRequest) {
    try {
        const newParentTopic = await request.json();
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

        data.parentTopics.push({
            ...newParentTopic,
            id: `parent-${Date.now()}`,
            createdAt: new Date().toISOString()
        });

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, parentTopic: data.parentTopics[data.parentTopics.length - 1] });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create parent topic' }, { status: 500 });
    }
}
