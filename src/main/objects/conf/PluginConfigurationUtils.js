.import "./PluginConfiguration.js" as Configuration

var configuration_holder

var configuration_path = "../resources/harmony_solver_plugin_configuration.json"
var configuration_save_path = "resources/harmony_solver_plugin_configuration.json"

function readTextFile(file)
{
    var request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.send(null);
    return request.responseText;
}

function readConfiguration(){
    var conf_text = readTextFile(configuration_path)
    var conf_json = JSON.parse(conf_text)

    var _solutionPath = conf_json["solutionPath"] === undefined ? "" : conf_json["solutionPath"]

    configuration_holder = new Configuration.PluginConfiguration(_solutionPath)
}


function saveConfiguration(){
    var conf_json = JSON.stringify(configuration_holder)
    save_text_file(configuration_path, conf_json)
}