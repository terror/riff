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
  prettier --write .

test:
  bun test
