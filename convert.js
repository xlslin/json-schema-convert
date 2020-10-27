const jsonfile = require('jsonfile')

var arguments = process.argv.splice(2);
const file = arguments[0]
const dfile = arguments[1]

function convert(file,dfile){
	jsonfile.readFile(file, function (err, obj) {
	   if (err) console.error(err)
	   putRequiredTogetherParent(obj)
	   jsonfile.writeFile(dfile, obj, function (err) {
		  if (err) console.error(err)
		})
	})
}

function putRequiredTogetherParent(parentObj){
	for(key in parentObj){
		var value= parentObj[key]
		console.log(key +","+value)
		if(value instanceof Object){
			if(key == "properties"){
				putRequiredTogether(value,parentObj)
			}else{
				putRequiredTogetherParent(value)
			}
		}
		if(key == "$schema"){
			parentObj[key]="http://json-schema.org/draft-04/schema#"
		}
	}
}

function putRequiredTogether(obj,parentObj){
	var requireArray = []
	for(key in obj){
		var value= obj[key]
		if(value instanceof Object){
			if(value["required"]){
				requireArray.push(key)
			}
			delete value["required"]
			putRequiredTogetherParent(value)
		}
	}
	if(requireArray.length>0 && parentObj){
		parentObj["required"]=requireArray
	}
}

convert(file,dfile)
