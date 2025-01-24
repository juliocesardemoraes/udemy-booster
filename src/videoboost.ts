import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ffmpeg from "fluent-ffmpeg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const videosFolder = path.join(__dirname, "videos");
const boostedFolder = path.join(__dirname, "boosted");

fs.readdir(videosFolder, (err, files) => {
  if (err) {
    console.error("Error reading the videos folder:", err);
    return;
  }

  files.forEach((file) => {
    const fullFilePath = path.join(videosFolder, file);

    if (path.extname(file) === ".mp4") {
      const sourceName = path.basename(file, path.extname(file));
      const boostedFileName = `${sourceName}_boosted.mp4`;
      const boostedFilePath = path.join(boostedFolder, boostedFileName);

      if (fs.existsSync(boostedFilePath)) {
        console.log(`Skipped: ${boostedFileName} already exists.`);
        return;
      }

      ffmpeg(fullFilePath)
        .audioFilters("volume=15dB")
        .videoCodec("copy")
        .output(boostedFilePath)
        .on("start", () => console.log(`Processing: ${file}`))
        .on("error", (err) => console.error(`Error processing ${file}:`, err))
        .on("end", () =>
          console.log(`Successfully boosted: ${boostedFileName}`)
        )
        .run();
    }
  });
});
