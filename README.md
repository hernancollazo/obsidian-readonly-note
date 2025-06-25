# Read-only Note Plugin for Obsidian

This Obsidian plugin allows you to toggle any note to **read-only mode** by changing its file permissions at the operating system level.

## Disclaimer & License

This project is currently a **proof of concept** and is NOT under active development.
It's not considered stable, and we do **not recommend** using it on documents containing important or irreplaceable information.
Unexpected behavior may result in data loss or corruption. Any use of this code is entirely **at your own risk**.
If you’re looking for a stable and reliable alternative, check out [https://github.com/Felvesthe/note-locker](https://github.com/Felvesthe/note-locker) — it’s actually really good!

## Features

- 🔒 Toggle read-only or writable state on the current note
- 📎 Visual indicator in the editor when a note is read-only
- 📁 Changes file system permissions directly (e.g. `chmod 444`)
- 💾 Remembers which files are read-only between restarts
- 🖱 Ribbon icon for quick toggling

## Requirements

- Works only on **desktop versions** of Obsidian
- File permission support (tested on macOS and Linux; partial on Windows)

## Installation

1. Clone or download this repository.
2. Run `npm install` and `npm run build` to compile the plugin.
3. Copy the contents to your Obsidian vault’s `.obsidian/plugins/readonly-note` folder.
4. Enable the plugin from Obsidian’s settings.

## Development

```bash
npm install
npm run build
```

## Author

Created by **Hernán Collazo**
📧 hernan.collazo@gmail.com
🔗 [GitHub](https://github.com/hernancollazo)

---

## License

This project is licensed under the [MIT License](./LICENSE).

The software is provided **"as is"**, without any warranties, and the author is **not responsible** for any damages or issues arising from its use. You are free to use, modify, and distribute the code, but **you do so at your own risk**.
