var baseUrl = "https://allinonehomeschool.com/"
var jsdom = require("node-jsdom");
var fs = require('fs');

var subpage = 'getting-ready-1';
var days = {};
function cleanDayText( str ){
    return str.replace(/^(Day [0-9]{1,3})(.*)/ , "$1").replace( /\r?\n|\r/g , "" );
}
function matchesDay( str ){
    return str.match(/^Day [0-9]{1,3}/)
}

jsdom.env(
          baseUrl + subpage + "/",
            ["http://code.jquery.com/jquery.js"],
              function (errors, window) {
                  window.$('ul').each( function( ){
                      var self = this;
                      var DayFound = false;
                      var Day = "";
                      var getDayChecks = [
                          function( ){
                              return String( window.$(self).prev("p").text() );
                          },
                          function( ){
                              return String( window.$(self).prev("div").text() );
                          },
                          function( ){
                              return String( window.$(self).parent().prev("div").text() );
                          } ,
                          function( ){
                              return String( window.$(self).parent().prev("div").find("strong").last().text() );
                          },
                          function( ){
                              return String( window.$(self).parent().prev("div").children("div").text() );
                          }
                      ];

                      getDayChecks.forEach( function(func){
                          if( !DayFound ){
                              var dayToCheck = func( window , this );
                              if( matchesDay(dayToCheck ) ){
                                  DayFound = true;
                                  Day = cleanDayText( dayToCheck );
                              }
                          }
                      });
                      if( DayFound ){
                          var i = 1;
                          var dayInt = Day.replace(/[^0-9]/g , "" );
                          days[dayInt] = {
                              "title" : Day,
                              "day" : dayInt,
                              "items" : []
                          };
                          window.$(this).children().each( function(){
                              var item = {
                                  "text" : window.$(this).text(),
                                  "html" : window.$(this).html(),
                                  "links" : []
                              };
                              window.$(this).children("a").each( function(){
                                  item.links.push(window.$(this).attr('href'));
                              });
                              days[dayInt].items.push( item );
                          });
                      }
                } );
                console.log( days );
                fs.writeFile( subpage + ".json", JSON.stringify( days ) , function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                });
            }
 );
