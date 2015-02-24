require('colors');
function serverstart () {
    var today = new Date();
    return (today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear() + ' ') + 
        ((today.getHours() < 10)?"0":"") + 
        ((today.getHours()>12)?(today.getHours()-12):today.getHours()) +":"+ 
        ((today.getMinutes() < 10)?"0":"") + today.getMinutes() +":"+ 
        ((today.getSeconds() < 10)?"0":"") + today.getSeconds() + 
        ((today.getHours()>12)?('PM'):'AM'); 
}

var ascii = '\n\n' +

"  ███╗   ██╗ ██╗ ███╗   ███╗ ██████╗  ██╗     ███████╗ \n" +
"  ████╗  ██║ ██║ ████╗ ████║ ██╔══██╗ ██║     ██╔════╝ \n" +
"  ██╔██╗ ██║ ██║ ██╔████╔██║ ██████╔╝ ██║     █████╗   \n" +
"  ██║╚██╗██║ ██║ ██║╚██╔╝██║ ██╔══██╗ ██║     ██╔══╝   \n" +
"  ██║ ╚████║ ██║ ██║ ╚═╝ ██║ ██████╔╝ ███████╗███████╗ \n" +
"  ╚═╝  ╚═══╝ ╚═╝ ╚═╝     ╚═╝ ╚═════╝  ╚══════╝╚══════╝  v0.0.1\n";

ascii += "  > Service Starting...\n";
ascii += "  > " + serverstart() + "\n";
ascii += "  > working directory : " + process.cwd() + "\n";
ascii += "  > To shut down, press <CTRL> + C at any time.\n";

module.exports = function () {
    console.log(ascii.grey)
};