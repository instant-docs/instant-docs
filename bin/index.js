#!/usr/bin/env node

import assert from 'assert';

async function main() {
  // Capture command-line arguments
  const args = process.argv.slice(2);

  if (args.includes('--build')) {
    const build = (await import('../build.js')).default;
    await build();
  } else {
    const { server } = await import('../index.js');
    assert(server, 'Server is not defined');
  }
}

main();
