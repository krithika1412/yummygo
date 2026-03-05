-- FOODIFY — Complete Database Seed Script (v2)
-- Run this in Supabase SQL Editor

-- 1. DROP OLD TABLES (fresh start)
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;

-- 2. CREATE TABLES
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cuisine TEXT,
  rating NUMERIC DEFAULT 4.0,
  address TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  total_tables INTEGER DEFAULT 20,
  available_tables INTEGER DEFAULT 20,
  is_featured BOOLEAN DEFAULT FALSE,
  discount_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'Main Course',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SEED RESTAURANTS (120+ across India)
INSERT INTO restaurants (name, description, image_url, cuisine, rating, address, city, state, phone, total_tables, available_tables, is_featured, discount_text) VALUES
-- Mumbai (12)
('The Bombay Canteen','Modern Indian cuisine with creative twist','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80','Modern Indian',4.8,'Kamala Mills, Lower Parel','Mumbai','Maharashtra','+91 22 4966 6666',30,25,TRUE,'20% OFF'),
('Leopold Cafe','Iconic cafe serving Continental & Indian since 1871','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80','Continental',4.3,'Colaba Causeway','Mumbai','Maharashtra','+91 22 2282 8185',25,18,FALSE,NULL),
('Trishna','Famous seafood restaurant known for butter garlic crab','https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&q=80','Seafood',4.7,'Fort','Mumbai','Maharashtra','+91 22 2270 3213',20,12,TRUE,'₹200 OFF'),
('Bademiya','Legendary street food kebab joint','https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80','Mughlai',4.4,'Tulloch Road, Apollo Bunder','Mumbai','Maharashtra','+91 22 2285 1649',15,10,FALSE,NULL),
('Bastian','Celebrity hotspot for seafood and Asian fare','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80','Seafood',4.6,'Bandra West','Mumbai','Maharashtra','+91 22 2600 3400',22,15,FALSE,'15% OFF'),
('Peshawri ITC Maratha','Award-winning North-West Frontier cuisine','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80','North Indian',4.8,'ITC Maratha, Andheri','Mumbai','Maharashtra','+91 22 2830 3030',18,8,TRUE,NULL),
('Cafe Madras','Authentic South Indian breakfast since 1940','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.5,'Matunga','Mumbai','Maharashtra','+91 22 2401 4419',12,9,FALSE,NULL),
('Hakkasan','Premium Cantonese fine dining','https://images.unsplash.com/photo-1526234362653-3b75a0c07438?w=400&q=80','Chinese',4.7,'Bandra West','Mumbai','Maharashtra','+91 22 2644 4444',25,20,TRUE,'₹500 OFF'),
('Swati Snacks','Legendary Gujarati street food and snacks','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Gujarati',4.4,'Tardeo','Mumbai','Maharashtra','+91 22 2351 4073',20,14,FALSE,NULL),
('The Table','Farm-to-table European dining','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80','Continental',4.6,'Colaba','Mumbai','Maharashtra','+91 22 2282 5000',16,10,FALSE,'10% OFF'),
('Mahesh Lunch Home','Legendary Mangalorean seafood','https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80','Seafood',4.5,'Fort','Mumbai','Maharashtra','+91 22 2287 0938',18,12,TRUE,NULL),
('Burma Burma','Burmese vegetarian cuisine','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80','Asian',4.5,'Fort','Mumbai','Maharashtra','+91 22 2207 8900',14,11,FALSE,NULL),

-- Delhi (12)
('Indian Accent','Award-winning inventive Indian fine dining','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80','Fine Dining',4.9,'The Lodhi, Lodhi Road','New Delhi','Delhi','+91 11 4323 5151',20,10,TRUE,NULL),
('Karim''s','Mughlai institution since 1913 near Jama Masjid','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Mughlai',4.6,'Jama Masjid, Old Delhi','New Delhi','Delhi','+91 11 2326 4981',30,22,TRUE,'₹150 OFF'),
('Bukhara','Iconic North Indian at ITC Maurya','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80','North Indian',4.8,'ITC Maurya, Sardar Patel Marg','New Delhi','Delhi','+91 11 2611 2233',18,6,TRUE,NULL),
('Paranthe Wali Gali','Historic lane of stuffed paranthas','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Street Food',4.2,'Chandni Chowk','New Delhi','Delhi','+91 11 2392 1234',10,8,FALSE,'Buy 1 Get 1'),
('SodaBottleOpenerWala','Irani cafe with Parsi comfort food','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80','Parsi',4.4,'Khan Market','New Delhi','Delhi','+91 11 2461 5890',20,15,FALSE,NULL),
('Moti Mahal','Original butter chicken inventors since 1947','https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80','North Indian',4.5,'Daryaganj','New Delhi','Delhi','+91 11 2327 3661',25,18,TRUE,'₹100 OFF'),
('Farzi Cafe','Molecular Indian cuisine','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80','Modern Indian',4.3,'Connaught Place','New Delhi','Delhi','+91 11 4517 2222',22,16,FALSE,NULL),
('Gulati','Iconic Pandara Road North Indian','https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80','North Indian',4.6,'Pandara Road','New Delhi','Delhi','+91 11 2338 7658',20,14,FALSE,'20% OFF'),
('Saravana Bhavan Delhi','South Indian vegetarian chain','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.3,'Connaught Place','New Delhi','Delhi','+91 11 2334 7755',28,20,FALSE,NULL),
('The Big Chill','Beloved Italian and dessert cafe','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80','Italian',4.4,'Khan Market','New Delhi','Delhi','+91 11 4175 7588',16,10,FALSE,NULL),
('Dhaba by Claridges','Highway dhaba-style premium dining','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Punjabi',4.5,'Claridges, Aurangzeb Road','New Delhi','Delhi','+91 11 3955 5000',18,12,TRUE,NULL),
('Wazwan by Marwah','Authentic Kashmiri wazwan feast','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80','Kashmiri',4.6,'Greater Kailash','New Delhi','Delhi','+91 11 4102 5678',14,10,FALSE,NULL),

-- Bangalore (10)
('MTR 1924','Heritage South Indian vegetarian since 1924','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80','South Indian',4.7,'Lalbagh Road','Bangalore','Karnataka','+91 80 2222 0022',20,14,TRUE,NULL),
('Toit Brewpub','Craft brewery and gastropub','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80','Continental',4.5,'Indiranagar','Bangalore','Karnataka','+91 80 4115 6238',30,22,FALSE,'30% OFF'),
('Vidyarthi Bhavan','Legendary dosa joint since 1943','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.6,'Gandhi Bazaar, Basavanagudi','Bangalore','Karnataka','+91 80 2667 7588',15,10,TRUE,NULL),
('Karavalli','Coastal Karnataka cuisine at the Taj','https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&q=80','Seafood',4.7,'Taj Gateway, Residency Road','Bangalore','Karnataka','+91 80 6660 4545',18,12,TRUE,NULL),
('Nagarjuna','Famous for Andhra-style meals and biryani','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','North Indian',4.4,'Residency Road','Bangalore','Karnataka','+91 80 2558 9999',22,16,FALSE,'₹100 OFF'),
('Fatty Bao','Contemporary Asian with rooftop vibes','https://images.unsplash.com/photo-1526234362653-3b75a0c07438?w=400&q=80','Asian',4.3,'Indiranagar','Bangalore','Karnataka','+91 80 4112 3456',16,12,FALSE,NULL),
('Brahmin''s Coffee Bar','Iconic idli-vada-coffee since 1965','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.5,'Shankarapuram, Basavanagudi','Bangalore','Karnataka','+91 80 2667 1234',8,6,FALSE,NULL),
('The Only Place','Classic steakhouse since 1965','https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80','Continental',4.4,'Museum Road','Bangalore','Karnataka','+91 80 2558 8676',14,10,FALSE,'15% OFF'),
('Truffles','Beloved burger and American diner','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80','American',4.3,'Koramangala','Bangalore','Karnataka','+91 80 4132 8765',20,15,FALSE,NULL),
('Ebony','Fine dining with city skyline views','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80','Fine Dining',4.6,'Barton Centre, MG Road','Bangalore','Karnataka','+91 80 4178 3344',16,8,TRUE,NULL),

-- Chennai (8)
('Dakshin','Premium South Indian at ITC Grand Chola','https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80','South Indian',4.7,'ITC Grand Chola, Guindy','Chennai','Tamil Nadu','+91 44 2220 0000',20,14,TRUE,NULL),
('Saravana Bhavan','World-famous South Indian vegetarian','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.3,'T Nagar','Chennai','Tamil Nadu','+91 44 2434 2588',30,24,TRUE,'15% OFF'),
('Peshawri Chennai','North-West Frontier at ITC Grand Chola','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80','North Indian',4.6,'ITC Grand Chola','Chennai','Tamil Nadu','+91 44 2220 0001',16,10,FALSE,NULL),
('Murugan Idli Shop','Famous for soft idlis with varieties of chutneys','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.4,'T Nagar','Chennai','Tamil Nadu','+91 44 2433 5511',18,14,FALSE,NULL),
('Anjappar','Famous Chettinad chicken and biryani','https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80','South Indian',4.3,'Anna Nagar','Chennai','Tamil Nadu','+91 44 2626 8989',20,16,FALSE,'₹100 OFF'),
('Copper Chimney','Multi-cuisine with North Indian focus','https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80','North Indian',4.4,'Cathedral Road','Chennai','Tamil Nadu','+91 44 2811 4455',18,12,FALSE,NULL),
('Zambar','Modern South Indian in eclectic setting','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80','South Indian',4.2,'RA Puram','Chennai','Tamil Nadu','+91 44 4202 2333',14,10,FALSE,NULL),
('Benjarong','Authentic Thai cuisine','https://images.unsplash.com/photo-1526234362653-3b75a0c07438?w=400&q=80','Thai',4.6,'Dakshin Hotel, Crowne Plaza','Chennai','Tamil Nadu','+91 44 2499 4101',12,8,TRUE,NULL),

-- Hyderabad (8)
('Paradise Biryani','Legendary Hyderabadi biryani since 1953','https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80','Hyderabadi',4.7,'MG Road, Secunderabad','Hyderabad','Telangana','+91 40 6666 1234',35,25,TRUE,'Buy 1 Get 1'),
('Shah Ghouse','Late-night biryani and haleem institution','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Hyderabadi',4.5,'Charminar','Hyderabad','Telangana','+91 40 2455 6677',25,18,FALSE,'₹100 OFF'),
('Chutneys','Popular unlimited South Indian thali','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.2,'Jubilee Hills','Hyderabad','Telangana','+91 40 2354 8899',22,18,FALSE,NULL),
('Bawarchi','Iconic biryani rival to Paradise','https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80','Hyderabadi',4.4,'RTC Cross Roads','Hyderabad','Telangana','+91 40 2761 5555',28,20,FALSE,NULL),
('Firdaus ITC Kohenur','Royal Hyderabadi fine dining','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80','Fine Dining',4.8,'ITC Kohenur, HITEC City','Hyderabad','Telangana','+91 40 6760 0000',14,8,TRUE,NULL),
('Ohri''s Jiva Imperia','Multi-cuisine with buffet spreads','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80','Continental',4.3,'Banjara Hills','Hyderabad','Telangana','+91 40 6651 0000',20,15,FALSE,'20% OFF'),
('Cream Stone','Famous ice cream and dessert parlour','https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80','Desserts',4.1,'Jubilee Hills','Hyderabad','Telangana','+91 40 2355 4321',10,8,FALSE,NULL),
('Tatva','Authentic Andhra meals and thali','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','South Indian',4.4,'Gachibowli','Hyderabad','Telangana','+91 40 2300 1234',16,12,FALSE,NULL),

-- Kolkata (8)
('Peter Cat','Iconic Park Street restaurant, Chelo Kebab','https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80','Continental',4.4,'Park Street','Kolkata','West Bengal','+91 33 2229 8841',22,16,FALSE,'₹100 OFF'),
('Oh! Calcutta','Authentic Bengali cuisine in elegant setting','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80','Bengali',4.5,'Forum Mall, Elgin Road','Kolkata','West Bengal','+91 33 2283 7161',18,12,TRUE,NULL),
('Arsalan','Famous for best biryani in Kolkata','https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80','Mughlai',4.6,'Park Circus','Kolkata','West Bengal','+91 33 2229 5678',25,18,TRUE,'₹50 OFF'),
('Flurys','Historic tea room and bakery since 1927','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80','Continental',4.4,'Park Street','Kolkata','West Bengal','+91 33 2229 7664',20,14,FALSE,NULL),
('6 Ballygunge Place','Traditional Bengali thali in heritage house','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80','Bengali',4.5,'Ballygunge','Kolkata','West Bengal','+91 33 2460 8899',16,10,TRUE,NULL),
('Mocambo','Retro Continental dining since 1956','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80','Continental',4.3,'Park Street','Kolkata','West Bengal','+91 33 2229 0643',14,10,FALSE,NULL),
('Bhojohori Manna','Authentic Bengali home-style cooking','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Bengali',4.4,'Hindustan Park','Kolkata','West Bengal','+91 33 2464 5678',12,8,FALSE,'10% OFF'),
('Nizam''s','Original kati roll inventors since 1932','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Street Food',4.5,'New Market','Kolkata','West Bengal','+91 33 2252 1234',10,8,TRUE,NULL),

-- Pune (6)
('Malaka Spice','Pan-Asian in charming garden setting','https://images.unsplash.com/photo-1526234362653-3b75a0c07438?w=400&q=80','Asian',4.5,'Lane 5, Koregaon Park','Pune','Maharashtra','+91 20 2615 2293',18,14,FALSE,'₹200 OFF'),
('Vaishali','Iconic South Indian breakfast since 1951','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.3,'FC Road','Pune','Maharashtra','+91 20 2553 5678',22,16,TRUE,NULL),
('Kayani Bakery','Heritage Irani bakery since 1955','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80','Bakery',4.4,'East Street, Camp','Pune','Maharashtra','+91 20 2636 1234',10,8,FALSE,NULL),
('The Creek','Riverside multi-cuisine fine dining','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80','Fine Dining',4.5,'Koregaon Park','Pune','Maharashtra','+91 20 2615 4455',16,10,FALSE,NULL),
('Shabree','Famous for Maharashtrian thali','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Maharashtrian',4.3,'JM Road','Pune','Maharashtra','+91 20 2553 9900',20,15,FALSE,NULL),
('German Bakery','Popular cafe with organic and European fare','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80','Continental',4.2,'Koregaon Park','Pune','Maharashtra','+91 20 2615 7788',14,10,FALSE,NULL),

-- Jaipur (6)
('Suvarna Mahal','Royal dining at Rambagh Palace','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80','Rajasthani',4.8,'Rambagh Palace','Jaipur','Rajasthan','+91 141 221 1919',16,8,TRUE,NULL),
('LMB','Heritage sweet shop and restaurant since 1727','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Rajasthani',4.4,'Johari Bazaar','Jaipur','Rajasthan','+91 141 256 5844',24,18,FALSE,'10% OFF'),
('1135 AD','Dining inside Amer Fort','https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80','Rajasthani',4.7,'Amer Fort','Jaipur','Rajasthan','+91 141 253 0135',14,8,TRUE,NULL),
('Tapri Central','Trendy tea lounge with snacks','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80','Cafe',4.3,'C-Scheme','Jaipur','Rajasthan','+91 141 405 7777',12,10,FALSE,NULL),
('Handi Restaurant','Famous for lal maas and Rajasthani curry','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80','Rajasthani',4.4,'MI Road','Jaipur','Rajasthan','+91 141 236 4839',18,14,FALSE,NULL),
('Niros','Continental and Indian since 1949','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80','Continental',4.3,'MI Road','Jaipur','Rajasthan','+91 141 237 4493',16,12,FALSE,NULL),

-- Ahmedabad (4)
('Agashiye','Rooftop Gujarati thali at House of MG','https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80','Gujarati',4.7,'The House of MG, Lal Darwaja','Ahmedabad','Gujarat','+91 79 2550 6946',18,12,TRUE,NULL),
('Manek Chowk','Famous night food market stalls','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Street Food',4.2,'Manek Chowk','Ahmedabad','Gujarat','+91 79 2550 1234',10,8,FALSE,'₹50 OFF'),
('Vishalla','Open-air village-style Gujarati dining','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80','Gujarati',4.5,'Sarkhej-Gandhinagar Highway','Ahmedabad','Gujarat','+91 79 2660 2422',30,22,TRUE,NULL),
('ZK''s','Fusion cuisine in upscale setting','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80','Continental',4.3,'SG Highway','Ahmedabad','Gujarat','+91 79 2685 3344',14,10,FALSE,NULL),

-- Goa (6)
('Fisherman''s Wharf','Goan seafood with waterside views','https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&q=80','Goan',4.4,'Cavelossim, South Goa','Goa','Goa','+91 832 287 1452',22,18,FALSE,'25% OFF'),
('Gunpowder','South Indian and Kerala in bohemian Assagao','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80','Kerala',4.6,'Assagao, North Goa','Goa','Goa','+91 832 226 8091',16,12,TRUE,NULL),
('Mum''s Kitchen','Authentic Goan home cooking','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Goan',4.5,'Panjim','Goa','Goa','+91 832 222 6364',14,10,FALSE,NULL),
('Vinayak Family Restaurant','Local favourite for fish thali','https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80','Goan',4.3,'Mapusa','Goa','Goa','+91 832 226 1234',16,14,FALSE,NULL),
('Thalassa','Greek taverna with cliff views','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80','Continental',4.5,'Vagator, North Goa','Goa','Goa','+91 832 227 4567',20,14,FALSE,'15% OFF'),
('Baba Au Rhum','French bakery and bistro','https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80','French',4.4,'Panjim','Goa','Goa','+91 832 242 2388',10,8,FALSE,NULL),

-- Lucknow (4)
('Tunday Kababi','Legendary galouti kebabs since 1905','https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80','Awadhi',4.7,'Aminabad','Lucknow','Uttar Pradesh','+91 522 220 3456',18,14,TRUE,NULL),
('Dastarkhwan','Authentic Lucknowi biryani and kebabs','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Awadhi',4.5,'Lalbagh','Lucknow','Uttar Pradesh','+91 522 222 5678',20,15,FALSE,'₹150 OFF'),
('Idris Biryani','Local biryani institution','https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80','Mughlai',4.4,'Chowk','Lucknow','Uttar Pradesh','+91 522 226 7890',14,10,FALSE,NULL),
('Royal Cafe','Famous for basket chaat and street food','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Street Food',4.3,'Hazratganj','Lucknow','Uttar Pradesh','+91 522 222 1234',12,8,FALSE,NULL),

-- Amritsar (3)
('Bharawan Da Dhaba','Famous for kulcha and lassi','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Punjabi',4.6,'Town Hall','Amritsar','Punjab','+91 183 255 3456',20,16,TRUE,'Buy 1 Get 1'),
('Kesar Da Dhaba','Legendary dal makhani since 1916','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Punjabi',4.7,'Chowk Passian','Amritsar','Punjab','+91 183 255 2103',16,12,TRUE,NULL),
('Beera Chicken','Famous tandoori chicken joint','https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80','Punjabi',4.4,'Lawrence Road','Amritsar','Punjab','+91 183 222 6677',14,10,FALSE,NULL),

-- Kochi (3)
('Kayees Rahmathulla','Legendary biryani since 1948','https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80','Kerala',4.5,'Fort Kochi','Kochi','Kerala','+91 484 221 5678',14,10,FALSE,NULL),
('Dal Roti','Authentic North Indian in Fort Kochi','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80','North Indian',4.3,'Fort Kochi','Kochi','Kerala','+91 484 221 6789',12,8,FALSE,NULL),
('Fusion Bay','Kerala seafood meets global cuisine','https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&q=80','Seafood',4.4,'Marine Drive','Kochi','Kerala','+91 484 237 8899',16,12,FALSE,'₹200 OFF'),

-- Chandigarh (3)
('Pal Dhaba','Iconic Punjabi dhaba on food street','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80','Punjabi',4.3,'Sector 28','Chandigarh','Chandigarh','+91 172 270 5678',20,16,FALSE,'20% OFF'),
('Sindhi Sweets','Famous for chole bhature and sweets','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Street Food',4.2,'Sector 17','Chandigarh','Chandigarh','+91 172 270 1234',16,12,FALSE,NULL),
('Yangtze','Chinese and Thai fine dining','https://images.unsplash.com/photo-1526234362653-3b75a0c07438?w=400&q=80','Chinese',4.4,'Sector 35','Chandigarh','Chandigarh','+91 172 260 3344',14,10,FALSE,NULL),

-- Varanasi (3)
('Kashi Chat Bhandar','Famous chaat by the ghats','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Street Food',4.4,'Dashashwamedh Ghat','Varanasi','Uttar Pradesh','+91 542 241 2345',8,6,FALSE,NULL),
('Baati Chokha','Authentic UP/Bihari cuisine','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','North Indian',4.3,'Assi Ghat','Varanasi','Uttar Pradesh','+91 542 241 5678',14,10,FALSE,NULL),
('Blue Lassi','Iconic lassi shop by the lanes','https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80','Street Food',4.6,'Kachori Gali','Varanasi','Uttar Pradesh','+91 542 241 6789',6,4,TRUE,NULL),

-- Indore (4)
('Sarafa Bazaar Night Market','Famous street food market','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Street Food',4.5,'Sarafa Bazaar','Indore','Madhya Pradesh','+91 731 252 1234',10,8,TRUE,NULL),
('Nafees','Mughlai and biryani institution','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Mughlai',4.3,'Chhappan Dukan','Indore','Madhya Pradesh','+91 731 252 5678',18,14,FALSE,NULL),
('Shreemaya Celebration','Multi-cuisine and events','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80','Continental',4.2,'Vijay Nagar','Indore','Madhya Pradesh','+91 731 255 6789',22,18,FALSE,NULL),
('Johny Hot Dog','Legendary street food since 1970','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Street Food',4.4,'Sarafa Bazaar','Indore','Madhya Pradesh','+91 731 252 3456',6,4,FALSE,'₹50 OFF'),

-- Mysore (3)
('Mylari','Famous for soft dosas since 1936','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.5,'Nazarbad','Mysore','Karnataka','+91 821 244 1234',12,8,TRUE,NULL),
('Hotel RRR','Known for non-veg Andhra meals','https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','South Indian',4.4,'Gandhi Square','Mysore','Karnataka','+91 821 244 5678',16,12,FALSE,NULL),
('Vinayaka Mylari','Legendary butter dosa spot','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.5,'Nazarbad','Mysore','Karnataka','+91 821 244 9012',10,8,FALSE,NULL),

-- Coimbatore (3)
('Annapoorna','Famous for South Indian and sweets','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80','South Indian',4.3,'RS Puram','Coimbatore','Tamil Nadu','+91 422 254 1234',20,16,FALSE,NULL),
('Shree Anandhaas','Premium South Indian chain','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80','South Indian',4.4,'Gandhipuram','Coimbatore','Tamil Nadu','+91 422 254 5678',22,18,TRUE,NULL),
('That Madras Place','Chettinad and Tamil cuisine','https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80','South Indian',4.3,'Race Course','Coimbatore','Tamil Nadu','+91 422 254 9012',14,10,FALSE,NULL),

-- Vizag (3)
('Bamboo Bay','Coastal Andhra seafood','https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&q=80','Seafood',4.3,'Beach Road','Vizag','Andhra Pradesh','+91 891 254 1234',16,12,FALSE,NULL),
('Sri Sai Ram Parlour','Famous for Andhra biryani','https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80','Hyderabadi',4.4,'Dwaraka Nagar','Vizag','Andhra Pradesh','+91 891 254 5678',14,10,FALSE,NULL),
('Gold Stone','Multi-cuisine and bakery','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80','Continental',4.2,'Siripuram','Vizag','Andhra Pradesh','+91 891 254 9012',18,14,FALSE,NULL),

-- Bhopal (3)
('Manohar Dairy','Iconic sweets and snacks since 1960','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Street Food',4.4,'Hamidia Road','Bhopal','Madhya Pradesh','+91 755 274 1234',14,10,FALSE,NULL),
('Under The Mango Tree','Rustic heritage dining','https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80','North Indian',4.3,'Shymala Hills','Bhopal','Madhya Pradesh','+91 755 274 5678',16,12,FALSE,NULL),
('Bapu Ki Kutia','Famous for poha-jalebi breakfast','https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Street Food',4.5,'Old Bhopal','Bhopal','Madhya Pradesh','+91 755 274 9012',8,6,TRUE,NULL);


-- 4. SEED MENU ITEMS
INSERT INTO menu_items (name, description, price, image_url, category, is_available) VALUES
('Paneer Tikka','Spiced cottage cheese grilled in clay oven with mint chutney',380,'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80','Starters',TRUE),
('Chicken Seekh Kebab','Minced chicken kebabs with aromatic spices',420,'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80','Starters',TRUE),
('Hara Bhara Kebab','Crispy spinach and green pea patties',320,'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80','Starters',TRUE),
('Bruschetta Al Pomodoro','Toasted bread with fresh tomatoes, basil, olive oil',350,'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80','Starters',TRUE),
('Fish Amritsari','Batter-fried fish with ajwain and besan coating',480,'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80','Starters',TRUE),
('Dahi Ke Kebab','Soft hung curd kebabs with subtle spices',360,'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80','Starters',TRUE),
('Butter Chicken','Tender chicken in rich tomato-butter gravy',450,'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80','Main Course',TRUE),
('Hyderabadi Dum Biryani','Slow-cooked aromatic basmati with spiced mutton',550,'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80','Main Course',TRUE),
('Palak Paneer','Cottage cheese cubes in creamy spinach gravy',380,'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80','Main Course',TRUE),
('Rogan Josh','Kashmiri slow-cooked lamb in aromatic red gravy',620,'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80','Main Course',TRUE),
('Chettinad Chicken','Spicy Tamil Nadu chicken with fresh masala',480,'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80','Main Course',TRUE),
('Dal Makhani','Creamy black lentils slow-cooked overnight',350,'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Main Course',TRUE),
('Kerala Fish Curry','Tangy coconut fish curry with kudampuli',520,'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80','Main Course',TRUE),
('Truffle Mushroom Risotto','Creamy arborio rice with wild mushrooms',650,'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80','Main Course',TRUE),
('Seared Salmon','Atlantic salmon with lemon butter sauce',890,'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80','Main Course',TRUE),
('Rajasthani Laal Maas','Fiery mutton curry with mathania chillies',580,'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80','Main Course',TRUE),
('Gulab Jamun','Golden fried milk dumplings in rose syrup',220,'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80','Desserts',TRUE),
('Tiramisu','Classic Italian coffee dessert with mascarpone',420,'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80','Desserts',TRUE),
('Rasmalai','Soft paneer discs in saffron-cardamom milk',280,'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80','Desserts',TRUE),
('Phirni','Mughlai ground rice pudding in clay pots',250,'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80','Desserts',TRUE),
('Mysore Pak','Traditional South Indian ghee and gram fudge',200,'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80','Desserts',TRUE),
('Masala Chai','Aromatic Indian spiced tea with ginger',120,'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80','Beverages',TRUE),
('Mango Lassi','Sweet yogurt drink with fresh Alphonso mango',180,'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80','Beverages',TRUE),
('Filter Coffee','Traditional South Indian decoction coffee',150,'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80','Beverages',TRUE),
('Fresh Lime Soda','Refreshing lime with soda, sweet or salted',130,'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80','Beverages',TRUE),
('Thandai','Chilled milk with almonds, fennel, rose petals',200,'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80','Beverages',TRUE),
('Chef''s Special Thali','Complete meal: dal, 2 sabzi, rice, roti, dessert',550,'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80','Specials',TRUE),
('Galouti Kebab Platter','Lucknowi melt-in-mouth kebabs with paratha',650,'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80','Specials',TRUE),
('Seafood Platter','Grilled prawns, fish tikka, calamari, crab cakes',980,'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80','Specials',TRUE),
('Weekend Brunch Platter','Eggs, pancakes, sausages, fruits, juice, bread',750,'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80','Specials',TRUE);


-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read restaurants" ON restaurants FOR SELECT USING (true);

-- Public insert for reservations and contacts
CREATE POLICY "Public create reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read reservations" ON reservations FOR SELECT USING (true);
CREATE POLICY "Public create contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read contacts" ON contacts FOR SELECT USING (true);

-- Service role full access (admin operations via backend)
CREATE POLICY "Service role full access menu" ON menu_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access reservations" ON reservations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access contacts" ON contacts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access restaurants" ON restaurants FOR ALL USING (auth.role() = 'service_role');
