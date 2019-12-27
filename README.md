# Abstrakt [![npm version](https://badge.fury.io/js/abstrakt.svg)](https://badge.fury.io/js/abstrakt) 
 
Create time logs for abstract categories of activity. Logs time for work, create, and learn categories. Heavily inspired by the [Horaire project](https://wiki.xxiivv.com/#calendar).

Uses a Gist as the backend for syncing. The Gist is created the first time you run with the `-w`, `-c`, or `-l` flag.

### Syncing on a different computer
If you have a Gist set up on a different computer, you can share state between computers by running `abstrakt -s <gist id>`. This will register your existing Gist to the current installation. Otherwise, a new Gist will be created for each computer.

## Installation
```bash
npm i -g abstrakt
```

## Usage
Run `abstrakt` to see latest help and usage output.

## License
MIT
