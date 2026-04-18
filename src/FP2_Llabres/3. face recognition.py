import cv2
import os

def load_names(filename='names.txt'):
    names = {}
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            for line in f:
                try:
                    id_str, name = line.strip().split(',', 1)
                    names[int(id_str)] = name
                except ValueError:
                    continue
    return names

def recognize_faces():
    names = load_names()  # Load names from names.txt
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read('./trainer/trainer.yml')
    detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    cam = cv2.VideoCapture(0)
    cam.set(3, 640)
    cam.set(4, 480)

    while True:
        ret, img = cam.read()
        if not ret:
            print("[ERROR] Failed to grab frame")
            break

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = detector.detectMultiScale(gray, 1.2, 5)

        for (x, y, w, h) in faces:
            cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)
            id, conf = recognizer.predict(gray[y:y+h, x:x+w])

            if conf < 100:
                name = names.get(id, "Unknown")
                conf_text = f"{round(100 - conf)}%"
            else:
                name = "Unknown"
                conf_text = ""

            cv2.putText(img, name, (x+5, y-5), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
            if conf_text:
                cv2.putText(img, conf_text, (x+5, y+h-5), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,0), 1)

        cv2.imshow('Face Recognition', img)
        if cv2.waitKey(10) & 0xff == 27:  # ESC to exit
            break

    cam.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    recognize_faces()
