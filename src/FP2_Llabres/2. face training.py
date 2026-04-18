import cv2
import numpy as np
from PIL import Image
import os


path = 'dataset'

if not os.path.exists('trainer'):
    os.makedirs('trainer')

#  Create LBPH face recognizer
recognizer = cv2.face.LBPHFaceRecognizer_create()

#  haarcascade path
detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

#  Function to get face samples and IDs
def getImagesAndLabels(path):
    imagePaths = [os.path.join(path, f) for f in os.listdir(path) if not f.startswith('.')]
    faceSamples = []
    ids = []

    for imagePath in imagePaths:
        # Convert image to grayscale
        PIL_img = Image.open(imagePath).convert('L')
        img_numpy = np.array(PIL_img, 'uint8')

        try:
            id = int(os.path.split(imagePath)[-1].split(".")[1])
        except ValueError:
            print(f"[WARNING] Skipping invalid file name: {imagePath}")
            continue

        faces = detector.detectMultiScale(img_numpy)
        for (x, y, w, h) in faces:
            faceSamples.append(img_numpy[y:y+h, x:x+w])
            ids.append(id)

    return faceSamples, ids

# Start training
print("\n[INFO] Training faces. This may take a few seconds...")
faces, ids = getImagesAndLabels(path)

recognizer.train(faces, np.array(ids))
recognizer.write('trainer/trainer.yml') 

print(f"\n[INFO] {len(np.unique(ids))} face(s) trained. Model saved in 'trainer/trainer.yml'")
