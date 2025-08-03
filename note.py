import time
import keyboard
import os

player_pos = 5
enemies = [15, 20, 25]
time_stopped = False

def draw():
    os.system('cls' if os.name == 'nt' else 'clear')
    line = [' '] * 30
    line[player_pos] = 'P'
    for e in enemies:
        if 0 <= e < len(line):
            line[e] = 'E'
    print(''.join(line))
    print("[T] Toggle Time | [A] Left | [D] Right")

while True:
    # Điều khiển người chơi
    if keyboard.is_pressed('a') and player_pos > 0:
        player_pos -= 1
    elif keyboard.is_pressed('d') and player_pos < 29:
        player_pos += 1

    # Bật/tắt thời gian
    if keyboard.is_pressed('t'):
        time_stopped = not time_stopped
        print(">> Thời gian " + ("ngưng lại!" if time_stopped else "tiếp tục!"))
        time.sleep(0.3)  # tránh spam phím quá nhanh

    # Cập nhật enemy nếu thời gian không bị ngưng
    if not time_stopped:
        enemies = [e - 1 for e in enemies if e - 1 > 0]

    draw()
    time.sleep(0.2)
