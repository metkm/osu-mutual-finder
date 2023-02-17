#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, WindowEvent};
use window_shadows::set_shadow;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let Some(window) = app.get_window("main") else {
                return Ok(())
            };

            if set_shadow(&window, true).is_err() {
                println!("error while adding shadow to main window");
            }

            window.on_window_event(|event| {
                match event {
                    WindowEvent::Resized(..) => {
                        std::thread::sleep(std::time::Duration::from_micros(500)) // 0.5ms
                    }
                    _ => {}
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
