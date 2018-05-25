import wget
import datetime
import s3
import yaml
import os
import errno
from pathlib import Path 

def get_data():
	# Every file is ogranized like 
	# https://s3.amazonaws.com/nyc-tlc/trip+data/[color]_tripdata_[year]-[month].csv
	# where color can be fhv, green or yellow and the year goes back to 2009
	# s3 = boto3.resource("s3")
	now = datetime.datetime.now()
	colors = ["fhv", "green", "yellow"]
	# Creates the yaml connection
	with open('s3.yaml', 'r') as f:
		config = yaml.load(f)
	connection = s3.S3Connection(**config['s3'])
	# Creates the storage object
	storage = s3.Storage(connection)
	print(str(storage)+"\n \n \n \n") 
	# Checks to see if the file is containing Zones exists. If it doesn't exist 
	# the file is downloaded or else the current one is kept. Change funcionality
	# to replace old file?
	try:
		dataFile = Path("taxi+_zone_lookup.csv")
		absPath = dataFile.resolve()	
	except OSError as e:
		if e.errno == errno.ENOENT:
			wget.download("https://s3.amazonaws.com/nyc-tlc/misc/taxi+_zone_lookup.csv", out="taxi+_zone_lookup.csv")
	else:
		pass
	#	Every combination of color, year, and month a file could contain
	for year in range(2009, now.year):
		for month in ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]:
			for color in colors:
				# Key is created
				key = "trip+data/"+color+"_tripdata_"+str(year)+"-"+month+".csv"
#											  #
# This call of exist is just to see the error #
# 											  #
				exists = storage.exists(key)
				# Checks if the key works to download a file
				try:
					exists = storage.exists(key)
					print('A key exists')
				# The key doesn't work and it moves to the next key
				except:
					continue
				# The key does work and is downloaded
				wget.download("https://s3.amazonaws.com/nyc-tlc/"+key, out=("data--"+color+"--"+str(year)+"--"+month))	

			
get_data()