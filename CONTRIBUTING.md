cd ~/Desktop/004/omni-stellar-omni-stellar-scavenger

# Backup
cp CONTRIBUTING.md CONTRIBUTING.md.bak

python3 - << 'PY'
import re

p = 'CONTRIBUTING.md'
src = open(p).read()

# 1) Replace the "Getting Started / Setup" section body with a pointer
pattern = r"## Getting Started / Setup\n(.*?)(?=\n## )"
replacement = (
    "## Getting Started / Setup\n\n"
    "The single authoritative setup guide is **[docs/getting-started.md](docs/getting-started.md)**.\n\n"
    "It covers prerequisites, clone + install, environment variables, running the stack "
    "(Docker Compose or direct), verification, per-service commands, and troubleshooting.\n\n"
    "When setup steps change, update that file — not this one.\n\n"
)
new, n = re.subn(pattern, replacement, src, count=1, flags=re.S)
print(f"Replaced Getting Started section (matched {n} time(s))")

# 2) Remove the trailing conflicting "## Local Setup" block
new = re.sub(
    r"\n## Local Setup\n\nSee \[docs/getting-started\.md\]\(docs/getting-started\.md\)\.\n?$",
    "\n",
    new,
)

# 3) Safety net: strip any leftover conflict markers
new = re.sub(r"^<{7} .*\n", "", new, flags=re.M)
new = re.sub(r"^={7}\n", "", new, flags=re.M)
new = re.sub(r"^>{7} .*\n", "", new, flags=re.M)

open(p, 'w').write(new)
print("CONTRIBUTING.md rewritten")
PY

rm -f CONTRIBUTING.md.bak