import subprocess
import sys
import os
import signal
import time
import urllib.request

def is_alive(url: str) -> bool:
    """Checks if an HTTP service is responding."""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'ReportSarthi-HealthCheck'})
        with urllib.request.urlopen(req, timeout=1.5) as r:
            return r.status in [200, 304]
    except Exception:
        return False

def free_port(port: int):
    """Terminates stale or orphaned process on port if needed."""
    if sys.platform.startswith('win'):
        try:
            cmd = f'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort {port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess"'
            output = subprocess.check_output(cmd, shell=True).decode().strip()
            if output:
                for line in output.split():
                    pid_str = line.strip()
                    if pid_str.isdigit():
                        pid = int(pid_str)
                        if pid != os.getpid():
                            print(f"[Cleanup] Terminating stale PID {pid} on port {port}...")
                            subprocess.run(f'taskkill /F /T /PID {pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass
    else:
        try:
            subprocess.run(f"fuser -k {port}/tcp", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass

def main():
    print("=" * 65, flush=True)
    print("  ReportSarthi - Combined AI Microservice & React Dashboard", flush=True)
    print("=" * 65, flush=True)

    project_dir = os.path.dirname(os.path.abspath(__file__))
    is_windows = sys.platform.startswith('win')
    
    backend_proc = None
    frontend_proc = None

    # Clean previous stale port usage
    free_port(5000)
    free_port(3000)
    time.sleep(1)

    # 1. Start Python Backend (Port 5000)
    print("[1/2] Starting Python OCR & Translation Microservice (Port 5000)...", flush=True)
    backend_proc = subprocess.Popen(
        [sys.executable, "server.py"],
        cwd=project_dir
    )
    time.sleep(1.5)

    # 2. Start Vite Frontend (Port 3000)
    print("[2/2] Starting Vite React Frontend (Port 3000)...", flush=True)
    frontend_cmd = "npx vite --host 0.0.0.0 --port 3000" if is_windows else ["npx", "vite", "--host", "0.0.0.0", "--port", "3000"]
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        shell=is_windows,
        cwd=project_dir
    )
    time.sleep(1.5)

    print("\n" + "=" * 65, flush=True)
    print("  ReportSarthi Application Status: ONLINE", flush=True)
    print("  -> Open in Browser: http://localhost:3000", flush=True)
    print("  -> Backend API:     http://127.0.0.1:5000/api/health", flush=True)
    print("  Keep this terminal window open. Press Ctrl + C to stop.", flush=True)
    print("=" * 65 + "\n", flush=True)

    def handle_exit(signum=None, frame=None):
        print("\n[ReportSarthi] Stopping managed services...")
        if backend_proc and backend_proc.pid:
            try:
                if is_windows:
                    subprocess.run(f'taskkill /F /T /PID {backend_proc.pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                else:
                    backend_proc.terminate()
            except Exception:
                pass
        if frontend_proc and frontend_proc.pid:
            try:
                if is_windows:
                    subprocess.run(f'taskkill /F /T /PID {frontend_proc.pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                else:
                    frontend_proc.terminate()
            except Exception:
                pass
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        handle_exit()

if __name__ == "__main__":
    main()
