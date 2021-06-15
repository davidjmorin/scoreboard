# Import module 
from tkinter import *
import os
import subprocess

# check if 
if os.environ.get('DISPLAY','') == '':
    print('no display found. Using :0.0')
    os.environ.__setitem__('DISPLAY', ':0.0')

def save_info():
    gameUrl_info = gameUrl.get()
    
    
    
    print(gameUrl_info)

    file = open("/var/www/html/scoreboard/dataUrl.txt", "w")
    file.write(gameUrl_info)

    file.close()

    gameUrl_entry.delete(0, END)

    #subprocess.run('/var/www/html/scoreboard/kiosk.sh', shell=True, check=True, timeout=10)
    os.popen('sh /home/pi/start.sh')
    os.popen('sh /home/pi/start2.sh') 
    #os.popen("screen -dmS loopdeedoop bash -c '/home/pi/start.sh; exec sh'")
    #os.popen("screen -dmS boopdeeloop bash -c '/home/pi/start2.sh; exec sh'")
    os.popen('sh /var/www/html/scoreboard/kiosk.sh') 
    
    root.destroy()
  
  
# Create object 
root = Tk()
  
# Adjust size 
#root.geometry("400x400")
root.geometry('+200+200')
root.title("Live Game URL")  
# Add image file
root.configure(background='black')
bg = PhotoImage(file = "/var/www/html/scoreboard/assets/images/cricketLogo.png")

# Create Canvas
canvas1 = Canvas( root, width = 900,
                 height = 400, bd=2, highlightthickness=1, borderwidth=1, highlightbackground="black")
  
canvas1.pack(fill = "both", expand = True)
gameUrl_text = Label(text = "Game Live URL: ",)
gameUrl_text.place(x = 255, y = 260)
gameUrl_text.config(bg="black")
gameUrl_text.config(fg="white")

helpText = Label(text = "After you enter the URL, Click the Scoreboard desktop Icon to open the scoreboard. ",)
helpText.place(x = 165, y = 340)
helpText.config(bg="black")
helpText.config(fg="white")

# Display image
canvas1.create_image( 220, 5, image = bg, 
                     anchor = "nw")

canvas1.config(bg="black")

gameUrl = StringVar()
gameUrl_entry = Entry(textvariable = gameUrl, width = "40")
gameUrl_entry.place(x = 250, y = 280)


# Create Buttons
button1 = Button( root, text = "Submit", command = save_info)

# Display Buttons
button1_canvas = canvas1.create_window( 425, 320, window = button1)
  
  
# Execute tkinter
root.mainloop()