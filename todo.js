const mongoCollection = require("./mongoCollections");
const todoItems = mongoCollection.todoItems;
const uuidv1 = require("uuid/v1");

let exportedMethods = {

	async getTask(id) {
		if (!id) throw "You must provide an id to search for";

		const todoItemsCollection = await todoItems();
		const todo = await todoItemsCollection.findOne({ _id: id });
		if (todo === null) throw "No item with that id";

		return todo;
	},
	async getAllTasks() {
		const todoItemsCollection = await todoItems();

		const items = await todoItemsCollection.find({}).toArray();

		return items;
	},
	async createTask(title, description) {
		if (!title) throw "You must provide a title for the item";
		if (!description) throw "You must provide a description for the item";
		const uuid = uuidv1();
		const todoItemsCollection = await todoItems();
		let newItem = {
			_id: uuid,
			title: title,
			description: description,
			completed: false,
			completedAt: null
		}
		const insertInfo = await todoItemsCollection.insertOne(newItem);
		if (insertInfo.insertedCount === 0) throw "Could not add item";
		const item = await this.getTask(uuid);
		return item;
	},
	async completeTask(taskId) {
		if (!taskId) throw "You must provide an id for a task to complete";
	
		const todoItemsCollection = await todoItems();
		const itemToUpdate = await this.getTask(taskId);
		const date = new Date();
		const updateInfo = await todoItemsCollection.updateOne({ _id: taskId }, {$set: {"completed": true, "completedAt": date}});
		if (updateInfo.modifiedCount === 0) {
			throw "Could not complete task successfully";
		}
		return await this.getTask(taskId);
	},

	async removeTask(id) {
		if (!id) throw "You must provide an id for a task to remove";
	
		const todoItemsCollection = await todoItems();
		const deletionInfo = await todoItemsCollection.removeOne({ _id: id });
	
		if (deletionInfo.deletedCount === 0) {
			throw "Could not delete task with id $(id)";
		}
		else {
			return true;
		}
	}
};

module.exports = exportedMethods;
