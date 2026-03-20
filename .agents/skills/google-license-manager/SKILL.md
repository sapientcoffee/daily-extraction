---
name: google-license-manager
description: "Reviews codebase files and inserts the correct Google license headers (Apache 2.0 or SPDX) based on Google guidelines."
---

# License Manager Skill

This skill automates the insertion of Google-standard license headers. It supports the full Apache 2.0 header for major source files and the short SPDX header for snippets or specific internal use cases.

## Guidance
*   **Long Version:** Use the full Apache 2.0 block for most Google-authored source files (see go/releasingoss).
*   **Short Version:** Use for internal snippets (< 100 lines) or where specified by the project (see go/patching#snippets).
*   **Copyright Notice:** Must be `Copyright [YEAR] Google LLC` on a single line. Replace `[YEAR]` with the year of first publication.

## Workflow

1.  **Codebase Review:**
    *   Recursively scan the directory for source files (`.py`, `.go`, `.java`, `.cc`, `.ts`, `.js`, `.sh`).
    *   Identify files missing a copyright notice or license header.

2.  **Header Selection:**
    *   Ask the user if they want the **Long (Apache 2.0)** or **Short (SPDX)** version.
    *   Default to Long for files > 100 lines and Short for smaller snippets unless overridden.

3.  **Insertion:**
    *   Insert the header at the very top of the file.
    *   If a shebang (`#!`) exists (e.g., in Python or Shell), insert the header immediately *after* the shebang.
    *   Use correct comment syntax for the language:
        *   `//` or `/* */` for C++, Java, Go, TypeScript.
        *   `#` for Python, Shell, YAML.

4.  **Verification:**
    *   Confirm the files modified.

## Templates

### Long (Apache 2.0)

```
Copyright [YEAR] Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

### Short (SPDX)
```
Copyright [YEAR] Google LLC.
SPDX-License-Identifier: Apache-2.0
```
