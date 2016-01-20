from Tkinter import *
import math
import random

import paho.mqtt.client as mqtt

class App(object):
	"""Test-GUI to fake distance measurings of a WSN"""
	def __init__(self):
		super(App, self).__init__()
		self.root = Tk()
		self.stations = [(10,14), (790, 14), (400, 590)]
		self.point = (800/2-8, 600/2-8)
		self.curPos = None
		self.errorRate = 0.2
		self.client = mqtt.Client()

	def run(self):
		self.client.on_connect = self.on_connect
		self.client.on_message = self.on_message
		self.client.connect("localhost", 1883, 60)
		self.client.loop_start()
		self.ui()
		self.root.mainloop()

	# The callback for when the client receives a CONNACK response from the server.
	def on_connect(self, client, userdata, flags, rc):
		print("Connected with result code "+str(rc))

		# Subscribing in on_connect() means that if we lose the connection and
		# reconnect then subscriptions will be renewed.
		# client.subscribe("$SYS/#")

	# The callback for when a PUBLISH message is received from the server.
	def on_message(self, client, userdata, msg):
		print(msg.topic+" "+str(msg.payload))

	def ui(self):
		self.root.title("Indoor Location GUI")
		self.head = Frame(self.root, relief=SUNKEN, bd=1)
		Label(self.head, text="Distances:").pack(side=LEFT)
		self.distance = StringVar()
		self.distance.set(self.positionString())
		self.distanceLabel = Label(self.head, textvariable=self.distance)
		self.distanceLabel.pack(side=LEFT)
		# self.errorFrame = Frame(self.head)
		# Label(self.errorFrame, text="Error Rate:").pack(side=LEFT)
		# self.errorInput = Entry(self.errorFrame, text=str(self.errorRate))
		# self.errorInput.pack(side=RIGHT)
		# self.errorFrame.pack(side=RIGHT)
		self.canvas = Canvas(self.root, width=800, height=600)
		for station in self.stations:
			circle = self.circle(station[0], station[1], 8)
			#circle['fill'] = 'black'
		self.curPos = self.circle(self.point[0], self.point[1], 8)
		# self.canvas.create_oval(self.point[0]-8, self.point[1]-8, self.point[0]+8, self.point[1]+8, name="Point")
		self.head.pack(fill=X)
		self.canvas.pack()
		self.canvas.bind('<Button-1>', self.motion)

	def motion(self, event):
		self.canvas.delete(self.curPos)
		x, y = event.x, event.y
		self.point = (x,y)
		self.curPos = self.circle(self.point[0], self.point[1], 8)
		self.distance.set(self.positionString())

	def cDistance(self, p, q):
		return math.sqrt((p[0]-q[0])**2+(p[1]-q[1])**2)

	def circle(self, x, y, r):
		id = self.canvas.create_oval(x-r,y-r,x+r,y+r, fill="black")
		return id

	def errorify(self, dist):
		error = random.choice([-1,1]) * random.uniform(0, dist*self.errorRate)
		return dist+error

	def positionString(self):
		stri = ""
		i = 1
		for station in self.stations:
			dist = self.cDistance(self.point, station)
			distWithError = self.errorify(dist)
			self.client.publish("position/d%d" %(i), "%.2f" %distWithError)
			i += 1
			stri += "%.2f m, " %(dist)
		stri += "at (%.2f, %.2f)" %(self.point[0], self.point[1])
		return stri

if __name__ == '__main__':
	app = App()
	app.run()