
function Child(info){
    var self = this;
    self.name = ko.observable( info.name );
    self.color = ko.observable( info.color );
    self.classes = ko.observableArray(info.classes );
    self.progress = ko.observableArray( info.progress );
    self.class = ko.observable( info.classes[0] );
    self.classDays = ko.observableArray([]);
    self.data = ko.observable( );

    self.day = ko.observable( false );
    self.getData = function(){
        $.getJSON("data/" + self.class() + ".json" , function(data){
            var classDays = [];
            $.each( data , function( key , day ){
                classDays.push( day );
                console.log( day );
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
    self.child = ko.observable( false );
    self.child.subscribe( function(c){
        console.log( c );
    });
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
