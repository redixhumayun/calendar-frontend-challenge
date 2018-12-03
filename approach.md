## Assumptions

1. The appointments object will contain start and end times in 24-hour format. I made this assumption because it is much more likely that a server sends across time in a 24-hour format. 

2. The appointments object will contain appointments sorted by start time. I made this assumption because that was the order of the appointments object provided in the problem sheet. It should be relatively straightforward, however, to write a sorting function to accomplish this. 

## Approach

>My initial approach to the problem statement was that I needed to design a grid system of div's and the div's within each column would be offset from the top based on the time they started at. 

>However, this approach seemed to throw up more problems than solutions. 

>For instance, how do I deal with differing widths based on clashes between appointments? 

>Would I need differing grid widths in different areas of the calendar to account for clashes in different areas of the calendar?

>Problematic approach that might force me to write a custom grid layout, something I definitely didn't want to do. 

***

>My second approach was trying to solve the problem was to first try to figure out which appointments clashed. 

>If I could figure out which appointments clashed with each other, I could then divide the horizontal width available to me between clashing appointments. 

>Now, the question became how to find clashes between appointments. My first approach to this can be evidenced in the ```computeTimeClashes``` function. 

>I check every appointment with the preceding appointment to see if the current appointment starts earlier than the preceding appointment ends. If this is the case, it's a clash. Else, it's not. 

>Initially, I updated each appointment object with a property called ```clashes```, where the value of ```clashes``` was set to the number of appointments it clashed with. 

>The idea was to divide the total width of the calendar by the number of clashes each appointment would experience. This would give me the width of each appointment. 

>This would not give me the desired solution, however, because one of the constraints of the problem was to ensure that all clashing divs have the same width. 

***

>My final approach built upon my second approach. 

>I realized I didn't need to know how many appointments any individual appointment clashed with. I just needed to know if an appointment clashed with another appointment at all. 

>Also, I needed to know which appointments clashed together and also what order they clashed in. 

>I rewrote the ```computeTimeClashes``` function to write either a 1 or a 0 to the ```clashes``` property depending on if it clashed or not. 

>I wrote a ```createSeparateArrays``` function to separate appointments based on which appointments clashed together, not just clashed. This function actually renders the previous one obsolete, but I'm leaving it in there. 

>I wrote a ```calculateDimensions``` function to calculate individual dimensions for each appointment. 

***

## Notes

>There is a warning that appears in the browser regarding the tag ```<text>``` not being recognized in the browser. 

>I've included a TimeLineView component which was supposed to show a timeline of hours between 9 am and 9 pm. 

>Unfortunately, it doesn't line up with the height of the calendar div exactly because the text characters have their own height. 

>To get them to line up exactly, I had to change the font-size to 1px, which renders the characters almost invisible. If you see dashes on the left side, that's what it is. 

>I'm leaving it in there just as evidence of the approach.

>Finally, there are three appointmentData objects in the ```App.js``` file. I used these as test data objects. 

## Potential Improvements

1. Include unit tests for the codebase. Snapshot testing would probably be best

2. Move codebase to TypeScript. Might be overkill for a project with very few developers, but significantly improves refactoring time and developers also avoid silly bugs. 

3. Error handling. Probably with a ```componentDidCatch``` lifecycle hook in the parent ```Calendar.js``` container. 