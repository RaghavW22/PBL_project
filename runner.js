// ReportSarthi Unified Process Orchestrator
import { spawn, execSync } from 'child_process';
import http from 'http';

const isWindows = process.platform === 'win32';

function killPort(port) {
  try {
    if (isWindows) {
      const pids = execSync(
        `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess"`
      ).toString().trim().split(/\s+/).filter(Boolean);

      for (const pid of pids) {
        const p = parseInt(pid, 10);
        if (p && p !== process.pid) {
          console.log(`[Cleanup] Releasing port ${port} from stale PID ${p}...`);
          try {
            execSync(`taskkill /F /T /PID ${p}`, { stdio: 'ignore' });
          } catch (_) {}
        }
      }
    }
  } catch (e) {
    // Ignore cleanup errors
  }
}

async function main() {
  console.log('='.repeat(65));
  console.log('  ReportSarthi - Dual AI & Medical Dashboard Orchestrator');
  console.log('='.repeat(65));

  // Clean stale ports
  killPort(5000);
  killPort(3000);

  // 1. Launch FastAPI Microservice
  console.log('[1/2] Starting Python OCR & Translation Microservice (Port 5000)...');
  const pythonCmd = isWindows ? 'python' : 'python3';
  const backendProc = spawn(pythonCmd, ['server.py'], {
    stdio: 'inherit',
    shell: false,
  });

  backendProc.on('error', (err) => {
    console.error('[Backend Error]:', err);
  });

  // Small delay to let Python bind port
  await new Promise((r) => setTimeout(r, 1500));

  // 2. Launch Vite Frontend
  console.log('[2/2] Starting Vite Frontend Server (Port 3000)...');
  const viteProc = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '3000'], {
    stdio: 'inherit',
    shell: true,
  });

  viteProc.on('error', (err) => {
    console.error('[Frontend Error]:', err);
  });

  console.log('\n' + '='.repeat(65));
  console.log('  ReportSarthi Application Status: ONLINE');
  console.log('  -> Frontend Local:   http://localhost:3000');
  console.log('  -> Backend Health:   http://127.0.0.1:5000/api/health');
  console.log('  Keep this window open. Press Ctrl + C to stop.');
  console.log('='.repeat(65) + '\n');

  function cleanup() {
    console.log('\n[ReportSarthi] Stopping all services cleanly...');
    try {
      if (backendProc && backendProc.pid) {
        if (isWindows) {
          execSync(`taskkill /F /T /PID ${backendProc.pid}`, { stdio: 'ignore' });
        } else {
          backendProc.kill('SIGTERM');
        }
      }
    } catch (_) {}

    try {
      if (viteProc && viteProc.pid) {
        if (isWindows) {
          execSync(`taskkill /F /T /PID ${viteProc.pid}`, { stdio: 'ignore' });
        } else {
          viteProc.kill('SIGTERM');
        }
      }
    } catch (_) {}

    process.exit(0);
  }

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

main().catch(console.error);
