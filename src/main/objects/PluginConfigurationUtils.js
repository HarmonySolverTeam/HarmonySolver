.import "./PluginConfiguration.js" as Configuration

var configuration_holder

var configuration_path = "../resources/configuration.json"

function readTextFile(file)
{
    var request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.send(null);
    return request.responseText;
}

function save_text_file(file_name, content){
    var a = document.createElement("a");
    var file = new Blob([content], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = file_name;
    a.click();
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