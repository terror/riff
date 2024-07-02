set dotenv-load

alias d := dev
alias f := fmt
alias t := test

export EDITOR := 'nvim'

default:
  just --list

dev:
  bun run tauri dev

fmt:
  cd src-tauri && cargo fmt
  prettier --write .

test:
  bun test

typeshare:
  typeshare -l typescript -o src/lib/types.ts src-tauri
