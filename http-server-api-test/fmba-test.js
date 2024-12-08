var User = /** @class */ (function () {
    function User(name, password) {
        this.name = name;
        this.password = password;
    }
    User.prototype.getUserData = function () {
        console.log("User name:".concat(this.name, " and password length is ").concat(this.password.length));
    };
    return User;
}());
var newUser = new User('test', 'some_pass');
newUser.getUserData();
