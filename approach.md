## Assumptions

1. The appointments object will contain start and end times in 24-hour format. I made this assumption because it is much more likely that a server sends across time in a 24-hour format. 

2. The appointments object will contain appointments sorted by start time. I made this assumption because that was the order of the appointments object provided in the problem sheet. It should be relatively straightforward, however, to write a sorting function to accomplish this. 

## Approach

Iterate over the appointments array, and separate it into multiple arrays based on which appointments each one clashes with

>Eg: Take the example provided in the problem sheet. I'll represent it with an array of numbers instead of an array of objects

```
[
  { start: "09:45", end: "11:15" },
  { start: "18:10", end: "19:00" },
  { start: "18:30", end: "19:30" },
  { start: "19:05", end: "20:05" }
]

[0, 1, 2, 3] -> [[0], [1,2], [2,3], [3]]
```

* Appointment 0 does not clash with any other appointment. 
* Appointment 1 clashes with appointment 2
* Appointment 2 clashes with appointment 3
* Appointment 3 does not clash with anything below it because it is the last appointment

I then calculate the dimensions of each of the appointments

Finally, remove all of the duplicate appointments from the nested array and calculate the left margin

***

## Notes

>There is a warning that appears in the browser regarding the tag ```<text>``` not being recognized in the browser. This seems to be an issue with React based on some [GitHub issues](https://github.com/facebook/react/issues/11899)

>I've included a TimeLineView component which was supposed to show a timeline of hours between 9 am and 9 pm. 

>Unfortunately, it doesn't line up with the height of the calendar div exactly because the text characters have their own height. 

>To get them to line up exactly, I had to change the font-size to 1px, which renders the characters almost invisible. If you see dashes on the left side, that's what it is. 

>I'm leaving it in there just as evidence of the approach.

>Finally, there are three appointmentData objects in the ```App.js``` file. I used these as test data objects. 

## Potential Improvements

1. Include unit tests for the codebase. Snapshot testing would probably be best

2. Move codebase to TypeScript. Might be overkill for a project with very few developers, but significantly improves refactoring time and developers also avoid silly bugs. 

3. Improved error handling. Currently done with a ```componentDidCatch``` lifecycle hook around the ```Calendar.js``` container with a basic check to see if props are provided. 