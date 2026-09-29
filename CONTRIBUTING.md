cd ~/Desktop/004/omni-stellar-omni-stellar-scavenger

# Backup
cp CONTRIBUTING.md CONTRIBUTING.md.bak

# 1. Replace the Getting Started / Setup section body with a pointer
python3 - << 'PY'
import re

p = 'CONTRIBUTING.md'
src = open(p).read()

# Replace everything between "## Getting Started / Setup" and the next "## " heading
pattern = r"## Getting Started / Setup\n(.*?)(?=\n## )"
replacement = (
    "## Getting Started / Setup\n\n"
    "The single authoritative setup guide is **[docs/getting-started.md](docs/getting-started.md)**.\n\n"
    "It covers prerequisites, clone + install, environment variables, running the stack "
    "(Docker Compose or direct), verification, per-service commands, and troubleshooting.\n\n"
    "When setup steps change, update that file — not this one.\n\n"
)
new, n = re.subn(pattern, replacement, src, count=1, flags=re.S)
print(f"Replaced section (matched {n} time(s))")

# 2. Remove the trailing conflicting "## Local Setup" block if present
new = re.sub(r"\n## Local Setup\n\nSee \[docs/getting-started\.md\]\(docs/getting-started\.md\)\.\n?$", "\n", new)

# 3. Also remove any leftover conflict markers (safety net)
new = re.sub(r"^<{7} .*\n", "", new, flags=re.M)
new = re.sub(r"^={7}\n", "", new, flags=re.M)
new = re.sub(r"^>{7} .*\n", "", new, flags=re.M)

open(p, 'w').write(new)
print("CONTRIBUTING.md rewritten")
PY

rm -f CONTRIBUTING.md.bak