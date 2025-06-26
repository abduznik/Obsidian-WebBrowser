# WebBlock Obsidian Plugin

This plugin for Obsidian allows you to create interactive blocks with buttons that load web pages into an iframe directly in your notes.

## Features

- **Embed Web Content:** Display web pages within your notes without leaving Obsidian.
- **Customizable Buttons:** Create multiple buttons, each with its own label and URL.
- **Flexible Layout:** Adjust the width and height of the iframe, the size of the buttons, and the default button color.

## How to Use

1. **Install the plugin:**
   - Go to the releases page of this repository.
   - Download the latest release, which contains `main.js` and `manifest.json`.
   - In your Obsidian vault, go to `.obsidian/plugins/`.
   - Create a new folder named `obsidian-webbrowser`.
   - Copy the downloaded `main.js` and `manifest.json` files into this new folder.
   - Restart Obsidian and enable the plugin in the settings.
2. **Create a WebBlock:**
   - Run the "Insert Web Button Block" command from the command palette.
   - A modal will appear, allowing you to configure your buttons and the appearance of the block.
   - Click "Insert Block" to add the WebBlock to your note.
3. **Interact with the WebBlock:**
   - The plugin will render the buttons and an iframe in your note.
   - Click on a button to load the corresponding web page in the iframe.

## For Developers

This plugin is built with TypeScript.

- `main.ts`: The main entry point of the plugin.
- `manifest.json`: The plugin manifest.

### Build

To build the plugin, you'll need to have Node.js and npm installed.

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Run `npm run build` to build the plugin.

This will create a `main.js` file in the project root, which you can then use to test the plugin in Obsidian.
