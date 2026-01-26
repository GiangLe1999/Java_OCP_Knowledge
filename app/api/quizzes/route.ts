import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'quizzes.json');

export async function GET() {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ quizzes: [] });
    }
}

export async function POST(request: NextRequest) {
    try {
        const newQuiz = await request.json();
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

        data.quizzes.push({
            ...newQuiz,
            id: `quiz-${Date.now()}`,
            createdAt: new Date().toISOString()
        });

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, quiz: data.quizzes[data.quizzes.length - 1] });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create quiz' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        data.quizzes = data.quizzes.filter((q: any) => q.id !== id);

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete quiz' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const updatedQuiz = await request.json();
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

        const index = data.quizzes.findIndex((q: any) => q.id === updatedQuiz.id);
        if (index !== -1) {
            data.quizzes[index] = {
                ...updatedQuiz,
                updatedAt: new Date().toISOString()
            };
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            return NextResponse.json({ success: true, quiz: data.quizzes[index] });
        }

        return NextResponse.json({ success: false, error: 'Quiz not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update quiz' }, { status: 500 });
    }
}
