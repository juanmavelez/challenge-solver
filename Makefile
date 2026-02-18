PROJECT_NAME := challenge_solver
ZIP_NAME := $(PROJECT_NAME).zip

.PHONY: all clean zip help run

all: zip

help:
	@echo "Usage:"
	@echo "  make zip    - Create a zip file for distribution (Chrome Web Store)"
	@echo "  make run    - Open Chrome Extensions page to load the UNPACKED extension"
	@echo "  make clean  - Remove the zip file"
	@echo "  make help   - Show this help message"

zip: clean
	@echo "Creating $(ZIP_NAME)..."
	zip -r $(ZIP_NAME) . -x "*.git*" "*.DS_Store" ".gitignore" "Makefile" "*.zip" "*.vscode*" "*.idea*" "node_modules*"
	@echo "Done! $(ZIP_NAME) created."
	@echo "NOTE: This zip file is for publishing/sharing. For development, load the folder directly."

run:
	@echo "Opening Chrome Extensions page..."
	@open -a "Google Chrome" "chrome://extensions" || echo "Could not open Chrome. Please open chrome://extensions manually."
	@echo "--------------------------------------------------------"
	@echo "1. Enable 'Developer mode' (toggle in top right)."
	@echo "2. Click 'Load unpacked' (top left)."
	@echo "3. Select this directory: $(CURDIR)"
	@echo "--------------------------------------------------------"
	@echo "Note: You do NOT use the .zip file for local development."

clean:
	@echo "Cleaning up..."
	rm -f $(ZIP_NAME)
