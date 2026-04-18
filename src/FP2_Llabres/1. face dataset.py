import cv2
import os

#  Create dataset directory if it doesn't exist
if not os.path.exists('dataset'):
    os.makedirs('dataset')

#  Create names.txt if it doesn't exist
if not os.path.exists('names.txt'):
    with open('names.txt', 'w') as f:
        pass  

cam = cv2.VideoCapture(0)
cam.set(3, 640)
cam.set(4, 480)

face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

if not cam.isOpened():
    print("Error: Could not open camera.")
    exit()
if face_detector.empty():
    print("Error: Could not load face detector.")
    exit()

face_id = input('\n[INPUT] Enter user ID (number) and press <return>: ')
name = input('[INPUT] Enter name of the person: ')

# Append the name to names.txt
with open('names.txt', 'a') as f:
    f.write(f"{face_id},{name}\n")

print("\n[INFO] Initializing face capture. Look at the camera and wait ...")
count = 0

while True:
    ret, img = cam.read()
    if not ret:
        print("Failed to grab frame")
        break

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_detector.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
        count += 1
        filename = f"dataset/image.{face_id}.{count}.jpg"
        success = cv2.imwrite(filename, gray[y:y+h, x:x+w])
        if success:
            print(f"[INFO] Saved: {filename}")
        else:
            print(f"[ERROR] Failed to save image: {filename}")

        cv2.imshow('image', img)

    k = cv2.waitKey(100) & 0xff
    if k == 27:
        break
    elif count >= 20:
        break

print("\n[INFO] Exiting Program and cleaning up")
cam.release()
cv2.destroyAllWindows()
