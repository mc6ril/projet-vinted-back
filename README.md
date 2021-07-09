# projet-vinted-back

1. Install all npm with : $ npm i

/user/signup (POST)
Create a new user

Body Type Required
email string Yes
password string Yes
username string Yes
phone string No

/user/login (POST)
Log a user

Body Type Required
email string Yes
password string Yes

/reset-users (GET)
This route resets the user database. Do not consider it.

Offer
/offers/ (GET)
Receive a list of offers. Possibility to filter the results.

Query Required Description
title No get a list of offers that contain title
priceMin No get offers above priceMin
priceMax No get offers below priceMax
sort No date-asc : get a list of offers sort by ascending dates
date-desc: get a list of offers sort by descending dates
price-asc: get a list of offers sort by ascending prices
price-desc: get a list of offers sort by descending prices
page No set the results page
limit No set the limit of results

/offer/:id (GET)
Get an offer

Param Required Description
id Yes offer id

/offer/publish (POST)
Create a new offer

formData Required Description
title Yes offer title
description Yes product description
price Yes product price
brand Yes product brand
size Yes product size
condition Yes product condition
color Yes offer color
city Yes the city in which the offer is located
picture Yes product picture
Headers Required Description
Bearer token Yes user token

/offer/update/:id (PUT)
Update an offer

Param Required Description
id Yes offer id
formData Required Description
title No offer title
description No product description
price No product price
brand No product brand
size No product size
condition No product condition
color No offer color
city No the city in which the offer is located
picture No product picture
Headers Required Description
Bearer token Yes user token

/offer/delete/:id (DELETE)
Delete an offer

Param Required Description
id Yes offer id
Headers Required Description
Bearer token Yes user token
