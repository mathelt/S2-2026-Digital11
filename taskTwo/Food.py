from datetime import date
import requests
barcode = 3033710065967 #3017624010701
special_products ={"Ferrero": 3033710065967, "Nutella": 3017624010701, "KitKat": 3033710065967 }
#3017624010701
url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}"
headers = {
   "User-Agent": "MyBarcodeApp/1.0 (mathelt@pedarecc.sa.edu.au)"
}

response = requests.get(url, headers=headers)
data = response.json()

def getProductInfo(barcode, overide):
    selected_barcode = barcode if barcode is not None else overide
    product_url = f"https://world.openfoodfacts.org/api/v2/product/{selected_barcode}"
    product_data = requests.get(product_url, headers=headers).json()

    product_name = product_data.get("product", {}).get("product_name", "Product name not found")
    ingredients = product_data.get("product", {}).get("ingredients_text_en", "Product name not found")
    nutriscore = product_data.get("product", {}).get("nutriscore_grade")
    sugar = product_data.get("product", {}).get("nutriments", {}).get("sugars_100g")
    carbohydrates = product_data.get("product", {}).get("nutriments", {}).get("carbohydrates_100g")
    return product_name, ingredients, nutriscore, sugar, carbohydrates

def selectBarcode():
    barcode = int(input("Please enter your chosen barcode (13 characters): "))
    if len(str(barcode))==13:
        Item = data.get("product", {}).get("product_name", "Barcode not found")
        if Item != "Barcode not found":
            print("Sucess")
        elif Item == "Barcode not found":
            print("Unsuccessful, please choose another barcode.")
            selectBarcode()
    return barcode

def get_recommendation(grade, sugars):
  if grade is not None:
      grade = grade.upper()
      if grade == "A":
          return "Nutri-Score A: Healthy choice!"
      elif grade == "B":
          return "Nutri-Score B: Good choice."
      elif grade == "C":
          return "Nutri-Score C: Okay in moderation."
      elif grade == "D":
          return "Nutri-Score D: Limit your intake."
      elif grade == "E":
          return "Nutri-Score E: Consume in moderation."
  if sugars is not None:
      if sugars <= 5:
          return f"Low sugar ({sugars} g/100g): Healthy choice!"
      elif sugars <= 22.5:
          return f"Moderate sugar ({sugars} g/100g): Okay in moderation."
      else:
          return f"High sugar ({sugars} g/100g): Consume in moderation."
  return "No Nutri-Score or sugar data available."

#A menu system
def print_menu():
  print("1. View Product Information")
  print("2. Enter your own barcode")
  print("3. Browse special Products")
  print("4. Carbohydrate Content")
  print("5. Exit")

def main():
  global barcode
  global special_products
  while True:
      print_menu()
      choice = input("Enter your choice: ")
      if choice == "1":
          product_name, ingredients, nutriscore, sugar = getProductInfo(barcode, 3033710065967)
          print(f"Product Name: {product_name}")
          print(f"Ingredients: {ingredients}")
          print(get_recommendation(nutriscore, sugar))
      elif choice == "2":
            barcode = selectBarcode()
      
      elif choice == "3":
          for product, code in special_products.items():
              product_name, ingredients, nutriscore, sugar = getProductInfo(None, code)
              print("")
              print(f"  Product: {product}")
              print(f"  Product Name: {product_name}")
              print(f"  Ingredients: {ingredients}")
              print(f"  Nutri-Score: {nutriscore}")
              print(f"  Sugar Content: {sugar} g/100g")
              print(f"  Recommendation: {get_recommendation(nutriscore, sugar)}")
              print("")
      elif choice == "4":
          carbohydrates = getProductInfo(barcode, 3033710065967)
          if carbohydrates >= 100:
                print(f"Carbohydrate Content: {carbohydrates} g/100g, consume in moderation.")
          else:
                print(f"Carbohydrate Content: {carbohydrates} g/100g, healthy choice!")
      elif choice == "5":
          break
      else:
          print("Invalid choice. Please try again.")

if __name__ == "__main__":
  main()


