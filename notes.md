Page 1
-----------

List of city/location
http://localhost:8000/locations

List of QuickSearch/mealTypes
http://localhost:8000/quicksearch

List of restaurants
http://localhost:8000/restaurantsList


List of restaurants wrt city
http://localhost:8000/restaurants?state_id=5


Page 2
-----------

List of restautrant wrt mealType
http://localhost:8000/restaurants?mealtype_id=3


List of restaurant wrt cuisine & meal
http://localhost:8000/restaurants/Breakfast?cuisineId=3

List of restaurant wrt cost & meal
http://localhost:8000/restaurants/Breakfast?lcost=500&hcost=800

sort on basis of cost
http://localhost:8000/restaurants/Breakfast?lcost=500&hcost=800&sort=-1

Page 3
--------

Details of restaurant
http://localhost:8000/details/3

Menu of restaurant
http://localhost:8000/menu/1


Page 4 - selection of items
--------
Menu Details (POST)
// menu items is in form of array [3, 5, 10]
// check whether it is in array form
// check whther "$in" menu list

http://localhost:8000/menuitems


PlaceOrders (POST)
http://localhost:8000/placeorders


Page 5
------------

List of orders
http://localhost:8000/orders


List of orders wrt to email
http://localhost:8000/order?email=john@gmail.com


Update payment details (PUT)
http://localhost:8000/updateorders/2


delete orders (DELETE)
http://localhost:8000/deleteorders/4

-------------------------------------------
CRUD 
    C - Create - POST 
    R - Read - GET 
    U - Update - PUT 
    D - Delete - DELETE