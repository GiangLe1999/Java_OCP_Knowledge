import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'topics.json');

export async function GET() {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ topics: [] });
    }
}

export async function POST(request: NextRequest) {
    try {
        const newTopic = await request.json();
        console.log('Received topic data:', newTopic);

        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        console.log('Current data:', data);

        data.topics.push({
            ...newTopic,
            id: `topic-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log('Topic created successfully');
        return NextResponse.json({ success: true, topic: data.topics[data.topics.length - 1] });
    } catch (error) {
        console.error('Error creating topic:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create topic',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const updatedTopic = await request.json();
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

        const index = data.topics.findIndex((t: any) => t.id === updatedTopic.id);
        if (index !== -1) {
            data.topics[index] = {
                ...updatedTopic,
                updatedAt: new Date().toISOString()
            };
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            return NextResponse.json({ success: true, topic: data.topics[index] });
        }

        return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update topic' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        data.topics = data.topics.filter((t: any) => t.id !== id);

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete topic' }, { status: 500 });
    }
}
