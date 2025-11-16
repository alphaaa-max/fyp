#!/bin/bash

# Fix macOS file watcher limit
ulimit -n 65536

# Start Expo
npm start
