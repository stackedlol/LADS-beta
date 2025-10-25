import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('lads');
    const collection = db.collection('waitlist');
    
    const count = await collection.countDocuments();
    
    return NextResponse.json(
      { count },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Waitlist Count Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist count', count: 0 },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('📨 Waitlist API called');
  console.log('🔑 MongoDB URI exists:', !!process.env.MONGODB_URI);
  
  try {
    const { email } = await request.json();
    console.log('📧 Email received:', email);

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    console.log('🔌 Connecting to MongoDB...');
    // Connect to MongoDB
    const client = await clientPromise;
    console.log('✅ MongoDB client connected');
    
    const db = client.db('lads');
    console.log('📚 Database selected: lads');
    
    const collection = db.collection('waitlist');
    console.log('📂 Collection selected: waitlist');

    // Check if email already exists
    console.log('🔍 Checking for existing email...');
    const existingEmail = await collection.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      console.log('⚠️ Email already exists');
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Insert email with timestamp
    console.log('💾 Inserting new email...');
    const result = await collection.insertOne({
      email: email.toLowerCase(),
      createdAt: new Date(),
      status: 'pending',
    });

    console.log('✅ Email added to waitlist:', email);
    console.log('📄 Document ID:', result.insertedId);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully joined waitlist!',
        id: result.insertedId 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Waitlist API Error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to join waitlist. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

