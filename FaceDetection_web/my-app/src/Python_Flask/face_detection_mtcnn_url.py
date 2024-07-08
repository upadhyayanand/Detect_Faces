# face_detection_mtcnn_url.py
from flask import Flask, request, send_file
import cv2
import numpy as np
import requests
from mtcnn.mtcnn import MTCNN
from io import BytesIO
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

detector = MTCNN()

def download_image(url):
    response = requests.get(url)
    image = np.asarray(bytearray(response.content), dtype="uint8");
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image

def draw_faces(img, faces_list):
    for face in faces_list:
        x, y, width, height = face['box']
        cord_x = x + width
        cord_y = y + height
        cv2.rectangle(img, (x, y), (cord_x, cord_y), (0, 255, 0), 4)
    return img

@app.route('/detect_faces', methods=['POST'])
def detect_faces():
    data = request.json
    image_url = data['image_url']
    img = download_image(image_url)
    faces = detector.detect_faces(img)
    img_with_faces = draw_faces(img, faces)
    _, buffer = cv2.imencode('.jpg', img_with_faces)
    io_buf = BytesIO(buffer)
    return send_file(io_buf, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
