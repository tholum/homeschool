function openLink( url ){
  console.log( url );
  Main.webview( url );

}
function replaceLink( html ){
  var clean = $( "<div>" + html + "</div>" );
  //return html;
  clean.find("a").each(function(){
    var link = $(this).attr("href");
    $(this).removeAttr("href");
    $(this).attr("orig-href" , link );
    $(this).attr("onclick" , "openLink( $(this).attr('orig-href') );" );
    //$(this).click( function(){ console.log("Click"); openLink( $(this).attr("orig-href") ); });
  });
  return clean.html();
}
function Child(info){
    var self = this;
    self.name = ko.observable( info.name );
    self.color = ko.observable( info.color );
    self.classes = ko.observableArray(info.classes );

    self.progress = ko.observableArray( info.progress );
    self.class = ko.observable( info.classes[0] );
    self.day = ko.computed(function(){
        var cls = self.class();
        var progress = self.progress();
        var day = 0;
        if( cls ){
            var match = ko.utils.arrayFilter( progress , function( pr ){
                return pr.class == cls;
            });
            if( match ){
                match.forEach( function(pr){
                    if( pr.day >= day ){
                        day = pr.day;
                    }
                });
            }
        }
        return day + 1;
    });
    self.done = function(){
            var day = self.day();
            var cls = self.class();
            self.progress.push( { "class" : cls , "day" : day });
            Main.save();
    };
    self.classDays = ko.observableArray([]);
    self.classDay = ko.computed( function(){
        var day = self.day();
        return ko.utils.arrayFirst( self.classDays() , function(c){
            return c.day == day;
        });
    });
    self.data = ko.observable( );




    self.getData = function(){
        $.getJSON("data/" + self.class() + ".json" , function(data){
            var classDays = [];
            $.each( data , function( key , day ){
                classDays.push( day );
            });
            self.classDays( classDays );
            self.data(data);
        });
    };

    self.toJson = function(){
        return {
            "name" : self.name(),
            "classes" : self.classes(),
            "progress" : self.progress(),
            "color" : self.color()
        };
    };
}

function main(){
    var self = this;
    self.webview = ko.observable(false);
    self.webview.subscribe( function(v){
        $(".webview").remove();
        if( v !== false ){
            if( String(v).indexOf("epbookspot") !== -1 ){
                $.get("https://epbookspot.wordpress.com/lesson-1/" , function( html ){
                    var webview = $("<div  class='webview'>" + $("<div >" + html + "</div>" ).find(".entry-content").html() + "</div>");
                    $("body").append(webview);
                } );
            } else {
                var webview = $(`<webview class="webview active" src="${v}" style="display:inline-flex;" plugins></webview>`);
                $("body").append(webview);
            }
        }
    });

    self.child = ko.observable( false );
    self.children = ko.observableArray();
    self.updateInfo = function(){
        var children = JSON.parse( localStorage.getItem( "children" ) );
        if( children ){
            var cleanChildren = [];
            children.forEach( function( child ){
                cleanChildren.push( new Child( child ) );
            });
            self.children(cleanChildren );
        }
    };
    self.save = function(){
        var cleanChildren = [];
        self.children().forEach( function( child ){
            cleanChildren.push( child.toJson() );
        });
        localStorage.setItem( "children" , JSON.stringify( cleanChildren ) );
    };
    self.addChild = function( child ){
        var base = {
            "name" : "",
            "color" : "",
            "classes" : [],
            "progress" : []
        };
        if( typeof child == "object" && child !== null ){
            child = $.extend( base , child );
        } else {
            child = base;
        }
        self.children.push( new Child( child ) );
        setTimeout( self.save );

    };
    self.updateInfo();
}
const {ipcRenderer} = require('electron')
ipcRenderer.on('openpage', (event, arg) => {
  console.log(arg) // prints "pong"
})
