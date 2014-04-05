function findTop3(arr)
{
	function include(arr,obj) {
    if(arr.indexOf(obj) != -1)
    {
    	return(1);
    }
    else
    {
    	return(0);
    }
}
var map = {};
for(var i=0;i<arr.length;i++)
{		
	if(arr[i] in map)
	{
		console.log('Exists and increasing');
		map[arr[i]] += 1;		
	}
	else
	{
		console.log('Does not exist');
		map[arr[i]]=1;	
	}	
}

console.log(map);

var keys=[];
for(item in map)
{
	keys.push(item);
}
console.log('KEYS:'+keys);
var max_values=[];
for(var i=0;i<3;i++)
{
	var max=keys[0];
	for(var j=0;j<keys.length;j++)
	{
	if(map[keys[j]] > map[max])
		{
			max = keys[j];
		}		
	}
	console.log('Pushing'+max)
	max_values.push(max)
	//Remove key from array
	var ind = keys.indexOf(max);
	if(ind >= 0)
	{
		keys.splice(ind,1);
	}	
}

console.log(max_values);

}