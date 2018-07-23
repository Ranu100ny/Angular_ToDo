app.factory('labelService', function($http)
{
    var factory= {};

    factory.postAPIWithHeader = function(url,data)
    {
        var request =
            {
                method: "POST",
                url: url,
                headers: {
                    'userLoginToken': localStorage.getItem('tokenLogin'),
                },
                data: angular.toJson(data)
            }

        return $http(request);
    }

/*    function tokenDecode(str) {
        var output = str.replace('-', '+').replace('_', '/');

        return window.atob(output);
    }

    factory.getUserFromToken=function getUserFromToken() {
        var token = localStorage.getItem('tokenLogin');
        var user = {};
        if (token !== null) {
            var encoded = token.split('.')[1];
            console.log("encoded",encoded)
            user = JSON.parse(tokenDecode(encoded));
        }
        else
        {
            $location.path('login');
        }

        return user;
    }*/

    factory.deleteAPIWithHeader = function(url,labelId)
    {

        console.log("label ki id",labelId);
        var request =
            {
                method: "DELETE",
                url: url+labelId,
                headers: {
                    'userLoginToken': localStorage.getItem('tokenLogin')
                },
                data: angular.toJson(labelId)
            }

        return $http(request);
    }

    factory.getAPIWithHeader = function(url)
    {
        var request =
            {
                method: "GET",
                url: url,
                headers: {
                    'userLoginToken': localStorage.getItem('tokenLogin')
                }
            }

        return $http(request);
    };



    return factory;


/*
    factory.putAPIWithHeader = function(url,data)
    {
        var request =
            {
                method: "PUT",
                url: url,
                headers: {
                    'userLoginToken': localStorage.getItem('tokenLogin')
                },
                data: angular.toJson(data)
            }
        return $http(request);
    }
*/



});
