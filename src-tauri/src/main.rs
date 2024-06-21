#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use {
  config::Config,
  error::{Error, Result},
  serde::{ser::Serializer, Deserialize, Serialize},
  std::{
    fs,
    io::{self, ErrorKind::NotFound},
    path::PathBuf,
  },
  tauri::command,
  typeshare::typeshare,
};

mod config;
mod error;

#[command]
fn load_config() -> Result<Config> {
  Config::load()
}

#[command]
fn save_config(config: Config) -> Result {
  config.save()
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![load_config, save_config])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
