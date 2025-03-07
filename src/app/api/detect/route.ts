import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Get the absolute path to the Python script
    const pythonScriptPath = path.join(process.cwd(), 'src', 'python', 'detector.py');

    return new Promise((resolve) => {
      const pythonProcess = spawn('python', [pythonScriptPath]);
      let dataString = '';

      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          resolve(NextResponse.json({ error: 'Python process failed' }, { status: 500 }));
          return;
        }

        try {
          const result = JSON.parse(dataString);
          resolve(NextResponse.json(result));
        } catch (error) {
          resolve(NextResponse.json({ error: 'Failed to parse Python output' }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

