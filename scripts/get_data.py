import wget
import datetime
import s3
import yaml
import os
import errno
from pathlib import Path 
import requests

def get_data():
	# Every file is ogranized like 
	# https://s3.amazonaws.com/nyc-tlc/trip+data/[color]_tripdata_[year]-[month].csv
	# where color can be fhv, green or yellow and the year goes back to 2009

	# Checks to see if the file is containing Zones exists. If it doesn't exist 
	# the file is downloaded or else the current one is kept. Change funcionality
	# to  replace old file?
	try:
		dataFile = Path("data/taxi+_zone_lookup.csv")
		absPath = dataFile.resolve()	
	except OSError as e:
		if e.errno == errno.ENOENT:
			wget.download("https://s3.amazonaws.com/nyc-tlc/misc/taxi+_zone_lookup.csv", out="taxi+_zone_lookup.csv")
	else:
		pass
	#	Every combination of color, year, and month a file could contain
	now = datetime.datetime.now()
	for year in range(2009, now.year):
		colors = ["fhv", "green", "yellow"]
		for month in ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]:
			for color in colors:
				# Key is created
				key = color+"_tripdata_"+str(year)+"-"+month+".csv"
				# Checks if file has been downloaded
				try:
					dataFile = Path("data/"+key)
					absPath = dataFile.resolve()
					print(key+" already exists")
				# The file is downloaded
				except OSError as e:
					if e.errno == errno.ENOENT:
						# Makes sure there is a csv file for the address
						if requests.head("https://s3.amazonaws.com/nyc-tlc/trip+data/"+key).status_code == 200:
							print("this worked  "+key)	
							wget.download("https://s3.amazonaws.com/nyc-tlc/trip+data/"+key, out=key)	

			
get_data()