# This is a simple electron app for homeschool

My Kids currently are going through https://allinonehomeschool.com/ Which is an exelent free homeschooling site, Unfortunatly it is missing a few key features ( Tracking , Easy to read on smaller screens ext ) So I wrote a scrapper to grab the data, and I am currently writting a kid friendly ui for it

This is very much in alpha stages, There is no ui for adding kids, Managing Printers ext,

## REQUIREMENTS
* Pepper Flash Player 

```bash
sudo apt install pepperflashplugin-nonfree
``


## TODO Feature List

* Get all links to open in app 
* Get Flash to work ( https://github.com/electron/electron/blob/master/docs/tutorial/using-pepper-flash-plugin.md )
* Kid friendly dialog to print pdf's
* Track Progress

## Extended wishlist
* Scrape all words known by child ( when they go through getting-ready-2, so I can find story's that have words they know that are interesting to them )
* Add ability to Remotely help a child with homework via webcam , mic and Remotly viewing what there screen looks like ( So I can help when at work )
* Add kahn accadamy and other learning sources
* Block ability to click links within linked pages ( If it is a youtube video that is linked in the lesson, I do not want my kids to accidently click an ad )
