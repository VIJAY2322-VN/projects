import cv2
import mediapipe as mp
import numpy as np
from vpython import sphere, vector, rate, canvas

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1)
mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

scene = canvas(title='3D Hand Controlled Ball')
ball = sphere(pos=vector(0, 0, 0), radius=0.5, color=vector(1, 0, 0))

while True:
    rate(60)
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    if results.multi_hand_landmarks:
        for handLms in results.multi_hand_landmarks:
            lm = handLms.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]
            h, w, c = frame.shape
            cx, cy = int(lm.x * w), int(lm.y * h)
            ball.pos = vector((lm.x - 0.5)*10, -(lm.y - 0.5)*10, 0)
            mp_draw.draw_landmarks(frame, handLms, mp_hands.HAND_CONNECTIONS)

    cv2.imshow("Hand Tracking", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()