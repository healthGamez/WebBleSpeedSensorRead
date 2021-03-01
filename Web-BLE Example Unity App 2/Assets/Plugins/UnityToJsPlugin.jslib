mergeInto(LibraryManager.library,
{
	Connect: function()
	{
		console.log("Connect button pressed in unity");	
		connect();
	},

	StartBLENotification:function()
	{
		console.log("Start button pressed in unity");
		start();
	},

	StopBLENotification:function()
	{
		console.log("Stop button pressed in unity");
		stop();
	},
});