use super::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone, Copy)]
#[serde(rename_all = "kebab-case")]
#[typeshare]
pub enum Model {
  Gpt35Turbo,
  Gpt35Turbo16k,
  Gpt4,
  Gpt432k,
  Gpt41106Preview,
}

impl Default for Model {
  fn default() -> Self {
    Model::Gpt35Turbo
  }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub(crate) struct Config {
  model: Option<Model>,
  open_ai_api_key: Option<String>,
  store: String,
}

impl Config {
  const FILENAME: &'static str = "config.json";

  /// Load the configuration from the file system.
  ///
  /// If the configuration file does not exist, it will be created with default values.
  pub(crate) fn load() -> Result<Self> {
    let directory = Self::directory()?;

    let file = directory.join(Self::FILENAME);

    if file.exists() {
      return Ok(serde_json::from_str::<Self>(&fs::read_to_string(file)?)?);
    }

    Ok(Self {
      model: Some(Model::default()),
      open_ai_api_key: None,
      store: directory.to_string_lossy().to_string(),
    })
  }

  /// Save the configuration to the file system.
  ///
  /// This will overwrite the existing configuration file.
  pub(crate) fn save(&self) -> Result {
    let directory = Self::directory()?;

    fs::write(
      directory.join(Self::FILENAME),
      serde_json::to_string_pretty(self)?,
    )?;

    Ok(())
  }

  /// Get the configuration directory.
  ///
  /// The directory is created if it does not exist.
  fn directory() -> Result<PathBuf> {
    let directory = tauri::api::path::config_dir()
      .ok_or(Error::Io(io::Error::new(
        NotFound,
        "Unable to find config directory",
      )))?
      .join(env!("CARGO_PKG_NAME"));

    if !directory.exists() {
      fs::create_dir_all(&directory)?;
    }

    Ok(directory)
  }
}
