#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

function findMaestro() {
  const explicitPath = process.env.MAESTRO_PATH;
  if (explicitPath) {
    if (fs.existsSync(explicitPath)) return explicitPath;
    throw new Error(`MAESTRO_PATH does not exist: ${explicitPath}`);
  }

  const isWindows = process.platform === 'win32';
  const executableNames = isWindows
    ? ['maestro.bat', 'maestro.cmd', 'maestro.exe', 'maestro']
    : ['maestro'];
  const searchDirectories = (process.env.PATH || '').split(path.delimiter);

  if (isWindows && process.env.LOCALAPPDATA) {
    searchDirectories.push(
      path.join(process.env.LOCALAPPDATA, 'Programs', 'Maestro', 'bin'),
    );
  } else if (!isWindows) {
    searchDirectories.push(path.join(os.homedir(), '.maestro', 'bin'));
  }

  for (const directory of searchDirectories) {
    for (const executableName of executableNames) {
      const candidate = path.join(directory, executableName);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
  }

  throw new Error(
    'Maestro CLI was not found. Install it and add its bin directory to PATH, ' +
      'or set MAESTRO_PATH to the CLI executable.',
  );
}

let maestro;
try {
  maestro = findMaestro();
} catch (error) {
  console.error(error.message);
  process.exit(127);
}

const child = spawn(maestro, process.argv.slice(2), {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('error', (error) => {
  console.error(`Failed to start Maestro CLI: ${error.message}`);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exitCode = code ?? 1;
  }
});
