#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use lazy_static::lazy_static;
use regex::Regex;

#[derive(serde::Deserialize, serde::Serialize)]
enum TokenError {
    ReqError(String),
}

#[tauri::command]
async fn get_token() -> Option<String> {
    if let Ok(mut resp) = reqwest::get("https://osu.ppy.sh/home").await {
        while let Ok(Some(chunk)) = resp.chunk().await {
            lazy_static! {
                static ref TOKEN_REGEX: Regex =
                    Regex::new(r#"<meta name="csrf-token" content="(.*?)">"#).unwrap();
            }

            let chunk_string = String::from_utf8(
                chunk.to_vec()
            ).unwrap();

            if let Some(captures) = TOKEN_REGEX.captures(&chunk_string) {
                if let Some(capture) = captures.get(1) {
                    return Some(capture.as_str().to_string());
                }
            }
        }
    }

    None
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_token])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
