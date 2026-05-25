#!/usr/bin/env node
const { exec } = require('child_process');
const interval = parseInt(process.env.AUTOPUSH_INTERVAL || '5000', 10);
const repoPath = process.cwd();

function run(cmd, cb) {
  exec(cmd, { cwd: repoPath }, (err, stdout, stderr) => {
    if (err) {
      console.error(`Command failed: ${cmd}\n`, stderr || err.message);
    }
    cb && cb(err, stdout && stdout.toString());
  });
}

let busy = false;
console.log(`Autopush watcher started. Polling every ${interval}ms.`);

function checkAndPush() {
  if (busy) return;
  busy = true;
  run('git status --porcelain', (err, out) => {
    if (err) { busy = false; return; }
    if (!out || out.trim() === '') {
      busy = false;
      return;
    }

    const message = process.env.AUTOPUSH_COMMIT_MESSAGE || `Auto commit: ${new Date().toISOString()}`;
    console.log('Changes detected. Staging and committing...');
    run('git add -A', () => {
      run(`git commit -m "${message.replace(/"/g, '\\"')}"`, (err2) => {
        if (err2) {
          console.log('Nothing to commit or commit failed.');
          busy = false;
          return;
        }
        console.log('Committed. Pushing to origin...');
        run('git push', (err3, out3) => {
          if (err3) console.error('Push failed:', err3.message || out3);
          else console.log('Pushed successfully.');
          busy = false;
        });
      });
    });
  });
}

// initial check and then interval
checkAndPush();
setInterval(checkAndPush, interval);
