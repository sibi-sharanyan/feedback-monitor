ALWAYS KEEP IN MIND , I need to finish the essential features first , I can always consider 
updating the system down the road.

The system will be exclusively built only for the R2017 regulation , As I can't offerd to 
add the seperate details for R2013 (Thoug I need to consider dooing it)

The app will have ease of use at the sacrifice of security.
I need to maintain users just for the sake of accounted results.
There won't be an option to register.
Login will be the only option and the students will always have to enter the same details 
for register and login.
There will be NO password. Anyone can enter into any user's account.
I should keep the process of logging in minimal.
The essential details I need include :
1. Name of the student 
2. Register number (This will be both the username and password , I need to convert 
the entered regno to lowercase (not necessary))  
3. Department and section
4. Year (Should try to possibly find out the year from the entered Register number)

Once the student is logged in , he will be taken to the student panel.
I need not waste much time on the student panel as of now.


//Index page
The index page will have the only have a neatly made form asking the students to enter
their details.





//test scheduler
once the user clicks create test , a unique code needs to be genereated . The code needs to be unique and should not be already present in the database. 
the database format should be like 
        code - subjectname - teachername
        the respective name of the test should be saved with the code in a seperate table.
        

//main database to store the test scores
This database is teh most important , I need tot make it as effecient as possible , But , I'll
first make it functional

required fields 
1. test code
2. student regno 
3. staff 
4. subject
5. 