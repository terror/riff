use super::*;

#[derive(Debug, Deserialize, Serialize, Clone, Copy)]
#[serde(rename_all = "kebab-case")]
#[typeshare]
pub(crate) enum Model {
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
