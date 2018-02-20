const todoItems = require("./todo");
const connection = require("./mongoConnection");

const main = async () => {
	console.log("Creating Task......");
	const item = await todoItems.createTask("Ponder Dinosaurs", "Has Anyone Really Been Far Even as Decided to Use Even Go Want to do Look More Like?")
	console.log(item);
	console.log("Creating Second Task.....");
	const item2 = await todoItems.createTask("Play Pokemon with Twitch TV", "Should we revive Helix?");
	const allItems = await todoItems.getAllTasks();
	console.log("Showing all tasks......");
	console.log(allItems);
	console.log("Removing first task.......");
	await todoItems.removeTask(item._id);
	const getItems = await todoItems.getAllTasks();
	console.log("These are the remaining tasks......");
	console.log(getItems);
	
	console.log("Completing remaining tasks");
	await todoItems.completeTask(item2._id);
	const updatedItem2 = await todoItems.getTask(item2._id);
	console.log("Task completed");
	console.log(updatedItem2);

	const db = await connection();
	await db.serverConfig.close();
};

main().catch(error => {
	console.log(error);
});
