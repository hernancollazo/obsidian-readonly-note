'use strict';

var obsidian = require('obsidian');
var promises = require('fs/promises');

const DEFAULT_SETTINGS = {
    readOnlyFiles: {}
};
class ReadOnlyNotePlugin extends obsidian.Plugin {
    async onload() {
        await this.loadSettings();
        this.addCommand({
            id: 'toggle-read-only',
            name: 'Toggle read-only on active note',
            callback: async () => {
                const file = this.app.workspace.getActiveFile();
                if (!file) {
                    new obsidian.Notice("No active file");
                    return;
                }
                await this.toggleReadOnly(file);
            }
        });
        this.addRibbonIcon('lock', 'Toggle read-only', async () => {
            const file = this.app.workspace.getActiveFile();
            if (!file) {
                new obsidian.Notice("No active file");
                return;
            }
            await this.toggleReadOnly(file);
        });
        this.registerEvent(this.app.workspace.on('file-open', file => {
            if (file instanceof obsidian.TFile) {
                this.applyVisualMarker(file);
                this.updateTabTitle(file);
                this.setEditorReadOnly(file);
            }
        }));
    }
    async toggleReadOnly(file) {
        const fsPath = this.app.vault.adapter.getFullPath(file.path);
        const fs = require('fs');
        fs.stat(fsPath, async (err, stats) => {
            if (err) {
                new obsidian.Notice("Failed to get file stats.");
                return;
            }
            const isReadOnly = !(stats.mode & 0o200);
            const newMode = isReadOnly ? 0o644 : 0o444;
            try {
                await promises.chmod(fsPath, newMode);
                this.settings.readOnlyFiles[file.path] = !isReadOnly;
                await this.saveSettings();
                new obsidian.Notice(`Set ${file.name} to ${isReadOnly ? "writable" : "read-only"}`);
                this.applyVisualMarker(file);
                this.updateTabTitle(file);
                this.setEditorReadOnly(file);
            }
            catch (chmodErr) {
                new obsidian.Notice("Failed to change permissions.");
            }
        });
    }
    applyVisualMarker(file) {
        const leaf = this.app.workspace.getLeaf();
        const view = leaf.view;
        const container = view.containerEl;
        const isReadOnly = this.settings.readOnlyFiles[file.path] === true;
        if (isReadOnly) {
            container.classList.add("readonly-note");
        }
        else {
            container.classList.remove("readonly-note");
        }
    }
    updateTabTitle(file) {
        const isReadOnly = this.settings.readOnlyFiles[file.path] === true;
        const leaves = this.app.workspace.getLeavesOfType("markdown");
        for (const leaf of leaves) {
            const view = leaf.view;
            if (view.file?.path === file.path) {
                const tabHeaderEl = leaf.tabHeaderEl;
                const rawTitle = file.basename;
                const hasRO = tabHeaderEl.innerText.contains("(RO)");
                if (isReadOnly && !hasRO) {
                    tabHeaderEl.innerText = rawTitle + " (RO)";
                }
                else if (!isReadOnly && hasRO) {
                    tabHeaderEl.innerText = rawTitle;
                }
            }
        }
    }
    setEditorReadOnly(file) {
        const isReadOnly = this.settings.readOnlyFiles[file.path] === true;
        const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (view) {
            const editor = view.editor;
            if (isReadOnly) {
                editor.setOption("readOnly", "nocursor");
                // Show info only once
                if (!editor["_readOnlyNotified"]) {
                    new obsidian.Notice("This note is in read-only mode.");
                    editor["_readOnlyNotified"] = true;
                }
            }
            else {
                editor.setOption("readOnly", false);
                editor["_readOnlyNotified"] = false;
            }
        }
    }
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }
}

module.exports = ReadOnlyNotePlugin;
