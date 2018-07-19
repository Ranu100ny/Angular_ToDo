app.controller('noteController', function($scope,$timeout,$mdDialog,$mdSidenav,noteService,$state,$window,$location)
{

    var baseUrl="http://localhost:8081/Fundo_Note/";

    $scope.noteModel = {
        title : "",
        description : "",
        color:"white",
        isPined : "false",
        isTrashed:"false",
        isArchived:"false"

    };


    $scope.sendToReminders = function() {
        $state.go('home.reminders');
    }

    $scope.sendToNotes = function() {
        $state.go('home.dashboard');
    }

    $scope.sendToArchive = function() {
        $state.go('home.archive');

    }

    $scope.sendToTrash = function()
    {
        $state.go('home.trash');
    }

    $scope.sendToLogin = function() {
        $window.localStorage.clear();
        $location.path('login');
    }


        $scope.changeColor = function()
        {
            $scope.colorValue={};
            $scope.current = $state.current;
            console.log("name",$scope.current.name);
            console.log("url",$scope.current.url);

            switch ($scope.current.name) {
                case 'home.dashboard':  $scope.title = "fundoo Notes";
                                        $scope.CustomColor = {
                                            'background-color': '#fb0',
                                            'color': 'black'
                                        }
                                        break;
                case 'home.reminders':  $scope.title = "Reminders";
                                        $scope.CustomColor = {
                                            'background-color': '#607d8b',
                                            'color': '#ffffff'
                                        }
                                        break;
                case 'home.archive':    $scope.title = "Archive";
                                        $scope.CustomColor = {
                                            'background-color': '#607d8b',
                                            'color': '#ffffff'
                                        }
                                        break;
                case 'home.trash'  :    $scope.title = "Trash";
                                        $scope.CustomColor = {
                                            'background-color': '#636363',
                                            'color': '#ffffff'
                                        }
                                        break;

            }

            $scope.colorValue=$scope.CustomColor;
            console.log("colorValue",angular.toJson($scope.colorValue));
           };


    $scope.changeColor();

    $scope.myDate = new Date();

    $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() - 2,
        $scope.myDate.getDate()
    );

    $scope.maxDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() + 2,
        $scope.myDate.getDate()
    );



    $scope.showDialog = function(event,note) {

        console.log("note Information",note);
        $mdDialog.show({
            locals : {noteInfo : note},
            controller: DialogCtrl,
            templateUrl: 'template/noteDialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });

    };
    function DialogCtrl($scope, $mdDialog,noteInfo) {
        console.log("note details",noteInfo);
        $scope.noteInfo= noteInfo;
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.updateNote=function(note)
        {
            var url=baseUrl+"updatenote";

            noteService.putAPIWithHeader(url,note).then(function successCallback(response) {
                $scope.getAllNotes();
                console.log("Update Successfully",response);
            }, function errorCallback(response) {
                console.log(" Update failed",response);
            });
        }


    }


    $scope.toggleLeft = buildToggler('left');


     function buildToggler(componentId) {
        return function() {
            $mdSidenav(componentId).toggle();
            var isOpen = $mdSidenav(componentId).isOpen();
            if (isOpen) {
                console.log("first time")

                if($state.is('home.dashboard'))
                {
                    document.getElementById('take-note-card').style.marginTop='35px';

                    document.getElementById('dashboard').style.marginLeft = '100px';
                }
                else
                {
                    document.getElementById('archive').style.marginLeft = '100px';
                }
            } else {

                if($state.is('home.dashboard'))
                {
                    document.getElementById('take-note-card').style.marginTop='30px';
                    document.getElementById('dashboard').style.marginLeft = '0px';
                }
                else
                {
                    document.getElementById('archive').style.marginLeft = '0px';
                }
            }
        };
    }

     $scope.isVisible = false;

     $scope.clickProfile = function() {
        $scope.isVisible = $scope.isVisible ? false : true;
    }




    $scope.isTrashedNote=function(note)
    {
        console.log("r2");
        var url=baseUrl+"updatenote";
        console.log("Before pin: ",note.trashed);
        if(note.trashed===false)
        {
            note.trashed=true;
            note.pined=false;
            console.log("After pin: ",note.trashed);
        }
        else
        {
            note.trashed=false;
            note.pined=false;
        }

        noteService.putAPIWithHeader(url,note).then(function successCallback(response) {
            $scope.getAllNotes();
            console.log("Update Successfully",response);
        }, function errorCallback(response) {
            console.log(" Update failed",response);
        });
    }

    $scope.performAction=function(task,note)
    {
        switch (task) {
            case 'Delete note':
                console.log("r1");
                $scope.isTrashedNote(note);
                break;
            case 'Add label':

                break;
            case 'Make a copy':

                break;
            case 'Show checkboxes':

                break;

            case 'Copy to Google Docs':

                break;
        }
    }

    $scope.isDeleteNote=function(task,note)
    {
       console.log("task",task);
        switch (task) {
            case 'Delete forever':

                 var url=baseUrl+"deletenote/";
                 noteService.deleteAPIWithHeader(url,note.id)  .then(function successCallback(response)
                 {
                     console.log("Delete Successfully",response);
                     $scope.getAllNotes();

                 }, function errorCallback(response) {
                     console.log("Delete Failed",response);
                 })

                break;
            case 'Restore': $scope.isTrashedNote(note);


                break;
        }
    }

    $scope.showArchiveNote;
    $scope.isArchivedNote=function(note)
    {
        var url=baseUrl+"updatenote";
        console.log("Before pin: ",note.archived);
        if(note.archived===false)
        {
            $scope.showArchiveNote=true;
            note.archived=true;
            note.pined=false;
            console.log("After pin: ",note.archived);
        }
        else
        {
            $scope.showArchiveNote=false;
            note.archived=false;
            note.pined=false;
        }

        noteService.putAPIWithHeader(url,note).then(function successCallback(response) {
            $scope.getAllNotes();
            console.log("Update Successfully",response);
        }, function errorCallback(response) {
            console.log(" Update failed",response);
        });
    }

    $scope.showCancel=function()
    {
     if($state.is('home.dashboard'))
     {
      $scope.showCancelIcon=false;
     }
     else
     {
         $scope.showCancelIcon=true;
     }
    }

    $scope.showPinedNote;

    $scope.isPinnedNote=function(note)
    {
        var url=baseUrl+"updatenote";
        console.log("Before pin: ",note.pined);
        if(note.pined===false)
        {
            $scope.showPinedNote=true;

            note.pined=true;
            note.archived=false;
            console.log("After pin: ",note.pined);
        }
        else
        {
            $scope.showPinedNote=false;
            note.pined=false;
        }

        noteService.putAPIWithHeader(url,note).then(function successCallback(response) {
            $scope.getAllNotes();
            console.log("Update Successfully",response);
        }, function errorCallback(response) {
            console.log(" Update failed",response);
        });
    }



    $scope.isChangedView=false;

    $scope.changeView=function()
    {
        $scope.isChangedView = $scope.isChangedView ? false : true;
        console.log("view",$scope.isChangedView);


        var notes = document.getElementsByClassName("card");

        console.log("notes",notes);
        if($scope.isChangedView)
        {
            for (i = 0; i < notes.length; i++) {
                notes[i].style.width = "79%";
                notes[i].style.marginLeft="10%";
            }
        }
        else
        {
            for (i = 0; i < notes.length; i++) {
                notes[i].style.width = "30%";
                notes[i].style.marginLeft="0%";
            }
        }


    }

   $scope.colors=
       [

           [
               {'name': 'White','value': 'white'},
               {'name': 'Red','value': '#ff8a80'},
               {'name': 'Orange','value': '#ffd180'},
               {'name': 'Yellow','value': '#ffff8d'}
           ]
       ,
               [
                   {'name': 'Green','value': '#ccff90'},
                   {'name': 'Teal','value': '#a7ffeb'},
                   {'name': 'Blue','value': '#80d8ff'},
                   {'name': 'Dark Blue','value': '#82b1ff'}

               ]
       ,
               [
                   {'name': 'Purple','value': '#b388ff'},
                   {'name': 'Pink','value': '#f8bbd0'},
                   {'name': 'Brown','value': '#d7ccc8'},
                   {'name': 'Gray','value': '#cfd8dc'}
               ]

   ];





    $scope.addNote = function(noteModel)
    {
      console.log("pin1",noteModel.isPined)
       noteModel.pined= noteModel.isPined;
        console.log("pin2",noteModel.isPined)
       var url=baseUrl+"addnote";
       console.log("Note Details", angular.toJson(noteModel));

       if(noteModel.title!="" && noteModel.description!="")
       {
               noteService.postAPIWithHeader(url,noteModel).then(function successCallback(response)
               {
                   $scope.showLogo=false;
                   $scope.showNote=true;
                   console.log("Add Note Successfully",response.data);
                   $scope.getAllNotes();
                   noteModel.title="";
                   noteModel.description="";
               },function errorCallback(response){
                   console.log("Add Note failed",response.data);
               })
           }

    };


    $scope.profileInfo=function()
    {
        $scope.value=noteService.getUserFromToken();
        console.log("value",$scope.value.iss)
        console.log("value",$scope.value.sub)
    }

    $scope.note_info=[];


    $scope.getAllNotes = function()
    {
      var url=baseUrl+"note";


        noteService.getAPIWithHeader(url).then(function successCallback(response)
        {
            console.log("Get Note Successfully",response.data);

            $scope.note_info=response.data;



            if($scope.note_info=="")
            {

              $scope.showNote=false;
                $scope.showLogo=true;
            }
            else
                {

                    $scope.showNote=true;
                    $scope.showLogo=false;


                    var keepGoing = true;

                    angular.forEach($scope.note_info,function(value){

                        console.log("value",value);
                        if(keepGoing)
                        {
                            if(value.pined)
                            {
                                $scope.showPinedNote=true;
                                keepGoing=false;
                            }
                        }
                    })



                }



        },function errorCallback(response){
            console.log("Get Note failed",response.data);
        })
    }



    $scope.enableEdit = function (item) {
        item.editable = true;
    };

    $scope.disableEdit = function (item) {
        item.editable = false;
    };



    $scope.changeInitialColor=function(value)
    {
      $scope.noteModel.color=value;
    }



    $scope.changeInitialPined=function(value)
    {

        if(!value)
        {
         console.log("T");
         color="blue";
         value=true;
        }
        else
        {
            console.log("F");
         value=false;
        }
        $scope.noteModel.isPined=value;
    }

    $scope.changeNoteColor=function(value,note)
    {
     var url=baseUrl+"updatenote";
     note.color=value;
     noteService.putAPIWithHeader(url,note).then(function successCallback(response) {
         $scope.getAllNotes();
         console.log("Update Successfully",response);
     }, function errorCallback(response) {
         console.log("Update Failed",response);
     });

    }

    $scope.more=['Delete note','Add label','Make a copy','Show checkboxes','Copy to Google Docs'];

    $scope.takenotemore=['Add label','Show checkboxes'];


    $scope.addTime=[
        [{'name':'Morning','value':'8:00 AM'}],
        [{'name':'Afternoon','value':'1:00 PM'}],
        [{'name':'Evening','value':'Mon,6:00 PM'}],
        [{'name':'Night','value':'8:00 PM'}]
    ];


    $scope.trashmore=['Delete forever','Restore'];

    $scope.reminders=[
        [{'name':'Later today','value':'8:00 PM'}],
        [{'name':'Tomorrow','value':'8:00 AM'}],
        [{'name':'Next Week','value':'Mon,8:00 AM'}],
        [{'name':'Home','value':'Jaitaran'}]
     ];




});
