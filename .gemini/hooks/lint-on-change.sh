#!/usr/bin/env bash

# Read the input from Gemini CLI via stdin
input=$(cat)

# Extract the file path using jq
# Use // empty to avoid "null" string
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# If FILE_PATH is empty, try 'path' (some tools use that)
if [ -z "$file_path" ] || [ "$file_path" == "null" ]; then
    file_path=$(echo "$input" | jq -r '.tool_input.path // empty')
fi

# Log the received path for debugging (to stderr)
echo "Hook received file_path: $file_path" >&2

# If the path is absolute, make it relative to GEMINI_PROJECT_DIR if possible
if [[ "$file_path" == /* ]] && [[ -n "$GEMINI_PROJECT_DIR" ]]; then
    file_path="${file_path#$GEMINI_PROJECT_DIR/}"
fi

# Also handle cases where file_path might start with ./
file_path="${file_path#./}"

# Determine the project from the file path and run the respective lint command
# We use regex matching to handle nested paths better
case "$file_path" in
    *barista/*)
        echo "File changed in barista ($file_path). Running ESLint..." >&2
        (cd barista && npm run lint) >&2
        ;;
    *mindset-service/*)
        echo "File changed in mindset-service ($file_path). Running Ruff..." >&2
        (cd mindset-service && ruff check .) >&2
        ;;
    *origin-service/*)
        echo "File changed in origin-service ($file_path). Running golangci-lint..." >&2
        (cd origin-service && golangci-lint run) >&2
        ;;
    *press-service/*)
        echo "File changed in press-service ($file_path). Running ESLint..." >&2
        (cd press-service && npm run lint) >&2
        ;;
    *)
        echo "File $file_path does not belong to a known microservice or has no lint setup." >&2
        ;;
esac

# Return a valid JSON object to stdout as required by the hook interface
echo '{"decision": "allow"}'
exit 0
