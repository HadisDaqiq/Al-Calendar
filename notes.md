
<!-- focus on the audience, who is going to be using this app, and what feature will be most useful to them -->
<!-- It is the ability to use this app as a calendar assistance, therefore entring a command and it scheduling a meeting as
accuratly as possiable -->
<!--  -->
<!-- writing a command is the same amount of work for me as if i were to go to my google calendar and manually add
event, I would personally use this calendar app if its voice integrated that way this app becomes my personal assistant to schedule things -->

<!-- 

API's response to START_TIME is inaccurate with prompt:
"Invite everyone to a new 1 hour all-hands to start off the week next week. Have it at the beginning of the day" 

In one case:
if today is thrusday, it returns next week on friday. meaning api is adding 8 days to current day and returning, instead of calculating when next week starts. 
In another case:
it returns the end of this week/friday. 

This is not due to changes made in createPromptPrefix function to use moment. it seems to be chatgpt3's problem.


Again api's response is inconsistant sometimes it abides by defaulting meetings that has no specific DURATION to the 30mins value and somtimes it changes it to 60 mins.

Changed the prompt(in createPromptPrefix func) in an attempt to make it easier to register 30 min default value. it sometimes work and sometimes doesnt.


A solution would be to hardcode these logic. 
these can be hard coded for now ->


