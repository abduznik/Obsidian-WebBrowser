'use strict';

var obsidian = require('obsidian');

class WebButtonModal extends obsidian.Modal {
    constructor(app, onSubmit) {
        super(app);
        this.buttons = [];
        this.width = "100%";
        this.height = "500px";
        this.btnSize = "medium"; // small, medium, large
        this.defaultColor = "#007bff";
        this.onSubmit = onSubmit;
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl("h2", { text: "Create Web Button Block" });
        // Container for buttons list
        this.btnListEl = contentEl.createDiv({ cls: "webblock-modal-buttons-list" });
        this.renderButtons();
        // Button to add new button
        const addBtn = contentEl.createEl("button", { text: "Add Button" });
        addBtn.onclick = () => {
            this.buttons.push({ label: "", url: "", color: "" });
            this.renderButtons();
        };
        // Width input
        new obsidian.Setting(contentEl)
            .setName("Iframe Width")
            .setDesc("e.g. 100%, 800px")
            .addText(text => text
            .setPlaceholder("100%")
            .setValue(this.width)
            .onChange(value => this.width = value.trim() || "100%"));
        // Height input
        new obsidian.Setting(contentEl)
            .setName("Iframe Height")
            .setDesc("e.g. 500px, 50vh")
            .addText(text => text
            .setPlaceholder("500px")
            .setValue(this.height)
            .onChange(value => this.height = value.trim() || "500px"));
        // Button size dropdown
        new obsidian.Setting(contentEl)
            .setName("Button Size")
            .setDesc("Controls padding and font-size")
            .addDropdown(drop => drop
            .addOption("small", "Small")
            .addOption("medium", "Medium (default)")
            .addOption("large", "Large")
            .setValue(this.btnSize)
            .onChange(value => this.btnSize = value));
        // Default button color input
        new obsidian.Setting(contentEl)
            .setName("Default Button Color")
            .setDesc("Used if button has no color set")
            .addText(text => text
            .setPlaceholder("#007bff")
            .setValue(this.defaultColor)
            .onChange(value => this.defaultColor = value.trim() || "#007bff"));
        // Submit button
        const submitBtn = contentEl.createEl("button", { text: "Insert Block" });
        submitBtn.style.marginTop = "1em";
        submitBtn.onclick = () => {
            // Process buttons, replacing empty labels with 'none'
            const processed = this.buttons.map(b => {
                let url = b.url.trim();
                if (url && !url.match(/^https?:\/\//i)) {
                    url = "https://" + url;
                }
                const label = b.label.trim() || "none";
                return { label, url, color: b.color };
            });
            this.close();
            this.onSubmit(processed, this.width, this.height, this.btnSize, this.defaultColor);
        };
    }
    renderButtons() {
        this.btnListEl.empty();
        this.buttons.forEach((btn, idx) => {
            const row = this.btnListEl.createDiv({ cls: "webblock-modal-btn-row" });
            row.style.display = "flex";
            row.style.gap = "0.5em";
            row.style.marginBottom = "0.5em";
            // Label input
            const labelInput = row.createEl("input", { type: "text", placeholder: "Label", value: btn.label });
            labelInput.style.flex = "1";
            labelInput.oninput = e => {
                this.buttons[idx].label = e.target.value;
            };
            // URL input
            const urlInput = row.createEl("input", { type: "text", placeholder: "URL", value: btn.url });
            urlInput.style.flex = "2";
            urlInput.oninput = e => {
                this.buttons[idx].url = e.target.value;
            };
            // Color input
            const colorInput = row.createEl("input", { type: "color", value: btn.color || "#000000" });
            colorInput.style.width = "40px";
            colorInput.oninput = e => {
                this.buttons[idx].color = e.target.value;
            };
            // Remove button
            const removeBtn = row.createEl("button", { text: "×" });
            removeBtn.style.width = "25px";
            removeBtn.onclick = () => {
                this.buttons.splice(idx, 1);
                this.renderButtons();
            };
        });
    }
}
class WebBlockPlugin extends obsidian.Plugin {
    async onload() {
        this.addCommand({
            id: "insert-web-button-block",
            name: "Insert Web Button Block",
            callback: () => {
                new WebButtonModal(this.app, (buttons, width, height, btnSize, defaultColor) => {
                    const buttonsJson = JSON.stringify(buttons, null, 2);
                    const snippet = `\`\`\`webblock
${buttonsJson}
width=${width}
height=${height}
buttonSize=${btnSize}
defaultColor=${defaultColor}
\`\`\``;
                    const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
                    if (!view)
                        return;
                    view.editor.replaceRange(snippet, view.editor.getCursor());
                }).open();
            }
        });
        this.registerMarkdownCodeBlockProcessor("webblock", (source, el) => {
            try {
                const lines = source.trim().split("\n");
                // Parse optional settings lines
                const width = lines.find(l => l.startsWith("width="))?.split("=")[1] ?? "100%";
                const height = lines.find(l => l.startsWith("height="))?.split("=")[1] ?? "500px";
                const buttonSize = lines.find(l => l.startsWith("buttonSize="))?.split("=")[1] ?? "medium";
                const defaultColor = lines.find(l => l.startsWith("defaultColor="))?.split("=")[1] ?? "#007bff";
                // JSON lines = all except settings lines
                const jsonLines = lines.filter(l => !l.startsWith("width=") && !l.startsWith("height=") && !l.startsWith("buttonSize=") && !l.startsWith("defaultColor="));
                const jsonStr = jsonLines.join("\n");
                const buttons = JSON.parse(jsonStr);
                // Container for buttons
                const buttonContainer = el.createDiv();
                buttonContainer.style.display = "flex";
                buttonContainer.style.flexWrap = "wrap";
                buttonContainer.style.gap = "10px";
                buttonContainer.style.marginBottom = "10px";
                // Define button size styles
                const sizeStyles = {
                    small: "padding:4px 8px; font-size:0.75rem;",
                    medium: "padding:8px 16px; font-size:1rem;",
                    large: "padding:12px 24px; font-size:1.25rem;"
                };
                // Create iframe
                const iframe = el.createEl("iframe", {
                    attr: {
                        style: `width: ${width}; height: ${height}; border: 1px solid #ccc;`,
                    }
                });
                for (const btn of buttons) {
                    const button = buttonContainer.createEl("button", { text: btn.label });
                    button.style.cssText = sizeStyles[buttonSize] + ` background-color: ${btn.color ?? defaultColor}; color: white; border:none; border-radius:4px; cursor:pointer;`;
                    button.onclick = () => {
                        iframe.setAttr("src", btn.url);
                    };
                }
            }
            catch (e) {
                el.createEl("pre", { text: "Invalid webblock format:\n" + String(e) });
            }
        });
    }
}

module.exports = WebBlockPlugin;
