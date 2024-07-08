// httpReq.js
import axios from "axios";

async function detectFaces(imageUrl) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/detect_faces",
      {
        image_url: imageUrl,
      },
      {
        responseType: "arraybuffer",
      }
    );

    // Convert the ArrayBuffer to a Blob
    const blob = new Blob([response.data], { type: "image/jpg" });

    // Create an Object URL from the Blob
    const imageObjectUrl = URL.createObjectURL(blob);

    console.log("Face detection completed.");
    return imageObjectUrl; // Return the Object URL for use in React component
  } catch (error) {
    console.error("Error detecting faces:", error);
    throw error; // Re-throw error for handling in the React component
  }
}

export { detectFaces };
