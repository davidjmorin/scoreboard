from tkinter import *
import os

def save_info():
    urlInfo = URL_Text.get()
    
    print(urlInfo)
    
    file = open("match.txt","w")
    
    file.write(urlInfo)
    file.close()
    
    os.popen('sh /home/pi/start.sh')
    os.popen('sh /home/pi/start2.sh')
    app.destroy()

   
app = Tk()

app.geometry("500x300+400+300")

app.title("MSCL Scoreboard")

app.config(bg="black")

URL = Label(text="Match URL:")
URL.config(fg="white")
URL.config(bg="black")
URL.place(x=15,y=70)
URL_Text = StringVar()

URL_box = Entry(textvariable=URL_Text,width="50")
URL_box.place(x=15,y=100)
button = Button(app,text="Submit URL",command=save_info,width="20",height="2",bg="grey")
button.place(x=140,y=140)

mainloop()