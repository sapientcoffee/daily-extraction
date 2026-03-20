#!/usr/bin/env bash

# Read the input from Gemini CLI via stdin
input=$(cat)

# Extract the file path using jq
file_path=$(echo "$input" | jq -r '.tool_input.file_path')

# If the path is absolute, make it relative to GEMINI_PROJECT_DIR if possible
if [[ "$file_path" == /* ]]; then
    file_path="${file_path#$GEMINI_PROJECT_DIR/}"
fi

# Determine the project from the file path and run the respective lint command
case "$file_path" in
    barista/*)
        echo "File changed in barista. Running ESLint..." >&2
        (cd barista && npm run lint) >&2
        ;;
    mindset-service/*)
        echo "File changed in mindset-service. Running Ruff..." >&2
        (cd mindset-service && ruff check .) >&2
        ;;
    origin-service/*)
        echo "File changed in origin-service. Running golangci-lint..." >&2
        (cd origin-service && golangci-lint run) >&2
        ;;
    press-service/*)
        echo "File changed in press-service. Running ESLint..." >&2
        (cd press-service && npm run lint) >&2
        ;;
    *)
        echo "File $file_path does not belong to a known microservice or has no lint setup." >&2
        ;;
esac

# Return a valid JSON object to stdout as required by the hook interface
echo "{}"
exit 0
