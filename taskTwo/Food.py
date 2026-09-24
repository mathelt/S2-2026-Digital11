from datetime import
import requests
barcode = 3017624010701
#input("Barcode")
url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"
response = requests.get(url)


data = response.json()
