# Getting Started

This is the single authoritative guide for setting up omni-stellar-omni-stellar-scavenger locally.
If you find setup instructions elsewhere in the repo, treat them as
outdated pointers to this file.

- **Last reviewed:** see git history
- **Scope:** local development only. Deployment is covered in
  [DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md).

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Clone and install](#clone-and-install)
3. [Environment variables](#environment-variables)
4. [Running the stack](#running-the-stack)
5. [Verifying your setup](#verifying-your-setup)
6. [Per-service commands](#per-service-commands)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Why |
|------|---------|-----|
| Node.js | 18+ | frontend, indexer, tooling |
| pnpm or npm | latest | package manager (see repo root `packageManager`) |
| Rust | stable (see `rust-toolchain.toml`) | smart contracts, backend |
| Docker + Compose | latest | local Postgres, Redis, Stellar standalone |
| Stellar CLI (`stellar`) | latest | deploy contract, invoke functions |
| Git | any recent | obviously |

Install per your OS. Verify with:

```bash
node --version
pnpm --version  # or: npm --version
rustc --version
docker --version
stellar --version
