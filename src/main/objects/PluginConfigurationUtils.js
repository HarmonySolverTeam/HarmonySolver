.import "./PluginConfiguration.js" as Configuration

var configuration_holder

function readTextFile(file)
{
    var request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.send(null);
    var returnValue = request.responseText;

    return returnValue;
}


function readConfiguration(){
    var conf_text = readTextFile("../resources/configuration.json")
    var conf_json = JSON.parse(conf_text)

    var _solutionPath = conf_json["solutionPath"] === undefined ? "" : conf_json["solutionPath"]

    configuration_holder = new Configuration.PluginConfiguration(_solutionPath)
}


function saveConfiguration(configuration){



}