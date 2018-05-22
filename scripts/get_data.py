import wget


def get_data():
    # Every file is ogranized like 
    # https://s3.amazonaws.com/nyc-tlc/trip+data/[color]_tripdata_[year]-[month].csv
    # where color can be thc, green or yellow and the year goes back to 2009
    wget.download("https://s3.amazonaws.com/nyc-tlc/misc/taxi+_zone_lookup.csv", out="data")


get_data()
