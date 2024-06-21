use super::*;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub(crate) struct Config {
  store: String,
}

impl Config {
  const FILENAME: &'static str = "config.json";

  pub(crate) fn load() -> Result<Self> {
    let directory = Self::directory()?;

    let file = directory.join(Self::FILENAME);

    if file.exists() {
      return Ok(serde_json::from_str::<Self>(&fs::read_to_string(file)?)?);
    }

    Ok(Self {
      store: directory.to_string_lossy().to_string(),
    })
  }

  pub(crate) fn save(&self) -> Result {
    let directory = Self::directory()?;

    fs::write(
      directory.join(Self::FILENAME),
      serde_json::to_string_pretty(self)?,
    )?;

    Ok(())
  }

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
